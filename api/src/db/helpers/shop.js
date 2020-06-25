const knex = require('../connection');

const getShopItems = async entity_id => {
  const res = await knex('store_items')
    .select(
      'store_items.entity_id',
      'stripe_price.stripe_price_id',
      'stripe_price.stripe_product_id',
      'stripe_product.label',
      'stripe_product.description',
      'stripe_price.amount',
      'stripe_price.active',
      'store_items.photo_url',
    )
    .leftJoin(
      'stripe_price',
      'stripe_price.stripe_price_id',
      '=',
      'store_items.stripe_price_id',
    )
    .leftJoin(
      'stripe_product',
      'stripe_product.stripe_product_id',
      '=',
      'stripe_price.stripe_product_id',
    )
    .where('store_items.entity_id', entity_id);

  return res;
};

const getCartItems = async user_id => {
  const res = await knex('cart_items')
    .select(
      'cart_items.user_id',
      'stripe_price.stripe_price_id',
      'stripe_price.stripe_product_id',
      'stripe_product.label',
      'stripe_product.description',
      'stripe_price.amount',
      'stripe_price.active',
      'store_items.photo_url',
    )
    .leftJoin(
      'stripe_price',
      'stripe_price.stripe_price_id',
      '=',
      'cart_items.stripe_price_id',
    )
    .leftJoin(
      'stripe_product',
      'stripe_product.stripe_product_id',
      '=',
      'stripe_price.stripe_product_id',
    )
    .leftJoin(
      'store_items',
      'store_items.stripe_price_id',
      '=',
      'stripe_price.stripe_price_id',
    )
    .where('cart_items.user_id', user_id);
  return res;
};

const addCartItem = async (body, user_id) => {
  const { stripe_price_id } = body;

  await knex('cart_items').insert({
    stripe_price_id: stripe_price_id,
    user_id: user_id,
  });

  return stripe_price_id;
};

const removeCartItem = async (body, user_id) => {
  const { stripe_price_id } = body;

  return await knex('cart_items')
    .where({ user_id, stripe_price_id })
    .del();
};

const removeCartItems = async (body, user_id) => {
  return await knex('cart_items')
    .where({ user_id })
    .del();
};

module.exports = {
  getShopItems,
  getCartItems,
  addCartItem,
  removeCartItem,
  removeCartItems,
};
