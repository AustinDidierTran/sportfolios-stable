import * as queries from '../../db/queries/cart.js';
import { Buyer, Seller,Item, TaxRates, CartTotal } from '../../../../typescript/types';

export const getCartItems = async (userId: string) => {
  const cartItems: any = await queries.getCartItems(userId);
  const groupedMap = cartItems.reduce(
    (entryMap: any, e: any) => {
      if(!entryMap[e.stripePrice.owner_id]){
        entryMap[e.stripePrice.owner_id] = [];
      }
      entryMap[e.stripePrice.owner_id].push(e);
      return entryMap;
    },
    {}
  );
  const buyers = { 
    buyers: [{ //TODO add logic for multiple buyer
      sellers: Object.keys(groupedMap).map((key) => (
      {
        entity:{
          id: groupedMap[key][0].stripePrice.owner.entity_id,
          name: groupedMap[key][0].stripePrice.owner.name,
          photoUrl: groupedMap[key][0].stripePrice.owner.photo_url,
          verifiedAt: groupedMap[key][0].stripePrice.owner.verified_at,
          deletedAt: groupedMap[key][0].stripePrice.owner.deleted_at,
        },
        isMember:false, //todo when personId is available
        items: groupedMap[key].map((i: any)=>({
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
          requiresMembership: false, //todo
        })as Item)
      })as Seller)
    } as Buyer]
  };

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