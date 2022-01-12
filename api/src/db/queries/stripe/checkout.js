import stripeLib from 'stripe';
const stripe = stripeLib(process.env.STRIPE_SECRET_KEY);
import knex from '../../connection.js';
import { getCustomerId } from './customer.js';
import {
  stripeErrorLogger,
  stripeLogger,
} from '../../../server/utils/logger.js';
import {
  STRIPE_STATUS_ENUM,
  GLOBAL_ENUM,
  REJECTION_ENUM,
  CART_ITEM,
} from '../../../../../common/enums/index.js';
import { deleteCartItem } from '../shop.js';
import { INVOICE_PAID_ENUM } from '../../../server/utils/stripeUtils/checkout.js';
import { sendReceiptEmail as sendReceiptEmailHelper } from '../../../server/utils/nodeMailer.js';
import { getEmailsFromUserId, getLanguageFromEmail } from '../user.js';
import {
  getTicketOptionsByStripePriceIds,
  getCountTicketPaidByGameId,
} from '../ticket.js';
import { ERROR_ENUM } from '../../../../../common/errors/index.js';
import { stripePrice as stripePriceModel } from '../../models/stripePrice.js';

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
  const { price, metadata, paymentMethodId, quantity, tax_rates } = body;
  const customerId = await getCustomerId(paymentMethodId);
  const params = {
    price,
    customer: customerId,
    metadata: formatMetadata(metadata),
    quantity,
    tax_rates,
  };
  try {
    const invoiceItem = await stripe.invoiceItems.create(params);
    await knex('stripe_invoice_item').insert({
      user_id: userId,
      invoice_item_id: invoiceItem.id,
      stripe_price_id: invoiceItem.price.id,
      metadata: invoiceItem.metadata,
      seller_entity_id:
        invoiceItem.metadata.seller_entity_id ||
        invoiceItem.metadata.sellerId ||
        invoiceItem.metadata.sellerEntityId,
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

const getExternalAccount = async stripePriceId => {
  const [{ owner_id: ownerId }] = await knex('stripe_price')
    .select('owner_id')
    .where({ stripe_price_id: stripePriceId });
  const [externalAccount] = await knex('stripe_accounts')
    .select('*')
    .where({ entity_id: ownerId });
  return externalAccount;
};

const createTransfers = async invoice => {
  try {
    const transfers = await Promise.all(
      invoice.lines.data.map(async item => {
        const { amount, currency, invoice_item: invoiceItemId } = item;

        const [invoiceItem] = await knex('stripe_invoice_item')
          .select('*')
          .where({ invoice_item_id: invoiceItemId });

        const [{ transaction_fees: transactionFees }] = await knex(
          'stripe_price',
        )
          .select('transaction_fees')
          .where({ stripe_price_id: invoiceItem.stripe_price_id });

        const externalAccount = await getExternalAccount(
          invoiceItem.stripe_price_id,
        );

        const taxRatesId = await knex('tax_rates_stripe_price')
          .select('tax_rate_id')
          .where({ stripe_price_id: invoiceItem.stripe_price_id });

        const taxRates = await Promise.all(
          taxRatesId.map(async t => {
            const [{ percentage }] = await knex('tax_rates')
              .select('percentage')
              .where({ id: t.tax_rate_id });
            return percentage;
          }),
        );

        const totalAmount = Math.floor(
          taxRates.reduce((prev, rate) => prev + amount * (rate / 100), amount),
        );

        const transferedAmount = totalAmount - transactionFees;

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
  console.log(100, { body });
  const invoiceItem = await stripe.invoiceItems.retrieve(invoiceItemId);
  console.log(101, { invoiceItem });

  const invoice = await stripe.invoices.retrieve(invoiceItem.invoice);
  console.log(102, { invoice });

  const amount = invoiceItem.amount;
  console.log(103, { amount });
  const charge = invoice.charge;
  console.log(104, { charge });

  const params = {
    charge,
    amount,
  };
  console.log(105, { params });

  const refund = await stripe.refunds.create(params);
  console.log(106, { refund });

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
  console.log(107, { transferId });

  const reversedTransfer = await stripe.transfers.createReversal(transferId, {
    refund_application_fee: true,
  });
  console.log(108, { reversedTransfer });

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

const sendReceiptEmail = async (body, userId) => {
  const { receipt } = body;
  const [person] = await getEmailsFromUserId(userId);
  const email = person.email;
  const language = await getLanguageFromEmail(email);
  return sendReceiptEmailHelper({ email, receipt, language, userId });
};

const getTaxRatesFromStripePrice = async stripePriceId => {
  const taxRatesId = await knex('tax_rates_stripe_price')
    .select('tax_rate_id')
    .where({ stripe_price_id: stripePriceId });

  return taxRatesId.map(t => t.tax_rate_id);
};
const getTransactionFeesFromStripePriceId = async stripePriceId => {
  const [{ transaction_fees: transactionFees }] = await knex('stripe_price')
    .select('transaction_fees')
    .where({ stripe_price_id: stripePriceId });
  return transactionFees;
};

const getMetadata = async (stripePriceId, cartItemId) => {
  const [stripePrice] = await stripePriceModel
    .query()
    .where('stripe_price_id', stripePriceId);

  const [stripeProduct] = await knex('stripe_product')
    .select('*')
    .where({ stripe_product_id: stripePrice.stripe_product_id });

  const [cartItem] = await knex('cart_items')
    .select('*')
    .where({ id: cartItemId });

  const metadata = {
    ...cartItem.metadata,
    ...stripePrice.metadata,
    ...stripeProduct.metadata,
  };
  return metadata;
};

const checkout = async (body, userId) => {
  const { paymentMethodId } = body;

  if (!paymentMethodId) {
    const reason = REJECTION_ENUM.NO_PAYMENT_METHOD_SELECTED;
    return { reason };
  }

  const invoiceParams = {
    invoice: {
      auto_advance: 'false',
      collection_method: 'charge_automatically',
      metadata: {},
    },
  };

  const prices = await knex('cart_items')
    .where({ user_id: userId })
    .andWhere({ selected: true });

  if (!prices.length) {
    const reason = REJECTION_ENUM.NO_CART_ITEMS_SELECTED;
    return { reason };
  }

  // Set ticket limit
  if (false) {
    const eventTickets = prices.filter(
      price => price.metadata.type === CART_ITEM.EVENT_TICKET,
    );

    const ticketOptions = await getTicketOptionsByStripePriceIds(
      eventTickets.map(ticket => ticket.stripe_price_id),
    );

    const gameIdsForTicketOptions = ticketOptions.reduce(
      (prev, ticketOption) => ({
        ...prev,
        [ticketOption.stripe_price_id]: ticketOption.games.id,
      }),
      {},
    );

    const gamesWithLimit = ticketOptions.map(ticketOption => ({
      ticketLimit: ticketOption.games.ticket_limit,
      gameId: ticketOption.games.id,
    }));

    const eventTicketWithGame = eventTickets.map(eventTicket => ({
      quantity: eventTicket.quantity,
      gameId: gameIdsForTicketOptions[eventTicket.id],
      ticketLimit: gamesWithLimit.find(
        g => g.gameId === gameIdsForTicketOptions[eventTicket.stripe_price_id],
      ).ticketLimit,
    }));

    eventTicketWithGame.forEach(async etwg => {
      const sold = await getCountTicketPaidByGameId(etwg.gameId);
      if (sold + etwg.quantity > etwg.ticketLimit) {
        throw new Error(ERROR_ENUM.NOT_ENOUGH_PLACE_REMAINING);
      }
    });
  }

  try {
    const invoicesAndMetadatas = await Promise.all(
      prices.map(async price => {
        const stripePriceId = price.stripe_price_id;

        const quantity = price.quantity;
        const metadata = await getMetadata(stripePriceId, price.id);
        const tax_rates = await getTaxRatesFromStripePrice(stripePriceId);
        const transactionFees = await getTransactionFeesFromStripePriceId(
          stripePriceId,
        );
        const invoiceItem = await createInvoiceItem(
          {
            price: stripePriceId,
            metadata,
            paymentMethodId,
            quantity,
            tax_rates,
          },
          userId,
        );
        return {
          invoiceItem,
          metadata,
          transactionFees,
          cartItemId: price.id,
        };
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
    await sendReceiptEmail({ receipt: receiptUrl }, userId);
    await Promise.all(
      invoicesAndMetadatas.map(
        async ({ invoiceItem, metadata, transactionFees, cartItemId }) => {
          if (Number(metadata.type) === GLOBAL_ENUM.EVENT) {
            await INVOICE_PAID_ENUM.EVENT({
              rosterId: metadata.rosterId,
              eventId: metadata.id,
              status: paidInvoice.status,
              invoiceItemId: invoiceItem.id,
              sellerEntityId: metadata.sellerEntityId,
              quantity: invoiceItem.quantity,
              unitAmount: invoiceItem.unit_amount,
              transactionFees,
              amount: invoiceItem.amount,
              stripePriceId: invoiceItem.price.id,
              buyerUserId: userId,
              receiptUrl,
              metadata: { ...metadata, type: GLOBAL_ENUM.EVENT },
            });
          } else if (metadata.type === CART_ITEM.SHOP_ITEM) {
            await INVOICE_PAID_ENUM.STORE({
              sellerEntityId: metadata.seller_entity_id,
              quantity: invoiceItem.quantity,
              unitAmount: invoiceItem.unit_amount,
              amount: invoiceItem.amount,
              stripePriceId: invoiceItem.price.id,
              transactionFees,
              buyerUserId: userId,
              invoiceItemId: invoiceItem.id,
              receiptUrl,
              metadata: { ...metadata, type: CART_ITEM.SHOP_ITEM },
            });
          } else if (metadata.type === CART_ITEM.MEMBERSHIP) {
            await INVOICE_PAID_ENUM.MEMBERSHIPS({
              sellerEntityId: metadata.sellerEntityId,
              quantity: invoiceItem.quantity,
              unitAmount: invoiceItem.unit_amount,
              amount: invoiceItem.amount,
              stripePriceId: invoiceItem.price.id,
              transactionFees,
              buyerUserId: userId,
              invoiceItemId: invoiceItem.id,
              receiptUrl,
              metadata: {
                ...metadata,
                type: CART_ITEM.MEMBERSHIP,
              },
            });
          } else if (metadata.type === CART_ITEM.DONATION) {
            await INVOICE_PAID_ENUM.DONATION({
              sellerEntityId: metadata.sellerEntityId,
              quantity: invoiceItem.quantity,
              unitAmount: invoiceItem.unit_amount,
              amount: invoiceItem.amount,
              stripePriceId: invoiceItem.price.id,
              transactionFees,
              buyerUserId: userId,
              invoiceItemId: invoiceItem.id,
              receiptUrl,
              metadata: {
                ...metadata,
                type: CART_ITEM.DONATION,
              },
            });
          } else if (metadata.type === CART_ITEM.EVENT_TICKET) {
            await INVOICE_PAID_ENUM.EVENT_TICKET({
              invoiceItemId: invoiceItem.id,
              quantity: invoiceItem.quantity,
            });
          }
          deleteCartItem(cartItemId);
        },
      ),
    );

    /* eslint-disable-next-line */
    return { invoice: paidInvoice, receiptUrl, transfers };
  } catch (err) {
    stripeErrorLogger('CreateInvoice error', err);
    const reason = REJECTION_ENUM.CHECKOUT_ERROR;
    return { reason };
  }
};

export {
  createInvoiceItem,
  createInvoice,
  finalizeInvoice,
  payInvoice,
  getReceipt,
  checkout,
  createRefund,
  sendReceiptEmail,
};
