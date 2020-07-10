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

const getItem = async (stripePriceId, userId) => {
  return getItemHelper(stripePriceId, userId);
};

const getItems = async (entityId, userId) => {
  return getShopItems(entityId, userId);
};

const getCart = async (entityId, userId) => {
  return getCartItems(userId);
};

const getCartItemsOrdered = async (entityId, userId) => {
  return getCartItemsOrderedHelper(userId);
};

const addToCart = async (body, userId) => {
  await addCartItem(body, userId);
  return getCartItems(userId);
};

const updateCartItems = async (body, userId) => {
  await updateCartItemsHelper(body, userId);
  return getCartItems(userId);
};

const removeCartItemInstance = async (query, userId) => {
  await removeCartItemInstanceHelper(query, userId);
  return getCartItems(userId);
};

const removeAllInstancesFromCart = async (query, userId) => {
  await removeAllInstancesFromCartHelper(query, userId);
  return getCartItems(userId);
};

const clearCart = async (query, userId) => {
  await clearCartHelper(query, userId);
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
