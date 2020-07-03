const {
  getItem: getItemHelper,
  getShopItems,
  addCartItem,
  updateCartItems: updateCartItemsHelper,
  removeCartItemInstance: removeCartItemInstanceHelper,
  removeAllInstancesFromCart: removeAllInstancesFromCartHelper,
  clearCart: clearCartHelper,
  getCartItems,
  getCartItemsOrdered: getCartItemsOrderedHelper,
} = require('../helpers/shop');

const getItem = async (stripe_price_id, user_id) => {
  return getItemHelper(stripe_price_id, user_id);
};

const getItems = async (entity_id, user_id) => {
  return getShopItems(entity_id, user_id);
};

const getCart = async (entity_id, user_id) => {
  return getCartItems(user_id);
};

const getCartItemsOrdered = async (entity_id, user_id) => {
  return getCartItemsOrderedHelper(user_id);
};

const addToCart = async (body, user_id) => {
  await addCartItem(body, user_id);
};

const updateCartItems = async (body, user_id) => {
  await updateCartItemsHelper(body, user_id);
};

const removeCartItemInstance = async (query, user_id) => {
  await removeCartItemInstanceHelper(query, user_id);
};

const removeAllInstancesFromCart = async (query, user_id) => {
  await removeAllInstancesFromCartHelper(query, user_id);
};

const clearCart = async (query, user_id) => {
  await clearCartHelper(query, user_id);
};

module.exports = {
  getItem,
  getItems,
  getCart,
  getCartItemsOrdered,
  addToCart,
  updateCartItems,
  removeCartItemInstance,
  removeAllInstancesFromCart,
  clearCart,
};
