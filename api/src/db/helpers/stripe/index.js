/**
 * Useful references
 * Testing account numbers: https://stripe.com/docs/connect/testing#account-numbers
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

/* Private arguments */

const stripeEnums = require('./enums');
const { BUSINESS_TYPE_ENUM, TEST_EXTERNAL_ACCOUNT } = stripeEnums;

const stripeFactories = require('./factories');
const { accountParamsFactory } = stripeFactories;

const knex = require('../../connection');

/* Public arguments */
const getStripeAccountId = async senderId => {
  return knex
    .select('account_id')
    .from('stripe_accounts')
    .where('stripe_accounts.entity_id', senderId);
};

const getOrCreateStripeConnectedAccountId = async props => {
  const { entity_id, ip } = props;

  console.log('entity_id', entity_id);
  console.log('ip', ip);

  let [{ account_id: accountId } = {}] = await getStripeAccountId(
    entity_id,
  );

  console.log('accountId', accountId);

  if (!accountId) {
    const account = await createStripeConnectedAccount(props); // must return accountId
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
  console.log('props', props);

  const { accountId } = props;
  // const account_id = getOrCreateStripeConnectedAccountId(...props);

  const params = {
    account: accountId,
    failure_url: 'http://localhost:3000/profile',
    success_url: 'http://localhost:3000/profile',
    type: 'custom_account_verification',
    collect: 'eventually_due',
  };

  console.log('params', params);

  const accountLink = await stripe.accountLinks.create(params);

  return accountLink;
};

module.exports = {
  createStripeConnectedAccount,
  createAccountLink,
  getOrCreateStripeConnectedAccountId,
  getStripeAccountId,
  stripeEnums,
  stripeFactories,
};
