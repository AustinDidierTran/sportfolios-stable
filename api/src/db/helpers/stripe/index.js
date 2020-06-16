/**
 * Useful references
 * Testing account numbers: https://stripe.com/docs/connect/testing#account-numbers
 */
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const stripeEnums = require('./enums');
const { INVOICE_STATUS_ENUM } = stripeEnums;
const knex = require('../../connection');
const {
  getCustomerId,
  getOrCreateCustomer,
  createPaymentMethod,
  addPaymentMethodCustomer,
  removePaymentMethodCustomer,
} = require('./customer');
const {
  createExternalAccount,
  createAccountLink,
  getStripeAccountId,
} = require('./externalAccount');

const createPaymentIntent = async (body /* user_id, ip */) => {
  // Create a PaymentIntent:
  const amount = body.amount;
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: 'cad',
    //transfer_group: '{ORDER10}',
    metadata: { integration_check: 'accept_a_payment' },
  });

  return paymentIntent;
};

const createInvoiceItem = async (body, userId) => {
  const { invoice_item } = body;
  const customerId = await getCustomerId(userId);
  stripe.invoiceItems.create(
    { ...invoice_item, customer: customerId },
    async function(err, invoiceItem) {
      if (invoiceItem) {
        /* eslint-disable-next-line */
        console.log('New invoice item created');
        await knex('stripe_invoice_item').insert({
          user_id: userId,
          invoice_item_id: invoiceItem.id,
        });
      }
      if (err) {
        /* eslint-disable-next-line */
        console.log('createInvoiceItem', err);
      }
    },
  );

  return 1;
};

const getInvoiceItemId = async userId => {
  const invoiceItemId = await knex
    .select('invoice_item_id')
    .from('stripe_invoice_item')
    .where('user_id', userId);
  return invoiceItemId;
};

const getOpenInvoiceId = async userId => {
  const invoiceId = await knex
    .select('invoice_id')
    .from('stripe_invoice')
    .where('user_id', userId)
    .andWhere('status', INVOICE_STATUS_ENUM.OPEN);

  if (invoiceId.length > 0) {
    return invoiceId[0].invoice_id;
  } else {
    return null;
  }
};

const getDraftInvoiceStatus = async userId => {
  const invoiceId = await knex
    .select('invoice_id')
    .from('stripe_invoice')
    .where('user_id', userId)
    .andWhere('status', INVOICE_STATUS_ENUM.DRAFT);

  if (invoiceId.length > 0) {
    return invoiceId[0].invoice_id;
  } else {
    return null;
  }
};

const getInvoiceStatus = async invoiceId => {
  const invoiceStatus = await knex
    .select('status')
    .from('stripe_invoice')
    .where('invoice_id', invoiceId);
  return invoiceStatus[0].status;
};

const createInvoice = async (body, userId) => {
  const { invoice } = body;
  const customerId = await getCustomerId(userId);
  stripe.invoices.create(
    { ...invoice, customer: customerId },
    async function(err, invoice) {
      if (invoice) {
        /* eslint-disable-next-line */
        console.log(invoice.status);
        await knex('stripe_invoice').insert({
          user_id: userId,
          invoice_id: invoice.id,
          status: invoice.status,
        });
      }
      if (err) {
        /* eslint-disable-next-line */
        console.log('createInvoice error');
        //console.log(err);
      }
    },
  );
  return getDraftInvoiceStatus(userId);
};

const getOrCreateInvoice = async (body, userId) => {
  if (await getOpenInvoiceId(userId)) {
    const invoiceId = await getOpenInvoiceId(userId);
    /* eslint-disable-next-line */
    console.log('Found invoice with OPEN status');
    return invoiceId;
  } else if (await getDraftInvoiceStatus(userId)) {
    /* eslint-disable-next-line */
    console.log('Found invoice with DRAFT status');
    const invoiceId = await getDraftInvoiceStatus(userId);
    return invoiceId;
  } else {
    /* eslint-disable-next-line */
    console.log('Creating new invoice...');
    return createInvoice(body, userId);
  }
};

const updateInvoiceStatus = async (invoiceId, status) => {
  return await knex('stripe_invoice')
    .update({ status })
    .where({ invoice_id: invoiceId });
};

const finalizeInvoice = async invoiceId => {
  stripe.invoices.finalizeInvoice(invoiceId, async function(
    err,
    invoice,
  ) {
    if (invoice) {
      updateInvoiceStatus(invoiceId, invoice.status);
      /* eslint-disable-next-line */
      console.log(
        'Invoice finalized, updated status:',
        invoice.status,
      );
    }
    if (err) {
      /* eslint-disable-next-line */
      console.log('finalizeInvoice error');
      //console.log(err);
    }
  });
};

const finalizeInvoiceFromInvoiceId = async (body /*userId*/) => {
  const { invoice_id } = body;
  const invoiceStatus = await getInvoiceStatus(invoice_id);
  if (invoiceStatus == INVOICE_STATUS_ENUM.DRAFT) {
    stripe.invoices.finalizeInvoice(invoice_id, async function(
      err,
      invoice,
    ) {
      if (invoice) {
        updateInvoiceStatus(invoice_id, invoice.status);
        /* eslint-disable-next-line */
        console.log(
          'Invoice finalized, updated status:',
          invoice.status,
        );
      }
      if (err) {
        /* eslint-disable-next-line */
        console.log('finalizeInvoice error');
        //console.log(err);
      }
    });
  }
};

const payInvoice = async invoiceId => {
  stripe.invoices.pay(invoiceId, async function(err, invoice) {
    if (invoice) {
      /* eslint-disable-next-line */
      console.log('invoice paid, update status:', invoice.status);
      updateInvoiceStatus(invoiceId, invoice.status);
    }
    if (err) {
      /* eslint-disable-next-line */
      console.log('payInvoice error');
      //console.log(err);
    }
  });
};

const payInvoiceFromInvoiceId = async (body /*userId*/) => {
  const { invoice_id } = body;
  const invoiceStatus = await getInvoiceStatus(invoiceId);
  if (invoiceStatus == INVOICE_STATUS_ENUM.OPEN) {
    stripe.invoices.pay(invoice_id, async function(err, invoice) {
      if (invoice) {
        /* eslint-disable-next-line */
        console.log('invoice paid, update status:', invoice.status);
        updateInvoiceStatus(invoiceId, invoice.status);
      }
      if (err) {
        /* eslint-disable-next-line */
        console.log('payInvoice error');
        //console.log(err);
      }
    });
  } else {
    /* eslint-disable-next-line */
    console.log(
      `Invoice cant be paid, status is not open, status: ${invoiceStatus} `,
    );
  }
};

const invoicePayment = async (body, userId) => {
  const invoiceId = await getOrCreateInvoice(body, userId);
  const invoiceStatus = await getInvoiceStatus(invoiceId);

  switch (invoiceStatus) {
    case INVOICE_STATUS_ENUM.DELETED:
      /* eslint-disable-next-line */
      console.log('invoice has been deleted');
      break;
    case INVOICE_STATUS_ENUM.DRAFT:
      finalizeInvoice(invoiceId);
      break;
    case INVOICE_STATUS_ENUM.OPEN:
      /* eslint-disable-next-line */
      console.log('awaiting payment');
      payInvoice(invoiceId);
      break;
    case INVOICE_STATUS_ENUM.PAID:
      /* eslint-disable-next-line */
      console.log('invoice already paid');
      break;
    case INVOICE_STATUS_ENUM.UNCOLLECTIBLE:
      /* eslint-disable-next-line */
      console.log('invoice cant be collected');
      break;
    case INVOICE_STATUS_ENUM.VOID:
      /* eslint-disable-next-line */
      console.log('invoice has been voided');
      break;
    default:
  }
  return 1;
};

module.exports = {
  createAccountLink,
  createExternalAccount,
  getStripeAccountId,
  createPaymentIntent,
  getOrCreateCustomer,
  createInvoiceItem,
  invoicePayment,
  getInvoiceItemId,
  createPaymentMethod,
  addPaymentMethodCustomer,
  removePaymentMethodCustomer,
  payInvoiceFromInvoiceId,
  finalizeInvoiceFromInvoiceId,
  stripeEnums,
};
