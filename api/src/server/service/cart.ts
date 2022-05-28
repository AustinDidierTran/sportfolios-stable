import * as queries from '../../db/queries/cart.js';
import {
  Buyer,
  Seller,
  Item,
  TaxRates,
  CartTotal,
} from '../../../../typescript/types';

const getSubtotal = (list: any): number => {
  return list
    .filter((c: any) => c.selected)
    .reduce(
      (previous: number, obj: any) =>
        previous + obj.quantity * obj.stripePrice.amount,
      0,
    );
};

const getTransactionFee = (list: any): number => {
  return list
    .filter((c: any) => c.selected)
    .reduce(
      (previous: number, obj: any) =>
        previous + obj.quantity * obj.stripePrice.transaction_fees,
      0,
    );
};

const getTaxes = (list: any): TaxRates[] => {
  const taxes = list
    .filter((c: any) => c.selected)
    .reduce((previous: any, obj: any) => {
      obj.stripePrice.taxRates.reduce((e: any, tax: any) => {
        if (!previous[tax.id]) {
          previous[tax.id] = {
            display: tax.display_name,
            id: tax.id,
            percentage: tax.percentage,
            amount: 0,
          };
        }
        previous[tax.id].amount =
          previous[tax.id].amount +
          Math.floor(
            (obj.stripePrice.amount * obj.quantity * tax.percentage) / 100,
          );
      }, {});
      return previous;
    }, {});
  return Object.keys(taxes).map(
    key =>
      ({
        display: taxes[key].display,
        id: taxes[key].id,
        percentage: taxes[key].percentage,
        amount: taxes[key].amount,
      } as TaxRates),
  );
};

export const getCartItems = async (userId: string): Promise<any> => {
  const cartItems: any = await queries.getCartItems(userId);
  const groupedBuyers = cartItems.reduce((entryMap: any, e: any) => {
    if (!entryMap[e.person_id]) {
      entryMap[e.person_id] = [];
    }
    entryMap[e.person_id].push(e);
    return entryMap;
  }, {});
  const buyers = Object.keys(groupedBuyers).map(keyBuyer => {
    const groupedSellers = groupedBuyers[keyBuyer].reduce(
      (entryMap: any, e: any) => {
        if (!entryMap[e.stripePrice.owner_id]) {
          entryMap[e.stripePrice.owner_id] = [];
        }
        entryMap[e.stripePrice.owner_id].push(e);
        return entryMap;
      },
      {},
    );
    const subTotalBuyer = getSubtotal(groupedBuyers[keyBuyer]);
    const transactionFeeBuyer = getTransactionFee(groupedBuyers[keyBuyer]);
    const taxesBuyer = getTaxes(groupedBuyers[keyBuyer]);
    return {
      person: {
        id: groupedBuyers[keyBuyer][0].person_id,
        surname:
          groupedBuyers[keyBuyer][0].personEntity?.entitiesGeneralInfos.surname,
        name:
          groupedBuyers[keyBuyer][0].personEntity?.entitiesGeneralInfos.name,
        photoUrl:
          groupedBuyers[keyBuyer][0].personEntity?.entitiesGeneralInfos
            .photo_url,
        verifiedAt: groupedBuyers[keyBuyer][0].personEntity?.verified_at,
        deletedAt: groupedBuyers[keyBuyer][0].personEntity?.deleted_at,
      },
      sellers: Object.keys(groupedSellers).map(key => {
        const subTotalSeller = getSubtotal(groupedSellers[key]);
        const transactionFeeSeller = getTransactionFee(groupedSellers[key]);
        const taxesSeller = getTaxes(groupedSellers[key]);

        return {
          entity: {
            id: groupedSellers[key][0].stripePrice.owner.entity_id,
            name: groupedSellers[key][0].stripePrice.owner.name,
            photoUrl: groupedSellers[key][0].stripePrice.owner.photo_url,
            verifiedAt: groupedSellers[key][0].stripePrice.owner.verified_at,
            deletedAt: groupedSellers[key][0].stripePrice.owner.deleted_at,
          },
          membership:
            groupedBuyers[keyBuyer][0].personMemberships.length > 0
              ? groupedBuyers[keyBuyer][0].personMemberships.reduce(
                  (previous: any, obj: any) => {
                    if (
                      obj.organization_id ==
                      groupedSellers[key][0].stripePrice.owner.entity_id
                    )
                      return previous.expiration_date > obj.expiration_date
                        ? previous
                        : obj;
                  },
                ).expiration_date
              : null,
          items: groupedSellers[key].map(
            (i: any) =>
              ({
                id: i.id,
                metadata: i.metadata,
                price: i.stripePrice.amount,
                description: i.stripePrice.stripeProduct.description,
                label: i.stripePrice.stripeProduct.label,
                photoUrl: i.stripePrice.storeItems.photo_url,
                quantity: i.quantity,
                taxRates: i.stripePrice.taxRates.map(
                  (t: any) =>
                    ({
                      display: t.display_name,
                      id: t.id,
                      percentage: t.percentage,
                      amount: Math.floor(
                        (i.stripePrice.amount * i.quantity * t.percentage) /
                          100,
                      ),
                    } as TaxRates),
                ),
                checked: i.selected,
                requiresMembership:
                  i.stripePrice.stripeProduct.require_membership,
              } as Item),
          ),
          subTotal: subTotalSeller,
          taxes: taxesSeller,
          transactionFees: transactionFeeSeller,
          total:
            subTotalSeller +
            transactionFeeSeller +
            Object.keys(taxesSeller).reduce(
              (previous: number, key: any) =>
                previous + taxesSeller[key].amount,
              0,
            ),
        } as Seller;
      }),
      subTotal: subTotalBuyer,
      taxes: taxesBuyer,
      transactionFees: transactionFeeBuyer,
      total:
        subTotalBuyer +
        transactionFeeBuyer +
        Object.keys(taxesBuyer).reduce(
          (previous: number, key: any) => previous + taxesBuyer[key].amount,
          0,
        ),
    } as Buyer;
  });

  const subTotal = getSubtotal(cartItems);
  const taxes = getTaxes(cartItems);
  const transactionFee = getTransactionFee(cartItems);
  return {
    total: {
      subTotal: subTotal,
      taxes: taxes,
      transactionFees: transactionFee,
      total:
        subTotal +
        transactionFee +
        Object.keys(taxes).reduce(
          (previous: number, key: any) => previous + taxes[key].amount,
          0,
        ),
    } as CartTotal,
    buyers: buyers,
  };
};

export const putSelectedItems = async (
  { selected, cartItemId }: { selected: boolean; cartItemId: string },
  userId: string,
) => {
  await queries.putSelectedItems(cartItemId, userId, selected);

  return getCartItems(userId);
};
