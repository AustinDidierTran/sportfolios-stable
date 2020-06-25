/**
 * Useful references
 * Testing account numbers: https://stripe.com/docs/connect/testing#account-numbers
 */

const {
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
} = require('./checkout');
const { addProduct, addPrice } = require('./shop');

module.exports = {
  createAccountLink,
  createExternalAccount,
  createInvoice,
  getStripeAccountId,
  createPaymentIntent,
  getOrCreateCustomer,
  createInvoiceItem,
  invoicePayment,
  getInvoiceItemId,
  createPaymentMethod,
  addPaymentMethodCustomer,
  removePaymentMethodCustomer,
  finalizeInvoice,
  addProduct,
  addPrice,
  payInvoice,
};
