const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const knex = require('../../connection');
const { getCustomerId } = require('./customer');
const {
  stripeErrorLogger,
  stripeLogger,
} = require('../../../server/utils/logger');

const createInvoiceItem = async (body, userId) => {
  const { price } = body;
  const customerId = await getCustomerId(userId);
  const params = { price, customer: customerId };

  try {
    const invoiceItem = await stripe.invoiceItems.create(params);

    await knex('stripe_invoice_item').insert({
      user_id: userId,
      invoice_item_id: invoiceItem.id,
      stripe_price_id: invoiceItem.price.id,
    });

    stripeLogger(`InvoiceItem created, ${invoiceItem.id}`);
    return invoiceItem;
  } catch (err) {
    stripeErrorLogger('CreateInvoiceItem error', err);
    throw err;
  }
};

const createInvoice = async (body, userId) => {
  const { invoice } = body;
  const customerId = await getCustomerId(userId);
  const params = { ...invoice, customer: customerId };

  try {
    const invoice = await stripe.invoices.create(params);

    await knex('stripe_invoice').insert({
      user_id: userId,
      invoice_id: invoice.id,
      status: invoice.status,
    });

    stripeLogger(`Invoice created, ${invoice.id}`);
    return invoice;
  } catch (err) {
    stripeErrorLogger('CreateInvoice error', err);
    throw err;
  }
};

const finalizeInvoice = async (body, userId) => {
  const { invoice_id } = body;
  const params = invoice_id;

  try {
    const invoice = await stripe.invoices.finalizeInvoice(params);

    await knex('stripe_invoice')
      .update({ status: invoice.status })
      .where({ user_id: userId });

    stripeLogger(`Invoice finalized, ${invoice.id}`);

    return invoice;
  } catch (err) {
    stripeErrorLogger('FinalizeInvoice error', err);
    throw err;
  }
};

const payInvoice = async (body, userId) => {
  const { invoice_id } = body;
  const params = invoice_id;

  try {
    const invoice = await stripe.invoices.pay(params);

    await knex('stripe_invoice')
      .update({ status: invoice.status })
      .where({ user_id: userId });

    stripeLogger('invoice paid, update status:', invoice.status);
    return invoice;
  } catch (err) {
    stripeErrorLogger('CreateInvoice error', err);
    throw err;
  }
};

const getReceipt = async query => {
  const { charge_id, invoice_id } = query;
  const params = charge_id;

  try {
    const { receipt_url = '' } = await stripe.charges.retrieve(
      params,
    );

    await knex('stripe_invoice')
      .update({ receipt_url })
      .where({ invoice_id });

    stripeLogger('Receipt url:', receipt_url);
    return receipt_url;
  } catch (err) {
    stripeErrorLogger('GetReceipt error', err);
    throw err;
  }
};

const getMetadata = async stripe_price_id => {
  const [stripe_price] = await knex('stripe_price')
    .select('*')
    .where({ stripe_price_id });

  const [stripe_product] = await knex('stripe_product')
    .select('*')
    .where({ stripe_product_id: stripe_price.stripe_product_id });

  const [cart_item] = await knex('cart_items')
    .select('*')
    .where({ stripe_price_id });

  const metadata = {
    ...cart_item.metadata,
    ...stripe_price.metadata,
    ...stripe_product.metadata,
  };
  return metadata;
};

const checkout = async (body, userId) => {
  const { prices = [] } = body;
  const invoiceParams = {
    invoice: {
      auto_advance: 'false',
      collection_method: 'charge_automatically',
      metadata: {},
    },
  };

  try {
    await Promise.all(
      prices.map(async item => {
        const stripe_price_id = item.price;
        const metadata = await getMetadata(stripe_price_id);
        const invoiceItem = await createInvoiceItem(
          { price: stripe_price_id, metadata },
          userId,
        );
        return invoiceItem.id;
      }),
    );

    const invoice = await createInvoice({ invoiceParams }, userId);
    await stripe.customers.retrieve(invoice.customer);
    const invoice_id = invoice.id;
    await finalizeInvoice({ invoice_id }, userId);
    const paidInvoice = await payInvoice({ invoice_id }, userId);
    const charge_id = await paidInvoice.charge;

    return getReceipt({ charge_id, invoice_id });
  } catch (err) {
    stripeErrorLogger('CreateInvoice error', err);
    throw err;
  }
};

module.exports = {
  createInvoiceItem,
  createInvoice,
  finalizeInvoice,
  payInvoice,
  getReceipt,
  checkout,
};
