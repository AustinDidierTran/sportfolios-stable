import { cartItems } from '../models/cartItems.js';

export const getCartItems = async userId => {
  const res = await cartItems
    .query()
    .withGraphJoined(
      '[stripePrice.[stripeProduct, storeItems, taxRates, owner], personEntity.entitiesGeneralInfos, personMemberships]',
    )
    .where('cart_items.user_id', userId);

  return res;
};

export const insertCartItem = async ({
  stripePriceId,
  metadata,
  quantity,
  selected,
  type,
  userId,
  personId = null,
}) => {
  return await cartItems.query().insert({
    stripe_price_id: stripePriceId,
    quantity,
    selected,
    user_id: userId,
    metadata: { ...metadata, type },
    person_id: personId,
  });
};

export const putSelectedItems = async (cartItemId, userId, selected) => {
  return cartItems
    .query()
    .update({ selected })
    .where({
      id: cartItemId,
      user_id: userId,
    });
};

export const updateCartItemQuantity = async (
  quantity,
  stripePriceId,
  userId,
) => {
  return await cartItems
    .query()
    .patch({
      quantity,
    })
    .where({ stripe_price_id: stripePriceId, user_id: userId });
};
