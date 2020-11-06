const { CLIENT_BASE_URL } = require('../../../../../conf');
// const stripeFactories = require('./factories');
// const { accountParamsFactory } = stripeFactories;
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const knex = require('../../connection');
// const stripeEnums = require('./enums');
// const { BUSINESS_TYPE_ENUM, TEST_EXTERNAL_ACCOUNT } = stripeEnums;
const { stripeLogger } = require('../../../server/utils/logger');
const {
  fillWithZeros,
} = require('../../../../../common/utils/stringFormat');
const { getCreator, getEntity } = require('../entity');
const { GLOBAL_ENUM } = require('../../../../../common/enums');

const getStripeAccount = async userId => {
  console.log('getStripeAccount');
  const [account] = await knex('user_stripe_accounts')
    .select('*')
    .where({ user_id: userId });
  return account;
};
const getBankAccounts = async userId => {
  console.log('getBankAccounts');
  const [account] = await knex('user_stripe_accounts')
    .select('account_id')
    .where({ user_id: userId });
  const bankAccounts = await knex('bank_accounts')
    .select('*')
    .where({ account_id: account.account_id });
  return bankAccounts;
};

const hasStripeAccount = async userId => {
  console.log('hasStripeAccount');
  const account = await getStripeAccount(userId);
  return account ? true : false;
};

const hasStripeBankAccount = async userId => {
  const account = await getStripeAccount(userId);
  return Boolean(account.bank_account_id);
};

const eventHasBankAccount = async (adminId, userId) => {
  const entity = await getEntity(adminId, userId);
  if (entity.type === GLOBAL_ENUM.ORGANIZATION) {
    const organizationAccount = await getStripeAccount(adminId);
    return Boolean(organizationAccount.bank_account_id);
  }

  // not an organization, check for creator's account
  const admin = await getCreator(adminId);
  const account = await getStripeAccount(admin.id);
  return Boolean(account.bank_account_id);
};

const getStripeBankAccountId = async senderId => {
  const [{ account_id: accountId } = {}] = await knex
    .select('bank_account_id')
    .where('entity_id', senderId)
    .from('stripe_accounts');
  return accountId;
};

const getOrCreateStripeConnectedAccountId = async (userId, ip) => {
  console.log('getOrCreateStripeConnectedAccountId');
  let account = await getStripeAccount(userId);
  console.log({ account });

  if (!account) {
    console.log('no_account');
    const account = await createStripeConnectedAccount({ ip }); // must return accountId
    const accountId = account.id;
    console.log({ accountId });

    // Should store account inside DB
    await knex('user_stripe_accounts').insert({
      user_id: userId,
      account_id: accountId,
    });
    return accountId;
  }
  return account.account_id;
};

// REF: https://stripe.com/docs/api/accounts/create?lang=node
const createStripeConnectedAccount = async props => {
  const {
    // business_type,
    // city,
    // country,
    // dob,
    // email,
    // first_name,
    // ip,
    // last_name,
    // line1,
    // postal_code,
    // state,
  } = props;

  const params = {
    requested_capabilities: ['card_payments', 'transfers'],
    type: 'custom',
  };
  // If we want to be able to create account from UI, use this factory
  // const params = accountParamsFactory({
  //   business_type,
  //   city,
  //   country,
  //   dob,
  //   email,
  //   external_account: TEST_EXTERNAL_ACCOUNT.PAYOUT_SUCCEED,
  //   first_name,
  //   ip,
  //   last_name,
  //   line1,
  //   postal_code,
  //   state,
  // });

  return stripe.account.create(params);
};

const createAccountLink2 = async accountId => {
  const params = {
    account: accountId,
    failure_url: `${CLIENT_BASE_URL}/profile`,
    success_url: `${CLIENT_BASE_URL}`,
    type: 'custom_account_verification',
    collect: 'eventually_due',
  };
  return stripe.accountLinks.create(params);
};

const createAccountLink = async props => {
  console.log('createAccounLink');
  const { ip, userId } = props;
  console.log({ ip, userId });
  const accountId = await getOrCreateStripeConnectedAccountId(
    userId,
    ip,
  );
  console.log('allo');
  console.log({ accountId });
  const params = {
    account: accountId,
    failure_url: `${CLIENT_BASE_URL}/profile`,
    success_url: `${CLIENT_BASE_URL}/userSettings`,
    type: 'custom_account_verification',
    collect: 'eventually_due',
  };
  console.log({ params });
  console.log({ return: await stripe.accountLinks.create(params) });
  return stripe.accountLinks.create(params);
};

const getStripeAccountFromUser = async userId => {
  console.log('getStripeAccountFromUser');
  const res = await knex('user_stripe_accounts')
    .select('*')
    .where({ user_id: userId });
  return res;
};

const createExternalAccount = async (body, userId, ip) => {
  const {
    accountHolderName,
    country,
    currency,
    transitNumber,
    institutionNumber,
    accountNumber,
  } = body;

  const accountId = await getOrCreateStripeConnectedAccountId(
    userId,
    ip,
  );

  const routingNumber = `${fillWithZeros(
    transitNumber,
    5,
  )}-${fillWithZeros(institutionNumber, 3)}`;

  const params = {
    bank_account: {
      country: country,
      currency: currency,
      account_holder_name: accountHolderName,
      account_holder_type: 'company',
      routing_number: routingNumber,
      account_number: accountNumber,
    },
  };
  let token;
  token = await stripe.tokens.create(params);
  const account = await stripe.accounts.createExternalAccount(
    accountId,
    {
      external_account: token.id,
    },
  );
  console.log({ account });
  const stripeAccount = getStripeAccountFromUser(userId);
  console.log({ stripeAccount });

  await knex('bank_accounts').insert({
    bank_account_id: account.id,
    last4: account.last4,
    account_id: account.account,
  });

  stripeLogger('External Account Created', account.id);
  return { status: 200, data: account.id };
};

module.exports = {
  createExternalAccount,
  createAccountLink,
  createAccountLink2,
  createStripeConnectedAccount,
  eventHasBankAccount,
  getOrCreateStripeConnectedAccountId,
  hasStripeAccount,
  hasStripeBankAccount,
  getStripeAccount,
  getBankAccounts,
  getStripeBankAccountId,
};
