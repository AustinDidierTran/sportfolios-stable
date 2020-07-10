const {
  getCustomerId: getCustomerIdHelper,
  getCustomer: getCustomerHelper,
  createExternalAccount,
  getStripeAccount: getStripeAccountHelper,
  getOrCreateCustomer,
  createAccountLink,
  createInvoiceItem,
  createInvoice,
  createRefund: createRefundHelper,
  finalizeInvoice: finalizeInvoiceHelper,
  payInvoice: payInvoiceHelper,
  createPaymentMethod,
  addPaymentMethodCustomer,
  removePaymentMethodCustomer,
  addProduct,
  addPrice,
  createItem: createItemHelper,
  getReceipt: getReceiptHelper,
  checkout: checkoutHelper,
} = require('../helpers/stripe');

const getAccountLink = async (entity_id, ip) => {
  return createAccountLink({ entity_id, ip });
};

const addExternalAccount = async (body, user_id, ip) => {
  //TODO: Add verification on authorizations ( isAdmin ?)
  return createExternalAccount(body, user_id, ip);
};

const getStripeAccount = async entity_id => {
  return getStripeAccountHelper(entity_id);
};

const getCustomerId = async (body, userId) => {
  return getCustomerIdHelper(userId);
};

const getCustomer = async (body, userId) => {
  return getCustomerHelper(userId);
};

const addCustomer = async (body, user_id) => {
  return getOrCreateCustomer(body, user_id);
};

const addInvoiceItem = async (body, user_id) => {
  return createInvoiceItem(body, user_id);
};

const addInvoice = async (body, user_id) => {
  return createInvoice(body, user_id);
};

const finalizeInvoice = async (body, user_id) => {
  return finalizeInvoiceHelper(body, user_id);
};

const payInvoice = async (body, user_id) => {
  return payInvoiceHelper(body, user_id);
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

const createProduct = async (body, user_id) => {
  return addProduct(body, user_id);
};

const createPrice = async (body, user_id) => {
  return addPrice(body, user_id);
};

const createItem = async (body, userId) => {
  return createItemHelper(body, userId);
};

const getReceipt = async (query, user_id) => {
  return getReceiptHelper(query, user_id);
};

const checkout = async (body, user_id) => {
  return checkoutHelper(body, user_id);
};

const createRefund = async (body, user_id) => {
  return createRefundHelper(body, user_id);
};

module.exports = {
  getCustomerId,
  getCustomer,
  getAccountLink,
  addExternalAccount,
  getStripeAccount,
  addCustomer,
  addInvoiceItem,
  addInvoice,
  createRefund,
  paymentMethod,
  attachPaymentMethod,
  detachPaymentMethod,
  createProduct,
  createPrice,
  createItem,
  finalizeInvoice,
  payInvoice,
  getReceipt,
  checkout,
};
