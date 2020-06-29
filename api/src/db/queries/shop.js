const {
  getShopItems,
  getCartItems,
  addCartItem,
  removeCartItem,
  removeCartItems,
} = require('../helpers/shop');

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

const deleteCartItem = async (body, user_id) => {
  await removeCartItem(body, user_id);
  return getCartItems(user_id);
};

const deleteCartItems = async (body, user_id) => {
  await removeCartItems(body, user_id);
  return getCartItems(user_id);
};

module.exports = {
  getItems,
  getCart,
  addToCart,
  deleteCartItem,
  deleteCartItems,
};
