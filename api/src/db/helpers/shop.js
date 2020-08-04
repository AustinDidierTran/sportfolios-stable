const knex = require('../connection');
const { stripeErrorLogger } = require('../../server/utils/logger');
const { ERROR_ENUM } = require('../../../../common/errors');
const { GLOBAL_ENUM } = require('../../../../common/enums');

const getItem = async stripePriceId => {
  const [item] = await knex('stripe_price')
    .select(
      'store_items.entity_id',
      'store_items.photo_url',
      'stripe_price.active',
      'stripe_price.amount',
      'stripe_price.stripe_price_id',
      'stripe_price.stripe_product_id',
      'stripe_product.description',
      'stripe_product.label',
      'stripe_product.metadata',
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

  if (!item) {
    return null;
  }

  return {
    active: item.active,
    amount: item.amount,
    description: item.description,
    entityId: item.entity_id,
    label: item.label,
    metadata: item.metadata,
    photoUrl: item.photo_url,
    stripePriceId: item.stripe_price_id,
    stripeProductId: item.stripe_product_id,
  };
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
    photoUrl: i.photo_url,
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
        'cart_items.id',
        'cart_items.quantity',
        'stripe_price.stripe_price_id',
        'stripe_price.stripe_product_id',
        'stripe_price.metadata AS stripe_price_metadata',
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
      .where('cart_items.user_id', userId)
      .orderBy('cart_items.created_at');
    return (
      cartItems.map(i => ({
        active: i.active,
        amount: i.amount,
        description: i.description,
        id: i.id,
        label: i.label,
        metadata: i.metadata,
        quantity: i.quantity,
        photoUrl: i.photo_url,
        stripePriceId: i.stripe_price_id,
        stripePriceMetadata: i.stripe_price_metadata,
        stripeProductId: i.stripe_product_id,
        userId: i.user_id,
      })) || []
    );
  } catch (err) {
    stripeErrorLogger('GetCartItem error', err);
    throw err;
  }
};

const getCartTotal = async userId => {
  const items = await knex('cart_items')
    .select(['stripe_price.amount', 'cart_items.quantity'])
    .leftJoin(
      'stripe_price',
      'cart_items.stripe_price_id',
      '=',
      'stripe_price.stripe_price_id',
    )
    .where('cart_items.user_id', userId);

  const total = items.reduce(
    (prev, curr) => prev + curr.amount * curr.quantity,
    0,
  );

  return total;
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
  const {
    stripePriceId,
    metadata,
    quantity: addedQuantity = 1,
  } = body;

  const { size } = metadata;

  const whereQuery = {
    user_id: userId,
    stripe_price_id: stripePriceId,
  };

  if (size) {
    whereQuery.size = size;
  }

  const [{ id, quantity } = {}] = await knex
    .select(['id', 'quantity', 'size'])
    .from(
      knex('cart_items')
        .select(knex.raw("*, metadata ->> 'size' AS size"))
        .as('cart_items'),
    )
    .where(whereQuery);

  if (!id) {
    await knex('cart_items').insert({
      stripe_price_id: stripePriceId,
      user_id: userId,
      metadata: {
        type: GLOBAL_ENUM.SHOP_ITEM,
        ...metadata,
      },
      quantity: addedQuantity,
    });
  } else {
    await knex('cart_items')
      .update({
        quantity: quantity + addedQuantity,
      })
      .where({ id });
  }

  return stripePriceId;
};

const addEventCartItem = async (body, userId) => {
  const { stripePriceId, metadata } = body;
  await knex('cart_items').insert({
    stripe_price_id: stripePriceId,
    user_id: userId,
    metadata,
  });
};

const updateCartItems = async (body, userId) => {
  const { cartItemId, quantity } = body;

  let nbChanged;

  if (quantity < 1) {
    await knex('cart_items')
      .where({ id: cartItemId, user_id: userId })
      .del();
  } else {
    nbChanged = await knex('cart_items')
      .update({ quantity })
      .where({
        id: cartItemId,
        user_id: userId,
      });
  }

  if (nbChanged === 0) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }
};

const addItemToPaidStoreItems = async query => {
  const {
    sellerEntityId,
    quantity,
    unitAmount,
    amount,
    stripePriceId,
    buyerUserId,
    invoiceItemId,
    metadata,
  } = query;

  await knex('store_items_paid').insert({
    seller_entity_id: sellerEntityId,
    quantity,
    unit_amount: unitAmount,
    amount,
    stripe_price_id: stripePriceId,
    buyer_user_id: buyerUserId,
    invoice_item_id: invoiceItemId,
    metadata: {
      size: metadata.size,
    },
  });
};

const removeCartItemInstance = async query => {
  const { cartInstanceId } = query;
  try {
    await knex('cart_items')
      .where({ id: cartInstanceId })
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

const clearCart = async userId => {
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
  addCartItem,
  addEventCartItem,
  addItemToPaidStoreItems,
  clearCart,
  getCartItems,
  getCartItemsOrdered,
  getCartTotal,
  getItem,
  getShopItems,
  removeAllInstancesFromCart,
  removeCartItemInstance,
  updateCartItems,
};
