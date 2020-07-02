const {
  getItem: getItemHelper,
  getShopItems,
  getCartItems,
  addCartItem,
  removeCartItemInstance: removeCartItemInstanceHelper,
  removeAllInstancesFromCart: removeAllInstancesFromCartHelper,
  clearCart: clearCartHelper,
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

const addToCart = async (body, user_id) => {
  await addCartItem(body, user_id);
  return getCartItems(user_id);
};

const removeCartItemInstance = async (query, user_id) => {
  await removeCartItemInstanceHelper(query, user_id);
  return getCartItems(user_id);
};

const removeAllInstancesFromCart = async (query, user_id) => {
  await removeAllInstancesFromCartHelper(query, user_id);
  return getCartItems(user_id);
};

const clearCart = async (query, user_id) => {
  await clearCartHelper(query, user_id);
  return getCartItems(user_id);
};

module.exports = {
  getItem,
  getItems,
  getCart,
  addToCart,
  removeCartItemInstance,
  removeAllInstancesFromCart,
  clearCart,
};
