const {
  getShopItems,
  getCartItems,
  addCartItem,
} = require('../helpers/shop');

const getItems = async (entity_id, user_id) => {
  return getShopItems(entity_id, user_id);
};

const getCart = async (entity_id, user_id) => {
  return getCartItems(entity_id, user_id);
};

const addToCart = async (entity_id, user_id) => {
  return addCartItem(entity_id, user_id);
};

module.exports = {
  getItems,
  getCart,
  addToCart,
};
