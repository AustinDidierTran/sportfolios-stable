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

const getOrCreateStripeConnectedAccountId = async entity_id => {
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
  const { entity_id } = props;
  const accountId = await getOrCreateStripeConnectedAccountId(
    props.entity_id,
  );
  const params = {
    account: accountId,
    failure_url: 'http://localhost:3000/profile',
    success_url: 'http://localhost:3000/profile',
    type: 'custom_account_verification',
    collect: 'eventually_due',
  };

  return stripe.accountLinks.create(params);
};

const createExternalAccount = async (body, id, ip) => {
  var created = 1;
  const accountId = await getOrCreateStripeConnectedAccountId(id);
  const params = {
    bank_account: {
      country: body.country,
      currency: body.currency,
      account_holder_name: body.account_holder_name,
      account_holder_type: body.account_holder_type,
      routing_number: body.routing_number,
      account_number: body.account_number,
    },
  };
  const tempParams = {
    bank_account: {
      country: 'US',
      currency: 'usd',
      account_holder_name: 'Jenny Rosen',
      account_holder_type: 'individual',
      routing_number: '110000000',
      account_number: '000123456789',
    },
  };
  stripe.tokens.create(tempParams, async (err, token) => {
    if (token) {
      console.log('Account Token Created', token.id);
      await stripe.accounts.createExternalAccount(
        accountId,
        {
          external_account: token.id,
        },
        async (err, account) => {
          if (account) {
            console.log('External Account Created', account.id);
          }
          if (err) {
            console.log('ERROR: External Account NOT Created');
            created = 0;
          }
        },
      );
    }
    if (err) {
      console.log('ERROR: Account Token NOT Created');
      created = 0;
    }
  });
  return created;
};

module.exports = {
  createAccountLink,
  createExternalAccount,
  stripeEnums,
};
