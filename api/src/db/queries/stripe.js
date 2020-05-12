const {
  createStripeConnectedAccount,
  stripeEnums,
} = require('../helpers/stripe');

const createAccount = async (ip, body) => {
  return createStripeConnectedAccount({ ...body, ip });
};

module.exports = { createAccount };
