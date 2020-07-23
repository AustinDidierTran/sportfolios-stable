const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const knex = require('../../connection');
const { getCustomerId } = require('./customer');
const {
  stripeErrorLogger,
  stripeLogger,
} = require('../../../server/utils/logger');
const { getCreator } = require('../entity');
const {
  STRIPE_STATUS_ENUM,
  GLOBAL_ENUM,
} = require('../../../../../common/enums');
const { clearCart } = require('../shop');
const {
  INVOICE_PAID_ENUM,
} = require('../../../server/utils/Stripe/checkout');

const formatMetadata = metadata =>
  Object.keys(metadata).reduce((prev, curr) => {
    const currentValue = metadata[curr];
    if (typeof currentValue === 'string') {
      return {
        ...prev,
        [curr]: currentValue,
      };
    }
    return {
      ...prev,
      [curr]: JSON.stringify(currentValue),
    };
  }, {});

const createInvoiceItem = async (body, userId) => {
  const { price, metadata, paymentMethodId } = body;
  const customerId = await getCustomerId(paymentMethodId);
  const params = {
    price,
    customer: customerId,
    metadata: formatMetadata(metadata),
  };
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
  const { invoice, paymentMethodId } = body;
  const customerId = await getCustomerId(paymentMethodId);
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
  const { invoiceId, paymentMethodId } = body;

  const params = {
    payment_method: paymentMethodId,
  };

  try {
    const invoice = await stripe.invoices.pay(invoiceId, params);

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

const getExternalAccount = async entityId => {
  const [entity] = await knex('entities').where({ id: entityId });

  if (Number(entity.type) === GLOBAL_ENUM.EVENT) {
    const creator = await getCreator(entityId);

    const [externalAccount] = await knex('stripe_accounts')
      .select('*')
      .where({
        entity_id: creator.id,
      });

    return externalAccount;
  }

  const [externalAccount] = await knex('stripe_accounts')
    .select('*')
    .where({
      entity_id: entityId,
    });

  return externalAccount;
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

        const externalAccount = await getExternalAccount(
          invoiceItem.metadata.sellerId,
        );

        const stripeFees = Math.ceil(amount * 0.029 + 30);
        const transferedAmount = amount - stripeFees;

        const transfer = await createTransfer(
          {
            amount: transferedAmount,
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
  const { invoiceItemId } = body;
  const invoiceItem = await stripe.invoiceItems.retrieve(
    invoiceItemId,
  );

  const invoice = await stripe.invoices.retrieve(invoiceItem.invoice);

  const amount = invoiceItem.amount;
  const charge = invoice.charge;

  const params = {
    charge,
    amount,
  };

  const refund = await stripe.refunds.create(params);

  await knex('stripe_refund').insert({
    invoice_item_id: invoiceItemId,
    refund_id: refund.id,
    amount,
  });

  const [{ transfer_id: transferId }] = await knex('stripe_transfer')
    .select('*')
    .where({
      invoice_item_id: invoiceItemId,
    });

  const reversedTransfer = await stripe.transfers.createReversal(
    transferId,
    { refund_application_fee: true },
  );

  return { refund, reversedTransfer };
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
  const { paymentMethodId } = body;

  const invoiceParams = {
    invoice: {
      auto_advance: 'false',
      collection_method: 'charge_automatically',
      metadata: {},
    },
  };

  const prices = await knex('cart_items').where({ user_id: userId });
  try {
    const invoicesAndMetadatas = await Promise.all(
      prices.map(async price => {
        const stripePriceId = price.stripe_price_id;
        const metadata = await getMetadata(stripePriceId);
        const invoiceItem = await createInvoiceItem(
          { price: stripePriceId, metadata, paymentMethodId },
          userId,
        );
        return { invoiceItem, metadata };
      }),
    );

    const invoice = await createInvoice(
      { invoiceParams, paymentMethodId },
      userId,
    );

    await stripe.customers.retrieve(invoice.customer);
    const invoiceId = invoice.id;
    await finalizeInvoice({ invoiceId }, userId);
    const paidInvoice = await payInvoice(
      { invoiceId, paymentMethodId },
      userId,
    );

    const chargeId = await paidInvoice.charge;
    const receiptUrl = await getReceipt({ chargeId, invoiceId });
    const transfers = await createTransfers(paidInvoice, userId);

    await Promise.all(
      invoicesAndMetadatas.map(async ({ invoiceItem, metadata }) => {
        if (Number(metadata.type) === 4) {
          await INVOICE_PAID_ENUM.EVENT(
            { rosterId: metadata.rosterId, eventId: metadata.id },
            {
              status: paidInvoice.status,
              invoiceItemId: invoiceItem.id,
            },
          );
        }
      }),
    );

    await clearCart(userId);
    /* eslint-disable-next-line */
    return { invoice: paidInvoice, receiptUrl, transfers };
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
