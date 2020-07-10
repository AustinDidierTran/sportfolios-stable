/**
 * Useful references
 * Testing account numbers: https://stripe.com/docs/connect/testing#account-numbers
 */

const checkoutHelpers = require('./checkout');
const customerHelpers = require('./customer');
const externalAccountHelpers = require('./externalAccount');
const shopHelpers = require('./shop');

module.exports = {
  ...checkoutHelpers,
  ...customerHelpers,
  ...externalAccountHelpers,
  ...shopHelpers,
};
