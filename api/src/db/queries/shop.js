import knex from '../connection.js';
import { stripeErrorLogger } from '../../server/utils/logger.js';
import { ERROR_ENUM } from '../../../../common/errors/index.js';
import { getEmailsEntity } from '../queries/entity-deprecate.js';
import { CART_ITEM } from '../../../../common/enums/index.js';
import { storeItemsAllInfos } from '../models/storeItemsAllInfos.js';
import { cartItems } from '../models/cartItems.js';

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
      'stripe_product.metadata',
      'taxRates.id as taxRatesId',
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
    .leftJoin(
      knex('tax_rates_stripe_price')
        .select(knex.raw('json_agg(tax_rate_id) AS id'), 'stripe_price_id')
        .groupBy('stripe_price_id')
        .as('taxRates'),
      'taxRates.stripe_price_id',
      '=',
      'stripe_price.stripe_price_id',
    )
    .whereRaw(`stripe_product.metadata::jsonb @> '{"type": "shop_item"}'`)
    .where('store_items.entity_id', entityId)
    .orderBy('store_items.created_at', 'asc');

  return res.map(i => ({
    active: i.active,
    amount: i.amount,
    description: i.description,
    entityId: i.entity_id,
    label: i.label,
    photoUrl: i.photo_url,
    stripePriceId: i.stripe_price_id,
    stripeProductId: i.stripe_product_id,
    sizes: i.metadata.sizes,
    taxRatesId: i.taxRatesId,
  }));
};

const getAllShopItems = async type => {
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
    .leftJoin('entities', 'store_items.entity_id', '=', 'entities.id')
    .where('entities.type', type);

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

const getTaxRates = async stripe_price_id => {
  const stripePriceIds = Array.isArray(stripe_price_id)
    ? stripe_price_id
    : [stripe_price_id];

  const taxRates = await knex('tax_rates')
    .select('*')
    .leftJoin(
      'tax_rates_stripe_price',
      'tax_rates_stripe_price.tax_rate_id',
      '=',
      'tax_rates.id',
    )
    .whereIn('tax_rates_stripe_price.stripe_price_id', stripePriceIds);

  return taxRates.map(t => ({
    active: t.active,
    description: t.description,
    displayName: t.display_name,
    id: t.id,
    inclusive: t.inclusive,
    percentage: t.percentage,
    stripePriceId: t.stripe_price_id,
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
        'cart_items.selected',
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
    cartItems.forEach(item => {
      if (!item.metadata.type || item.amount === 0) {
        deleteCartItems(item.id, item.user_id);
      }
    });
    const res = await Promise.all(
      cartItems
        .filter(c => c.metadata.type)
        .map(async i => ({
          active: i.active,
          amount: i.amount,
          description: i.description,
          id: i.id,
          label: i.label,
          metadata: i.metadata,
          quantity: i.quantity,
          selected: i.selected,
          photoUrl: i.photo_url,
          stripePriceId: i.stripe_price_id,
          stripePriceMetadata: i.stripe_price_metadata,
          stripeProductId: i.stripe_product_id,
          userId: i.user_id,
          taxRates: await getTaxRates(i.stripe_price_id),
        })) || [],
    );
    return res;
  } catch (err) {
    stripeErrorLogger('GetCartItem error', err);
    throw err;
  }
};

const getCartItem = async cartItemId => {
  const [cartItem] = await knex('cart_items')
    .select(
      'cart_items.stripe_price_id',
      'cart_items.metadata',
      'cart_items.user_id',
      'cart_items.id',
      'cart_items.quantity',
      'cart_items.selected',
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
    .where('cart_items.id', cartItemId);

  const taxRates = await getTaxRates(cartItem.stripe_price_id);

  const res = {
    active: cartItem.active,
    amount: cartItem.amount,
    description: cartItem.description,
    id: cartItem.id,
    label: cartItem.label,
    metadata: cartItem.metadata,
    quantity: cartItem.quantity,
    selected: cartItem.selected,
    photoUrl: cartItem.photo_url,
    stripePriceId: cartItem.stripe_price_id,
    stripePriceMetadata: cartItem.stripe_price_metadata,
    stripeProductId: cartItem.stripe_product_id,
    userId: cartItem.user_id,
    taxRates,
  };
  return res;
};

export const getCartItemByStripePriceId = async (stripePriceId, userId) => {
  const [cartItem] = await knex('cart_items')
    .select(
      'cart_items.stripe_price_id',
      'cart_items.metadata',
      'cart_items.user_id',
      'cart_items.id',
      'cart_items.quantity',
      'cart_items.selected',
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
    .where('cart_items.stripe_price_id', stripePriceId)
    .andWhere('cart_items.user_id', userId);

  if (!cartItem) {
    return null;
  }

  const taxRates = await getTaxRates(cartItem.stripe_price_id);

  const res = {
    active: cartItem.active,
    amount: cartItem.amount,
    description: cartItem.description,
    id: cartItem.id,
    label: cartItem.label,
    metadata: cartItem.metadata,
    quantity: cartItem.quantity,
    selected: cartItem.selected,
    photoUrl: cartItem.photo_url,
    stripePriceId: cartItem.stripe_price_id,
    stripePriceMetadata: cartItem.stripe_price_metadata,
    stripeProductId: cartItem.stripe_product_id,
    userId: cartItem.user_id,
    taxRates,
  };
  return res;
};

const getCartTotal = async userId => {
  const items = await knex('cart_items')
    .select([
      'stripe_price.amount',
      'cart_items.quantity',
      'cart_items.metadata',
      'stripe_price.stripe_price_id',
    ])
    .leftJoin(
      'stripe_price',
      'cart_items.stripe_price_id',
      '=',
      'stripe_price.stripe_price_id',
    )
    .where('cart_items.user_id', userId)
    .andWhere('cart_items.selected', true);

  const withTaxes = await Promise.all(
    items.map(async i => ({
      taxes: await getTaxRates(i.stripe_price_id),
      ...i,
    })),
  );

  const res = withTaxes.reduce((prev, curr) => {
    const res = curr.taxes.map(t => ({
      id: t.id,
      amount: Math.round(curr.quantity * curr.amount * t.percentage) / 100,
      displayName: t.displayName,
      percentage: t.percentage,
      description: t.description,
    }));
    return prev.concat(res);
  }, []);

  const taxes = res.reduce((prev, curr) => {
    const index = prev.findIndex(p => {
      return p.id === curr.id;
    });
    if (index === -1) {
      return [...prev, curr];
    } else {
      prev[index].amount = prev[index].amount + curr.amount;
      return prev;
    }
  }, []);

  const subtotal = items.reduce(
    (prev, curr) => prev + curr.amount * curr.quantity,
    0,
  );

  const total =
    subtotal +
    taxes.reduce((prev, curr) => {
      return prev + curr.amount;
    }, 0);

  return { total, subtotal, taxes };
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
  const { stripePriceId, metadata, quantity: addedQuantity = 1 } = body;

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
        type: CART_ITEM.SHOP_ITEM,
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

const getPurchases = async userId => {
  const purchases = await knex('store_items_paid')
    .select([
      'stripe_product.label',
      'stripe_product.description',
      'store_items_paid.quantity',
      'store_items_paid.amount',
      'store_items_paid.metadata',
      'store_items_paid.created_at',
      'store_items_paid.seller_entity_id',
      'store_items.photo_url',
      'receipts.receipt_url',
    ])
    .leftJoin(
      'stripe_price',
      'store_items_paid.stripe_price_id',
      '=',
      'stripe_price.stripe_price_id',
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
      'store_items_paid.stripe_price_id',
    )
    .leftJoin('receipts', 'receipts.id', '=', 'store_items_paid.receipt_id')
    .where('store_items_paid.buyer_user_id', userId);

  const res = await Promise.all(
    purchases.map(async p => {
      const email = await getEmailsEntity(p.seller_entity_id);
      return {
        ...p,
        photoUrl: p.photo_url,
        createdAt: p.created_at,
        email,
      };
    }),
  );
  return res;
};

const getSales = async body => {
  // eslint-disable-next-line
  const { id: entityId, query } = body;

  // SPO-71 - Optimize this call so that it supports query
  const sales = await knex('store_items_paid')
    .select([
      'stripe_product.label',
      'stripe_product.description',
      'store_items_paid.quantity',
      'store_items_paid.amount',
      'user_email.email',
      'entities_general_infos.name',
      'entities_general_infos.surname',
      'entities_general_infos.photo_url AS personPhotoUrl',
      'store_items_paid.metadata',
      'store_items.photo_url',
      'store_items_paid.created_at',
    ])
    .leftJoin(
      'stripe_price',
      'store_items_paid.stripe_price_id',
      '=',
      'stripe_price.stripe_price_id',
    )
    .leftJoin(
      'stripe_product',
      'stripe_product.stripe_product_id',
      '=',
      'stripe_price.stripe_product_id',
    )
    .leftJoin(
      'user_email',
      'store_items_paid.buyer_user_id',
      '=',
      'user_email.user_id',
    )
    .leftJoin(
      'store_items',
      'store_items_paid.stripe_price_id',
      '=',
      'store_items.stripe_price_id',
    )
    .leftJoin(
      'user_primary_person',
      'user_primary_person.user_id',
      '=',
      'store_items_paid.buyer_user_id',
    )
    .leftJoin(
      'entities_general_infos',
      'entities_general_infos.entity_id',
      '=',
      'user_primary_person.primary_person',
    )
    .whereRaw(`stripe_product.metadata::jsonb @> '{"type": "shop_item"}'`)
    .where('store_items_paid.seller_entity_id', entityId);

  return sales.map(s => ({
    amount: s.amount,
    createdAt: s.created_at,
    description: s.description,
    label: s.label,
    metadata: s.metadata,
    photoUrl: s.photo_url,
    quantity: s.quantity,
    buyer: {
      email: s.email,
      primaryPerson: {
        name: s.name,
        surname: s.surname,
        photoUrl: s.personPhotoUrl,
      },
    },
  }));
};

const addMembershipCartItem = async (body, userId) => {
  const { stripe_price_id } = body;
  await knex('cart_items').insert({
    stripe_price_id,
    user_id: userId,
    metadata: { ...body, type: CART_ITEM.MEMBERSHIP },
  });
};

const updateCartItems = async (body, userId) => {
  const { cartItemId, quantity, selected } = body;
  if (selected === true || selected === false) {
    await knex('cart_items')
      .update({ selected })
      .where({
        id: cartItemId,
        user_id: userId,
      });
  }

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

const deleteCartItems = async (cartItemId, userId) => {
  await knex('cart_items')
    .where({ id: cartItemId, user_id: userId })
    .del();
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
    receiptUrl,
    transactionFees,
  } = query;
  const [receipt] = await knex('receipts')
    .insert({
      receipt_url: receiptUrl,
      user_id: buyerUserId,
    })
    .returning('*');

  await knex('store_items_paid').insert({
    seller_entity_id: sellerEntityId,
    quantity,
    unit_amount: unitAmount,
    amount,
    stripe_price_id: stripePriceId,
    buyer_user_id: buyerUserId,
    invoice_item_id: invoiceItemId,
    transaction_fees: transactionFees,
    metadata,
    receipt_id: receipt.id,
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

const deleteCartItem = async cartItemId => {
  const cartItem = await knex('cart_items')
    .del()
    .where({ id: cartItemId })
    .returning('*');
  return cartItem;
};

export const getActiveStoreItemsAllInfos = async () => {
  return await storeItemsAllInfos
    .query()
    .withGraphJoined('stripePrice')
    .where('store_items_all_infos.active', true);
};

export const insertCartItem = async ({
  stripePriceId,
  metadata,
  quantity,
  selected,
  type,
  userId,
}) => {
  return await cartItems.query().insert({
    stripe_price_id: stripePriceId,
    quantity,
    selected,
    user_id: userId,
    metadata: { ...metadata, type },
  });
};

export const updateCartItemQuantity = async (
  quantity,
  stripePriceId,
  userId,
) => {
  return await cartItems
    .query()
    .patch({
      quantity,
    })
    .where({ stripe_price_id: stripePriceId, user_id: userId });
};

export {
  addCartItem,
  addItemToPaidStoreItems,
  addMembershipCartItem,
  deleteCartItem,
  deleteCartItems,
  getAllShopItems,
  getCartItem,
  getCartItems,
  getCartItemsOrdered,
  getCartTotal,
  getItem,
  getPurchases,
  getSales,
  getShopItems,
  getTaxRates,
  removeAllInstancesFromCart,
  removeCartItemInstance,
  updateCartItems,
};
