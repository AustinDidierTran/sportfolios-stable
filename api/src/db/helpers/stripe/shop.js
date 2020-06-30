const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const knex = require('../../connection');

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
    /* eslint-disable-next-line */
    console.log(`Product created, ${product.id}`);

    return product;
  } catch (err) {
    /* eslint-disable-next-line */
    console.log('addProduct error', err);
    throw err;
  }
};

const addPrice = async (body /*userId*/) => {
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
    /* eslint-disable-next-line */
    console.log(`Price created, ${price.id}`);

    return price;
  } catch (err) {
    /* eslint-disable-next-line */
    console.error('addPrice error', err);
    throw err;
  }
};

module.exports = {
  addProduct,
  addPrice,
};
