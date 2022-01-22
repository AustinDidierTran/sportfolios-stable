import { cartItems } from '../models/cartItems.js';

export const getCartItems = async userId => {
  const res = await cartItems
    .query()
    .withGraphJoined('[stripePrice.[stripeProduct, storeItems, taxRates, owner]]')
    .where('cart_items.user_id', userId);

  return res;
};