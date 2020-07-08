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
  createRefund,
} = require('./checkout');
const { addProduct, addPrice, createItem } = require('./shop');

module.exports = {
  addPaymentMethodCustomer,
  addPrice,
  addProduct,
  createItem,
  checkout,
  createAccountLink,
  createExternalAccount,
  createRefund,
  createInvoice,
  createInvoiceItem,
  createPaymentMethod,
  finalizeInvoice,
  getCustomerId,
  getOrCreateCustomer,
  getReceipt,
  getStripeAccountId,
  payInvoice,
  removePaymentMethodCustomer,
};
