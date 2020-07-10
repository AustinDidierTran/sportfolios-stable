const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const knex = require('../../connection');
const { getCustomerId } = require('./customer');
const {
  stripeErrorLogger,
  stripeLogger,
} = require('../../../server/utils/logger');
const { STRIPE_STATUS_ENUM } = require('../../../../../common/enums');

const createInvoiceItem = async (body, userId) => {
  const { price, metadata } = body;
  const customerId = await getCustomerId(userId);
  const params = { price, customer: customerId, metadata };

  try {
    const invoiceItem = await stripe.invoiceItems.create(params);

    await knex('stripe_invoice_item').insert({
      user_id: userId,
      invoice_item_id: invoiceItem.id,
      stripe_price_id: invoiceItem.price.id,
      metadata: invoiceItem.metadata,
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
  const { invoiceId } = body;
  const params = invoiceId;

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
  const { invoiceId } = body;
  const params = invoiceId;

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

const createTransfer = async (params, invoiceItemId) => {
  try {
    const transfer = await stripe.transfers.create(params);

    await knex('stripe_transfer').insert({
      invoice_item_id: invoiceItemId,
      transfer_id: transfer.id,
      status: transfer.reversed
        ? STRIPE_STATUS_ENUM.DONE
        : STRIPE_STATUS_ENUM.NOT_DONE,
    });

    stripeLogger('Transfer successful', transfer.id);
    return transfer;
  } catch (err) {
    stripeErrorLogger('transfer error', err);
    throw err;
  }
};

const createTransfers = async invoice => {
  try {
    const transfers = await Promise.all(
      invoice.lines.data.map(async item => {
        const {
          amount,
          currency,
          invoice_item: invoiceItemId,
        } = item;

        const [invoiceItem] = await knex('stripe_invoice_item')
          .select('*')
          .where({ invoice_item_id: invoiceItemId });

        const [externalAccount] = await knex('stripe_accounts')
          .select('*')
          .where({
            entity_id: invoiceItem.metadata.seller_entity_id,
          });

        const transfer = await createTransfer(
          {
            amount,
            currency,
            destination: externalAccount.account_id,
            description: externalAccount.account_id,
            source_transaction: invoice.charge,
            metadata: {
              account_id: externalAccount.account_id,
              entity_id: externalAccount.entity_id,
            },
          },
          invoiceItemId,
        );
        return transfer;
      }),
    );

    stripeLogger('Transfer All');
    return transfers;
  } catch (err) {
    stripeErrorLogger('transfer error', err);
    throw err;
  }
};

const createRefund = async body => {
  const { invoiceId, prices, reason } = body;

  try {
    const invoice = await stripe.invoices.retrieve(invoiceId);
    const charge = invoice.charge;

    const refunds = await Promise.all(
      prices.map(async stripePriceId => {
        const invoiceItem = invoice.lines.data.find(
          e => e.price.id == stripePriceId,
        );
        const amount = invoiceItem.amount;

        const params = {
          charge,
          amount,
          reason,
          refund_application_fee: true,
          reverse_transfer: true,
        };
        const refund = await stripe.refunds.create(params);

        await knex('stripe_refund').insert({
          invoice_id: invoice.id,
          refund_id: refund.id,
          amount,
        });

        const [transfer] = await knex('stripe_transfer')
          .select('*')
          .where({
            invoice_item_id: invoiceItem.metadata.seller_entity_id,
          });
        const transferId = transfer.transfer_id;

        const reversedTransfer = await stripe.transfers.createReversal(
          transferId,
          { amount, refund_application_fee: true },
        );

        return { refund, reversedTransfer };
      }),
    );

    //TODO: Set stripe_invoice.status to refunded
    //TODO: Set hook for Jul to update infos.

    stripeLogger('Refunds successful', refunds);
    return refunds;
  } catch (err) {
    stripeErrorLogger('Refunds error', err);
    throw err;
  }
};

const getReceipt = async query => {
  const { chargeId, invoiceId } = query;
  const params = chargeId;

  try {
    const charge = await stripe.charges.retrieve(params);
    const receiptUrl = charge.receipt_url;

    await knex('stripe_invoice')
      .update({ receipt_url: receiptUrl })
      .where({ invoice_id: invoiceId });

    stripeLogger('Receipt url:', receiptUrl);
    return receiptUrl;
  } catch (err) {
    stripeErrorLogger('GetReceipt error', err);
    throw err;
  }
};

const getMetadata = async stripePriceId => {
  const [stripePrice] = await knex('stripe_price')
    .select('*')
    .where({ stripe_price_id: stripePriceId });

  const [stripeProduct] = await knex('stripe_product')
    .select('*')
    .where({ stripe_product_id: stripePrice.stripe_product_id });

  const [cartItem] = await knex('cart_items')
    .select('*')
    .where({ stripe_price_id: stripePriceId });

  const metadata = {
    ...cartItem.metadata,
    ...stripePrice.metadata,
    ...stripeProduct.metadata,
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
        const stripePriceId = item.price;
        const metadata = await getMetadata(stripePriceId);
        const invoiceItem = await createInvoiceItem(
          { price: stripePriceId, metadata },
          userId,
        );
        return invoiceItem.id;
      }),
    );

    const invoice = await createInvoice({ invoiceParams }, userId);
    await stripe.customers.retrieve(invoice.customer);
    const invoiceId = invoice.id;
    await finalizeInvoice({ invoiceId }, userId);
    const paidInvoice = await payInvoice({ invoiceId }, userId);
    const chargeId = await paidInvoice.charge;
    const receiptUrl = await getReceipt({ chargeId, invoiceId });
    const transfers = await createTransfers(paidInvoice, userId);
    /* eslint-disable-next-line */

    return { invoice: paidInvoice, receipt: receiptUrl, transfers };
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
  createRefund,
};
