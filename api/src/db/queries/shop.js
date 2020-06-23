const { getShopItems } = require('../helpers/shop');

const getItems = async (entity_id, user_id) => {
  return getShopItems(entity_id, user_id);
};

module.exports = {
  getItems,
};
