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
  const data = await knex
    .select('account_id')
    .from('stripe_accounts')
    .where('stripe_accounts.entity_id', senderId);

  return (data.length && data[0].account_id) || null;
};

const getOrCreateStripeConnectedAccountId = async props => {
  const { entity_id, ip } = props;

  let accountId = await getStripeAccountId(entity_id);

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
  const accountId = await getOrCreateStripeConnectedAccountId(props);
  const params = {
    account: accountId,
    failure_url: 'http://localhost:3000/profile',
    success_url: 'http://localhost:3000/profile',
    type: 'custom_account_verification',
    collect: 'eventually_due',
  };

  return stripe.accountLinks.create(params);
};

module.exports = {
  createAccountLink,
  stripeEnums,
};
