const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const knex = require('../../connection');
const { getCustomerId } = require('./customer');

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
    /* eslint-disable-next-line */
    console.log(`InvoiceItem created, ${invoiceItem.id}`);
    return invoiceItem;
  } catch (err) {
    /* eslint-disable-next-line */
    console.error('CreateInvoiceItem error', err);
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
    /* eslint-disable-next-line */
    console.log(`Invoice created, ${invoice.id}`);
    return invoice;
  } catch (err) {
    /* eslint-disable-next-line */
    console.error('CreateInvoice error', err);
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
    /* eslint-disable-next-line */
    console.log(`Invoice finalized, ${invoice.id}`);

    return invoice;
  } catch (err) {
    /* eslint-disable-next-line */
    console.error('FinalizeInvoice error', err);
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
    /* eslint-disable-next-line */
    console.log('invoice paid, update status:', invoice.status);
    return invoice;
  } catch (err) {
    /* eslint-disable-next-line */
    console.error('CreateInvoice error', err);
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
    /* eslint-disable-next-line */
    console.log('Receipt url:', receipt_url);
    return receipt_url;
  } catch (err) {
    /* eslint-disable-next-line */
    console.error('GetReceipt error', err);
    throw err;
  }
};

module.exports = {
  createInvoiceItem,
  createInvoice,
  finalizeInvoice,
  payInvoice,
  getReceipt,
};
