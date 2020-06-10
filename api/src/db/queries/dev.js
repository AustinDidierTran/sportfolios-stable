const {
  createStripeConnectedAccount,
  stripeEnums,
} = require('../helpers/stripe');

const stripe = async ip => {
  const account = await createStripeConnectedAccount({
    business_type: stripeEnums.BUSINESS_TYPE_ENUM.INDIVIDUAL, // Muse be one of individual, company, non-profit or gouvernment_entity (US only)
    email: 'austindidier@sportfolios.app',
    ip,
  });
  return account;
};

module.exports = { stripe };
