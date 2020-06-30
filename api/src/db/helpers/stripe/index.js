/**
 * Useful references
 * Testing account numbers: https://stripe.com/docs/connect/testing#account-numbers
 */

const {
  getCustomerId,
  getOrCreateCustomer,
  createPaymentMethod,
  addPaymentMethodCustomer,
  removePaymentMethodCustomer,
} = require('./customer');
const {
  createExternalAccount,
  createAccountLink,
  getStripeAccountId,
} = require('./externalAccount');
const {
  createInvoiceItem,
  createInvoice,
  finalizeInvoice,
  payInvoice,
  getReceipt,
  checkout,
} = require('./checkout');
const { addProduct, addPrice } = require('./shop');

module.exports = {
  getCustomerId,
  createAccountLink,
  createExternalAccount,
  createInvoice,
  getStripeAccountId,
  getOrCreateCustomer,
  createInvoiceItem,
  createPaymentMethod,
  addPaymentMethodCustomer,
  removePaymentMethodCustomer,
  finalizeInvoice,
  addProduct,
  addPrice,
  payInvoice,
  getReceipt,
  checkout,
};
