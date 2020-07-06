const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const knex = require('../../connection');
const {
  stripeErrorLogger,
  stripeLogger,
} = require('../../../server/utils/logger');

const addProduct = async body => {
  const { stripeProduct } = body;
  try {
    const product = await stripe.products.create(stripeProduct);

    await knex('stripe_product').insert({
      stripe_product_id: product.id,
      label: product.name,
      description: product.description,
      active: product.active,
      metadata: product.metadata,
    });

    stripeLogger(`Product created, ${product.id}`);

    return product;
  } catch (err) {
    stripeErrorLogger('addProduct error', err);
    throw err;
  }
};

const addPrice = async body => {
  const { stripePrice, entityId, photoUrl } = body;
  try {
    const price = await stripe.prices.create(stripePrice);

    await knex('stripe_price').insert({
      stripe_price_id: price.id,
      stripe_product_id: price.product,
      amount: price.unit_amount,
      active: price.active,
      start_date: new Date(price.created * 1000),
      metadata: price.metadata,
    });
    await knex('store_items').insert({
      entity_id: entityId,
      stripe_price_id: price.id,
      photo_url: photoUrl,
    });

    stripeLogger(`Price created, ${price.id}`);

    return price;
  } catch (err) {
    stripeErrorLogger('addPrice error', err);
    throw err;
  }
};

const createItem = async body => {
  const { stripeProduct, stripePrice, entityId, photoUrl } = body;
  try {
    const product = await addProduct({ stripeProduct });

    const price = await addPrice({
      stripePrice: { ...stripePrice, product: product.id },
      entityId,
      photoUrl,
    });

    return price;
  } catch (err) {
    stripeErrorLogger('CreateItem error', err);
    throw err;
  }
};

module.exports = {
  addProduct,
  addPrice,
  createItem,
};
