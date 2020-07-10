const { CLIENT_BASE_URL } = require('../../../../../conf');
const stripeFactories = require('./factories');
const { accountParamsFactory } = stripeFactories;
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const knex = require('../../connection');
const stripeEnums = require('./enums');
const { BUSINESS_TYPE_ENUM, TEST_EXTERNAL_ACCOUNT } = stripeEnums;
const {
  stripeErrorLogger,
  stripeLogger,
} = require('../../../server/utils/logger');

const getStripeAccount = async senderId => {
  console.log('entity', senderId);
  const [account = {}] = await knex('stripe_accounts')
    .select('*')
    .where({ entity_id: senderId });
  console.log('getAccount', account);
  return account;
};

const getStripeBankAccountId = async senderId => {
  const data = await knex
    .select('bank_account_id')
    .where('entity_id', senderId)
    .from('stripe_accounts');
  return (data.length && data[0].account_id) || null;
};

const getOrCreateStripeConnectedAccountId = async (entity_id, ip) => {
  let account = await getStripeAccount(entity_id);

  if (!account.account_id) {
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
  let returnCode = { status: 200 };
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
  try {
    const token = await stripe.tokens.create(params);
    const account = await stripe.accounts.createExternalAccount(
      accountId,
      {
        external_account: token.id,
      },
    );

    await knex('stripe_accounts')
      .update({
        bank_account_id: account.id,
        last4: account.last4,
      })
      .where({ account_id: account.account });

    stripeLogger('External Account Created', account.id);
    return { status: 200, data: account.id };
  } catch (error) {
    if (error) {
      stripeErrorLogger('ERROR: Account Token NOT CREATED');
      returnCode = { status: 403, error };
      return returnCode;
    }
  }
};

module.exports = {
  createExternalAccount,
  createAccountLink,
  createStripeConnectedAccount,
  getOrCreateStripeConnectedAccountId,
  getStripeAccount,
  getStripeBankAccountId,
};
