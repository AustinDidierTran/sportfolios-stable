const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const knex = require('../../connection');
const {
  stripeErrorLogger,
  stripeLogger,
} = require('../../../server/utils/logger');

const addProduct = async body => {
  const { stripe_product } = body;
  try {
    const product = await stripe.products.create(stripe_product);

    await knex('stripe_product').insert({
      stripe_product_id: product.id,
      label: product.name,
      description: product.description,
      active: product.active,
    });

    stripeLogger(`Product created, ${product.id}`);

    return product;
  } catch (err) {
    stripeErrorLogger('addProduct error', err);
    throw err;
  }
};

const addPrice = async body => {
  const { stripe_price, entity_id, photo_url } = body;
  try {
    const price = await stripe.prices.create(stripe_price);

    await knex('stripe_price').insert({
      stripe_price_id: price.id,
      stripe_product_id: price.product,
      amount: price.unit_amount,
      active: price.active,
      start_date: new Date(price.created * 1000),
    });
    await knex('store_items').insert({
      entity_id,
      stripe_price_id: price.id,
      photo_url,
    });

    stripeLogger(`Price created, ${price.id}`);

    return price;
  } catch (err) {
    stripeErrorLogger('addPrice error', err);
    throw err;
  }
};

module.exports = {
  addProduct,
  addPrice,
};
