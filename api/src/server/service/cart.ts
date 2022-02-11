import moment from 'moment';
import * as queries from '../../db/queries/cart.js';
import { Buyer, Seller,Item, TaxRates, CartTotal } from '../../../../typescript/types';

export const getCartItems = async (userId: string) => {
  const cartItems: any = await queries.getCartItems(userId);
  const groupedBuyers = cartItems.reduce(
    (entryMap: any, e: any) => {
      if(!entryMap[e.person_id]){
        entryMap[e.person_id] = [];
      }
      entryMap[e.person_id].push(e);
      return entryMap;
    },
    {}
  );
  const buyers =  Object.keys(groupedBuyers).map((keyBuyer) => {
      const groupedSellers = groupedBuyers[keyBuyer].reduce(
        (entryMap: any, e: any) => {
          if(!entryMap[e.stripePrice.owner_id]){
            entryMap[e.stripePrice.owner_id] = [];
          }
          entryMap[e.stripePrice.owner_id].push(e);
          return entryMap;
        },
        {}
      );
      return {     
        person:{
          id:groupedBuyers[keyBuyer][0].person_id,
          surname:groupedBuyers[keyBuyer][0].personEntity?.entitiesGeneralInfos.surname,
          name:groupedBuyers[keyBuyer][0].personEntity?.entitiesGeneralInfos.name,
          photoUrl: groupedBuyers[keyBuyer][0].personEntity?.entitiesGeneralInfos.photo_url,
          verifiedAt: groupedBuyers[keyBuyer][0].personEntity?.verified_at,
          deletedAt: groupedBuyers[keyBuyer][0].personEntity?.deleted_at,
        }, 
        sellers: Object.keys(groupedSellers).map((key) => (
          {
            entity:{
              id: groupedSellers[key][0].stripePrice.owner.entity_id,
              name: groupedSellers[key][0].stripePrice.owner.name,
              photoUrl: groupedSellers[key][0].stripePrice.owner.photo_url,
              verifiedAt: groupedSellers[key][0].stripePrice.owner.verified_at,
              deletedAt: groupedSellers[key][0].stripePrice.owner.deleted_at,
            },
            isMember: groupedBuyers[keyBuyer][0].personMemberships.filter((m: any) => (m.organization_id == groupedSellers[key][0].stripePrice.owner.entity_id) && moment(m.expiration_date) > moment() ).length > 0,
            items: groupedSellers[key].map((i: any)=>({
              id: i.id,
              metadata: i.metadata,
              price: i.stripePrice.amount,
              description: i.stripePrice.stripeProduct.description,
              label: i.stripePrice.stripeProduct.label,
              photoUrl: i.stripePrice.storeItems.photo_url,
              quantity: i.quantity,
              taxRates: i.stripePrice.taxRates.map((t: any)=>({
                display: t.display_name,
                id: t.id,
                percentage: t.percentage,
                amount: Math.floor(i.stripePrice.amount * i.quantity * t.percentage/100)
              })as TaxRates),
              checked: i.selected,
              requiresMembership: i.stripePrice.stripeProduct.require_membership,
            })as Item)
          })as Seller)
    }as Buyer
  });  

  const subTotal = cartItems.filter((c: any) => c.selected ).reduce((previous: number, obj: any) => previous + obj.quantity*obj.stripePrice.amount,0);
  const taxes = cartItems.filter((c: any) => c.selected ).reduce((previous: any, obj: any) => {
    obj.stripePrice.taxRates.reduce((e: any, tax: any) => {
      if(!previous[tax.id]){
        previous[tax.id] = 
        {
          display:tax.display_name,
          id: tax.id,
          percentage: tax.percentage,
          amount: 0
        };
      }
      previous[tax.id].amount = previous[tax.id].amount +  Math.floor(obj.stripePrice.amount * obj.quantity * tax.percentage/100) ;
    },{})
    return previous;
  },{});
  
  return  {
    total:{
      subTotal: subTotal,
      taxes: Object.keys(taxes).map((key) => (
        {
          display: taxes[key].display_name,
          id: taxes[key].id,
          percentage: taxes[key].percentage,
          amount: taxes[key].amount
        })as TaxRates),
        total: subTotal +  Object.keys(taxes).reduce((previous: number, key: any) => previous + taxes[key].amount ,0)
    } as CartTotal,
    buyers:buyers
  }
};