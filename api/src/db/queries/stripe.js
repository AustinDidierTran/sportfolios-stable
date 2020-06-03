var stripe = require('stripe')(
  'sk_test_tzvUgJHRWyWNg0s3ctjHFd6P00DoFwlm9f',
);

// const { getStripeAccountId } = require('../helpers');

const {
  createStripeConnectedAccount,
  createAccountLink,
  getOrCreateStripeConnectedAccountId,
  getStripeAccountId,
  stripeEnums,
} = require('../helpers/stripe');

const getAccountLink = async (entity_id, ip) => {
  const accountId = await getOrCreateStripeConnectedAccountId({
    entity_id,
    ip,
  });

  const accountLink = await createAccountLink({
    accountId,
    ip,
  });

  return accountLink;
};

module.exports = { getAccountLink };
