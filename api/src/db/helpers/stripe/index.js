/**
 * Useful references
 * Testing account numbers: https://stripe.com/docs/connect/testing#account-numbers
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { CLIENT_BASE_URL } = require('../../../../../conf');

/* Private arguments */

const stripeEnums = require('./enums');
const {
  BUSINESS_TYPE_ENUM,
  INVOICE_STATUS_ENUM,
  TEST_EXTERNAL_ACCOUNT,
} = stripeEnums;

const stripeFactories = require('./factories');
const { accountParamsFactory } = stripeFactories;

const knex = require('../../connection');

/* Public arguments */
const getStripeAccountId = async senderId => {
  const data = await knex
    .select('account_id')
    .where('entity_id', senderId)
    .from('stripe_accounts');
  return (data.length && data[0].account_id) || null;
};

const getOrCreateStripeConnectedAccountId = async (entity_id, ip) => {
  let accountId = await getStripeAccountId(entity_id);
  if (!accountId) {
    const account = await createStripeConnectedAccount({ ip }); // must return accountId
    accountId = account.id;
    // Should store account inside DB
    await knex('stripe_accounts').insert({
      entity_id,
      account_id: accountId,
    });
  }

  return accountId;
};

// REF: https://stripe.com/docs/api/accounts/create?lang=node
const createStripeConnectedAccount = async props => {
  const {
    business_type = BUSINESS_TYPE_ENUM.INDIVIDUAL,
    city,
    country,
    dob,
    email,
    first_name,
    ip,
    last_name,
    line1,
    postal_code,
    state,
  } = props;

  const params = accountParamsFactory({
    business_type,
    city,
    country,
    dob,
    email,
    external_account: TEST_EXTERNAL_ACCOUNT.PAYOUT_SUCCEED,
    first_name,
    ip,
    last_name,
    line1,
    postal_code,
    state,
  });

  const account = await stripe.account.create(params);

  return account;
};

const createAccountLink = async props => {
  const { entity_id, ip } = props;
  const accountId = await getOrCreateStripeConnectedAccountId(
    entity_id,
    ip,
  );
  const params = {
    account: accountId,
    failure_url: `${CLIENT_BASE_URL}/profile`,
    success_url: `${CLIENT_BASE_URL}/${entity_id}?tab=settings`,
    type: 'custom_account_verification',
    collect: 'eventually_due',
  };

  return stripe.accountLinks.create(params);
};

const createExternalAccount = async (body, user_id, ip) => {
  var created = 1;
  const organizationId = body.id;
  const accountId = await getOrCreateStripeConnectedAccountId(
    organizationId,
    ip,
  );
  const params = {
    bank_account: {
      country: body.country,
      currency: body.currency,
      account_holder_name: body.account_holder_name,
      account_holder_type: 'company',
      routing_number: body.routing_number,
      account_number: body.account_number,
    },
  };
  stripe.tokens.create(params, async (err, token) => {
    if (token) {
      await stripe.accounts.createExternalAccount(
        accountId,
        {
          external_account: token.id,
        },
        async (err, account) => {
          if (account) {
            /* eslint-disable-next-line */
            console.error('External Account Created', account.id);
          }
          if (err) {
            /* eslint-disable-next-line */
            console.error('ERROR: External Account NOT Created');
            created = 0;
          }
        },
      );
    }
    if (err) {
      /* eslint-disable-next-line */
      console.error('ERROR: Account Token NOT Created');
      created = 0;
    }
  });
  return created;
};

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

const createCustomer = async (body, userId) => {
  // Create Payment Method
  if (await getCustomerId(userId)) {
    /* eslint-disable-next-line */
    console.log('Customer already exists');
  } else {
    stripe.paymentMethods.create(
      body.infos.payment_method,
      async function(err, paymentMethod) {
        if (paymentMethod) {
          //Create a Customer
          return stripe.customers.create(
            {
              ...body.infos.customer,
              payment_method: paymentMethod.id,
            },
            async function(err, customer) {
              //Add customer to db
              if (customer) {
                await knex('stripe_customer').insert({
                  user_id: userId,
                  customer_id: customer.id,
                });
              }
            },
          );
        }
      },
    );
  }

  return 1;
};

const getCustomerId = async userId => {
  const [{ customer_id } = {}] = await knex
    .select('customer_id')
    .from('stripe_customer')
    .where('user_id', userId);
  return customer_id;
};

const createInvoiceItem = async (body, userId) => {
  const customerId = await getCustomerId(userId);

  stripe.invoiceItems.create(
    { ...body.infos, customer: customerId },
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

const getInvoiceItem = async userId => {
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
  const customerId = await getCustomerId(userId);
  stripe.invoices.create(
    { ...body.infos, customer: customerId },
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
  createCustomer,
  createInvoiceItem,
  invoicePayment,
  getInvoiceItem,
  stripeEnums,
};
