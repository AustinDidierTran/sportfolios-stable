const knex = require('../connection');
const {
  stripeErrorLogger,
  stripeLogger,
} = require('../../server/utils/logger');

const getItem = async stripePriceId => {
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
      .where('stripe_price.stripe_price_id', stripePriceId);
    return res;
  } catch (err) {
    /* eslint-disable-next-line */
    console.error('GetItem error', err);
    throw err;
  }
};

const getShopItems = async entityId => {
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
    .where('store_items.entity_id', entityId);

  return res.map(i => ({
    active: i.active,
    amount: i.amount,
    description: i.description,
    entityId: i.entity_id,
    label: i.label,
    photoUrl: i.photoUrl,
    stripePriceId: i.stripe_price_id,
    stripeProductId: i.stripe_product_id,
  }));
};

const getCartItems = async userId => {
  try {
    const cartItems = await knex('cart_items')
      .select(
        'cart_items.stripe_price_id',
        'cart_items.metadata',
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
      .where('cart_items.user_id', userId);
    stripeLogger('CartItems', cartItems);
    return (
      cartItems.map(i => ({
        active: i.active,
        amount: i.amount,
        description: i.description,
        id: i.id,
        label: i.label,
        photoUrl: i.photo_url,
        stripePriceId: i.stripe_price_id,
        stripeProductId: i.stripe_product_id,
        userId: i.user_id,
      })) || []
    );
  } catch (err) {
    stripeErrorLogger('GetCartItem error', err);
    throw err;
  }
};

const groupBy = (list, keyGetter) => {
  const map = new Map();
  list.forEach(item => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
};

const groupedCart = cart => {
  const grouped = groupBy(cart, item => item.stripePriceId);
  const keys = Array.from(grouped.keys());
  const groupedItems = keys.map(key => {
    return {
      ...cart.find(e => e.stripePriceId == key),
      nbInCart: grouped.get(key).length,
    };
  });
  return groupedItems;
};

const getCartItemsOrdered = async userId => {
  const cart = await getCartItems(userId);
  return groupedCart(cart);
};

const addCartItem = async (body, userId) => {
  const { stripePriceId, metadata } = body;

  await knex('cart_items').insert({
    stripe_price_id: stripePriceId,
    user_id: userId,
    metadata,
  });
  return stripePriceId;
};

const updateCartItems = async (body, userId) => {
  const { stripePriceId, nbInCart: newNb, metadata } = body;

  const currCart = await getCartItems(userId);
  const currCartOrdered = await getCartItemsOrdered(userId);
  const prevNb = currCartOrdered.find(
    e => e.stripePriceId == stripePriceId,
  ).nbInCart;
  const diff = newNb - prevNb;

  if (diff > 0) {
    for (let i = 0; i < diff; i++) {
      await addCartItem({ stripePriceId, metadata }, userId);
    }
  } else if (diff < 0) {
    var deletedIds = [];
    for (let i = 0; i < -diff; i++) {
      const cartInstanceId = currCart.find(
        e =>
          e.stripePriceId == stripePriceId &&
          !deletedIds.includes(e.id),
      ).id;

      await removeCartItemInstance({
        cartInstanceId,
      });
      deletedIds.push(cartInstanceId);
    }
  }
};

const removeCartItemInstance = async query => {
  const { cartInstanceId } = query;

  try {
    await knex('cart_items')
      .where({ stripe_price_id: cartInstanceId })
      .del();
  } catch (err) {
    /* eslint-disable-next-line */
    console.error('removeCartItem error', err);
    throw err;
  }
};

const removeAllInstancesFromCart = async query => {
  const { stripePriceId } = query;

  try {
    await knex('cart_items')
      .where({ stripe_price_id: stripePriceId })
      .del();
  } catch (err) {
    /* eslint-disable-next-line */
    console.error('removeAllInstancesFromCart error', err);
    throw err;
  }
};

const clearCart = async (query, userId) => {
  try {
    await knex('cart_items')
      .where({ user_id: userId })
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
  getCartItemsOrdered,
  addCartItem,
  updateCartItems,
  removeCartItemInstance,
  removeAllInstancesFromCart,
  clearCart,
};
