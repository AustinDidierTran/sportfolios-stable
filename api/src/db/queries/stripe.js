const {
  createExternalAccount,
  getStripeAccountId,
  createPaymentIntent,
  getOrCreateCustomer,
  createAccountLink,
  createInvoiceItem,
  invoicePayment,
  createPaymentMethod,
  addPaymentMethodCustomer,
  removePaymentMethodCustomer,
} = require('../helpers/stripe');

const getAccountLink = async (entity_id, ip) => {
  return createAccountLink({ entity_id, ip });
};

const addExternalAccount = async (body, user_id, ip) => {
  //TODO: Add verification on authorizations ( isAdmin ?)
  return createExternalAccount(body, user_id, ip);
};

const getStripeAccount = async entity_id => {
  return getStripeAccountId(entity_id);
};

const addPaymentIntent = async (body, user_id, ip) => {
  return createPaymentIntent(body, user_id, ip);
};

const addCustomer = async (body, user_id) => {
  return getOrCreateCustomer(body, user_id);
};

const addInvoiceItem = async (body, user_id) => {
  return createInvoiceItem(body, user_id);
};

const addInvoice = async (body, user_id) => {
  return invoicePayment(body, user_id);
};

const paymentMethod = async (body, user_id) => {
  return createPaymentMethod(body, user_id);
};

const attachPaymentMethod = async (body, user_id) => {
  return addPaymentMethodCustomer(body, user_id);
};

const detachPaymentMethod = async (body, user_id) => {
  return removePaymentMethodCustomer(body, user_id);
};

module.exports = {
  getAccountLink,
  addExternalAccount,
  getStripeAccount,
  addPaymentIntent,
  addCustomer,
  addInvoiceItem,
  addInvoice,
  paymentMethod,
  attachPaymentMethod,
  detachPaymentMethod,
};
