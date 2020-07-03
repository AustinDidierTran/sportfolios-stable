const knex = require('../connection');
const {
  stripeErrorLogger,
  stripeLogger,
} = require('../../server/utils/logger');

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
  try {
    const cartItems = await knex('cart_items')
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
    stripeLogger('CartItems', cartItems);
    return cartItems || [];
  } catch (err) {
    stripeErrorLogger('GetCartItem error', err);
    throw err;
  }
};

const addCartItem = async (body, user_id) => {
  const { stripe_price_id } = body;

  const [price] = await knex('stripe_price')
    .select('*')
    .where({ stripe_price_id });
  const metadata = price.metadata;

  await knex('cart_items').insert({
    stripe_price_id,
    user_id,
    metadata,
  });

  return stripe_price_id;
};

const removeCartItem = async (query, user_id) => {
  const { stripe_price_id } = query;

  try {
    await knex('cart_items')
      .where({ user_id: user_id, stripe_price_id: stripe_price_id })
      .del();
    stripeLogger('Removed Item:');
  } catch (err) {
    stripeErrorLogger('removeCartItem error', err);
    throw err;
  }
};

const removeCartItems = async (query, user_id) => {
  try {
    await knex('cart_items')
      .where({ user_id })
      .del();
    stripeLogger('Removed all cart items');
  } catch (err) {
    stripeErrorLogger('removeCartItems error', err);
    throw err;
  }
};

module.exports = {
  getShopItems,
  getCartItems,
  addCartItem,
  removeCartItem,
  removeCartItems,
};
