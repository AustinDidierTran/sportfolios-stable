/**
 * Useful references
 * Testing account numbers: https://stripe.com/docs/connect/testing#account-numbers
 */

const stripe = require('stripe')(
  'sk_test_tzvUgJHRWyWNg0s3ctjHFd6P00DoFwlm9f',
);

/* Private arguments */

const stripeEnums = require('./enums');
const { TEST_EXTERNAL_ACCOUNT } = stripeEnums;

const stripeFactories = require('./factories');
const { accountParamsFactory } = stripeFactories;

/* Public arguments */

// REF: https://stripe.com/docs/api/accounts/create?lang=node
const createStripeConnectedAccount = async props => {
  const { business_type, email, ip } = props;

  const params = accountParamsFactory({
    business_type,
    city: 'Sherbrooke',
    country: 'CA',
    dob: { day: 17, month: 2, year: 1994 },
    email,
    external_account: TEST_EXTERNAL_ACCOUNT.PAYOUT_SUCCEED,
    first_name: 'Austin-Didier',
    ip,
    last_name: 'Tran',
    line1: '590 rue Short',
    postal_code: 'J1H2E4',
    state: 'QC',
  });

  const account = await stripe.account.create(params);

  return account;
};

module.exports = {
  createStripeConnectedAccount,
  stripeEnums,
  stripeFactories,
};
