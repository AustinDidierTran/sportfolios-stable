const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const knex = require('../../connection');
const {
  stripeErrorLogger,
  stripeLogger,
} = require('../../../server/utils/logger');
const { ERROR_ENUM } = require('../../../../../common/errors');
const { PAYMENT_METHOD_TYPE_ENUM } = require('./enums');
const moment = require('moment');

const getCustomerId = async paymentId => {
  const [{ customer_id = '' } = {}] = await knex
    .select('customer_id')
    .from('stripe_customer')
    .where('payment_method_id', paymentId);
  return customer_id;
};

const getCustomer = async userId => {
  const [customer] = await knex('stripe_customer')
    .select('*')
    .where({ user_id: userId });
  return customer;
};
const getBankAccounts = async entityId => {
  const [account] = await knex('stripe_accounts')
    .select('account_id')
    .where({ entity_id: entityId });
  if (account) {
    const bankAccounts = await knex('bank_accounts')
      .select('*')
      .whereNull('deleted_at')
      .andWhere({ account_id: account.account_id });
    const res = bankAccounts.sort(
      (a, b) => moment(b.created_at) - moment(a.created_at),
    );
    return res;
  }
  return [];
};

const createCustomer = async (body, userId, paymentMethod) => {
  const { id: paymentMethodId, last4 } = paymentMethod;
  const params = {
    address: {
      line1: body.line1,
      line2: body.line2,
      city: body.city,
      country: body.country,
      postal_code: body.postalCode,
      state: body.state,
    },
    email: body.email,
    name: body.name,
    metadata: { user_id: userId },
    payment_method: paymentMethodId,
    phone: body.phoneNumber,
  };

  const customer = await stripe.customers.create(params);

  if (!customer) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  try {
    await knex('stripe_customer')
      .update({ is_default: false })
      .where({ user_id: userId });
    await knex('stripe_customer').insert({
      user_id: userId,
      customer_id: customer.id,
      informations: customer,
      payment_method_id: paymentMethodId,
      last4,
      is_default: true,
    });
  } catch (err) {
    stripeErrorLogger(
      `Customer with id ${customer.id} already exists, taking it back`,
    );
  }
  return customer.id;
};

const getOrCreateCustomer = async (body, userId) => {
  // Create Payment Method
  if (await getCustomerId(userId)) {
    stripeLogger('Customer already exists');
    return getCustomerId(userId);
  } else {
    stripeLogger('Creating customer ...');
    return createCustomer(body, userId);
  }
};

const getPaymentMethods = async userId => {
  const paymentMethods = await knex('stripe_customer').where(
    'user_id',
    userId,
  );
  return paymentMethods;
};

const getPaymentMethodId = async userId => {
  const [{ payment_method_id } = {}] = await knex
    .select('payment_method_id')
    .from('stripe_customer')
    .where('user_id', userId);
  return payment_method_id;
};

const createPaymentMethod = async body => {
  const { stripeToken } = body;

  const params = {
    type: PAYMENT_METHOD_TYPE_ENUM.CARD,
    billing_details: {
      address: {
        city: body.city,
        country: body.country,
        line1: body.line1,
        line2: body.line2,
        postal_code: body.postalCode,
        state: body.state,
      },
      email: body.email,
      name: body.name,
      phone: body.phone,
    },
    card: { token: stripeToken.id },
  };

  let paymentMethod;
  try {
    paymentMethod = await stripe.paymentMethods.create(params);
  } catch (err) {
    stripeErrorLogger('PaymentMethod error', err);
  }

  if (!paymentMethod) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }

  stripeLogger('Created Payment Method', paymentMethod.id);
  return { id: paymentMethod.id, last4: paymentMethod.card.last4 };
};

const addPaymentMethodCustomer = async (body, userId) => {
  const { payment_method_id: paymentMethodId } = body;

  const customerId = await getCustomerId(userId);

  const setupIntentParams = {
    confirm: true,
    customer: customerId,
    payment_method: paymentMethodId,
    payment_method_types: ['card'],
    metadata: {},
  };

  try {
    await stripe.setupIntents.create(setupIntentParams);
    await stripe.customers.update(customerId, {
      invoice_settings: { default_payment_method: paymentMethodId },
    });
    stripeLogger(`Payment method attached`);

    const customer = await stripe.customers.retrieve(customerId);
    await knex('stripe_customer')
      .update({ informations: customer })
      .where({ user_id: userId });

    return getCustomerId(userId);
  } catch (err) {
    stripeErrorLogger('AttachPaymentMethod error', err);
    throw err;
  }
};

const removePaymentMethodCustomer = async body => {
  const { payment_method_id } = body;
  stripe.paymentMethods.detach(payment_method_id, async function(
    err,
    paymentMethod,
  ) {
    if (paymentMethod) {
      stripeLogger(
        `PaymentMethod successfully detached from customer`,
      );
    }
    if (err) {
      stripeErrorLogger(`Error failed to detach from customer`);
    }
  });
};

const updateDefaultCreditCard = async (body, userId) => {
  const { customerId } = body;
  await knex('stripe_customer')
    .update({ is_default: false })
    .where({ user_id: userId });
  const res = await knex('stripe_customer')
    .update({ is_default: true })
    .where({ customer_id: customerId })
    .returning('*');
  return res;
};

const updateDefaultBankAccount = async body => {
  const { bankAccountId } = body;

  const [{ account_id: accountId }] = await knex('bank_accounts')
    .select('account_id')
    .where({ bank_account_id: bankAccountId });

  await stripe.accounts.updateExternalAccount(
    accountId,
    bankAccountId,
    { default_for_currency: true },
  );

  await knex('bank_accounts')
    .update({ is_default: false })
    .where({ account_id: accountId });

  const res = await knex('bank_accounts')
    .update({ is_default: true })
    .where({ bank_account_id: bankAccountId })
    .returning('*');
  return res;
};

const deleteCreditCard = async (body, userId) => {
  const { customerId } = body;
  const [res] = await knex('stripe_customer')
    .where({ customer_id: customerId })
    .del()
    .returning('*');
  if (res.is_default) {
    const [creditCard] = await knex('stripe_customer')
      .select('*')
      .where({ user_id: userId });
    if (creditCard) {
      await knex('stripe_customer')
        .update({ is_default: true })
        .where({ customer_id: creditCard.customer_id });
    }
  }
  return res;
};

const deleteBankAccount = async body => {
  const { bankAccountId } = body;

  //Get accountId
  const [{ account_id: accountId }] = await knex('bank_accounts')
    .select('account_id')
    .where({ bank_account_id: bankAccountId });

  //Verify if there is more than one bank account
  const bankAccounts = await knex('bank_accounts')
    .select('*')
    .whereNull('deleted_at')
    .andWhere({ account_id: accountId });

  if (bankAccounts.length < 2) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }

  //Select new default bank account
  const [bankAccount] = await knex('bank_accounts')
    .select('*')
    .whereNull('deleted_at')
    .andWhere({ account_id: accountId });

  //update default bank account
  await knex('bank_accounts')
    .update({ is_default: false })
    .where({ bank_account_id: bankAccountId });

  //Delete bank account
  const deleted = await knex('bank_accounts')
    .where({ bank_account_id: bankAccountId })
    .del();

  //Set new default bank account
  await knex('bank_accounts')
    .update({ is_default: true })
    .where({ bank_account_id: bankAccount.bank_account_id });

  //Set new default bank account in stripe
  await stripe.accounts.updateExternalAccount(
    accountId,
    bankAccount.bank_account_id,
    { default_for_currency: true },
  );
  return deleted;
};

module.exports = {
  addPaymentMethodCustomer,
  createCustomer,
  createPaymentMethod,
  getBankAccounts,
  getCustomer,
  getCustomerId,
  getOrCreateCustomer,
  getPaymentMethodId,
  getPaymentMethods,
  removePaymentMethodCustomer,
  updateDefaultCreditCard,
  updateDefaultBankAccount,
  deleteCreditCard,
  deleteBankAccount,
};
