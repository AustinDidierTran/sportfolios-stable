const knex = require('../connection');
const {
  stripeErrorLogger,
  stripeLogger,
} = require('../../server/utils/logger');

const getItem = async stripe_price_id => {
  try {
    const res = await knex('stripe_price')
      .select(
        'store_items.entity_id',
        'store_items.photo_url',
        'stripe_price.active',
        'stripe_price.amount',
        'stripe_price.stripe_price_id',
        'stripe_price.stripe_product_id',
        'stripe_product.description',
        'stripe_product.label',
      )
      .leftJoin(
        'store_items',
        'store_items.stripe_price_id',
        '=',
        'stripe_price.stripe_price_id',
      )
      .leftJoin(
        'stripe_product',
        'stripe_product.stripe_product_id',
        '=',
        'stripe_price.stripe_product_id',
      )
      .where('stripe_price.stripe_price_id', stripe_price_id);
    return res;
  } catch (err) {
    /* eslint-disable-next-line */
    console.error('GetItem error', err);
    throw err;
  }
};

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
        'cart_items.id',
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

  await knex('cart_items').insert({
    stripe_price_id: stripe_price_id,
    user_id: user_id,
  });

  return stripe_price_id;
};

const removeCartItemInstance = async query => {
  const { cart_instance_id } = query;

  try {
    await knex('cart_items')
      .where({ id: cart_instance_id })
      .del();
  } catch (err) {
    /* eslint-disable-next-line */
    console.error('removeCartItem error', err);
    throw err;
  }
};

const removeAllInstancesFromCart = async query => {
  const { stripe_price_id } = query;

  try {
    await knex('cart_items')
      .where({ stripe_price_id: stripe_price_id })
      .del();
  } catch (err) {
    /* eslint-disable-next-line */
    console.error('removeAllInstancesFromCart error', err);
    throw err;
  }
};

const clearCart = async (query, user_id) => {
  try {
    await knex('cart_items')
      .where({ user_id })
      .del();
  } catch (err) {
    stripeErrorLogger('removeCartItems error', err);
    throw err;
  }
};

module.exports = {
  getItem,
  getShopItems,
  getCartItems,
  addCartItem,
  removeCartItemInstance,
  removeAllInstancesFromCart,
  clearCart,
};
