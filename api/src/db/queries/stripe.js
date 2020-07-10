const {
  addPaymentMethodCustomer,
  addPrice,
  addProduct,
  checkout: checkoutHelper,
  createAccountLink,
  createExternalAccount,
  createInvoice,
  createInvoiceItem,
  createItem: createItemHelper,
  createPaymentMethod,
  createRefund: createRefundHelper,
  finalizeInvoice: finalizeInvoiceHelper,
  getCustomer: getCustomerHelper,
  getCustomerId: getCustomerIdHelper,
  getOrCreateCustomer,
  getReceipt: getReceiptHelper,
  getStripeAccount: getStripeAccountHelper,
  hasStripeAccount: hasStripeAccountHelper,
  hasStripeBankAccount: hasStripeBankAccountHelper,
  payInvoice: payInvoiceHelper,
  removePaymentMethodCustomer,
} = require('../helpers/stripe');

const getAccountLink = async (entity_id, ip) => {
  return createAccountLink({ entity_id, ip });
};

const addExternalAccount = async (body, userId, ip) => {
  //TODO: Add verification on authorizations ( isAdmin ?)
  return createExternalAccount(body, userId, ip);
};

const getStripeAccount = async entityId => {
  return getStripeAccountHelper(entityId);
};

const hasStripeAccount = async entityId => {
  return hasStripeAccountHelper(entityId);
};
const hasStripeBankAccount = async entityId => {
  return hasStripeBankAccountHelper(entityId);
};

const getCustomerId = async (body, userId) => {
  return getCustomerIdHelper(userId);
};

const getCustomer = async (body, userId) => {
  return getCustomerHelper(userId);
};

const addCustomer = async (body, userId) => {
  return getOrCreateCustomer(body, userId);
};

const addInvoiceItem = async (body, userId) => {
  return createInvoiceItem(body, userId);
};

const addInvoice = async (body, userId) => {
  return createInvoice(body, userId);
};

const finalizeInvoice = async (body, userId) => {
  return finalizeInvoiceHelper(body, userId);
};

const payInvoice = async (body, userId) => {
  return payInvoiceHelper(body, userId);
};

const paymentMethod = async (body, userId) => {
  return createPaymentMethod(body, userId);
};

const attachPaymentMethod = async (body, userId) => {
  return addPaymentMethodCustomer(body, userId);
};

const detachPaymentMethod = async (body, userId) => {
  return removePaymentMethodCustomer(body, userId);
};

const createProduct = async (body, userId) => {
  return addProduct(body, userId);
};

const createPrice = async (body, userId) => {
  return addPrice(body, userId);
};

const createItem = async (body, userId) => {
  return createItemHelper(body, userId);
};

const getReceipt = async (query, userId) => {
  return getReceiptHelper(query, userId);
};

const checkout = async (body, userId) => {
  return checkoutHelper(body, userId);
};

const createRefund = async (body, userId) => {
  return createRefundHelper(body, userId);
};

module.exports = {
  addCustomer,
  addExternalAccount,
  addInvoice,
  addInvoiceItem,
  attachPaymentMethod,
  checkout,
  createItem,
  createPrice,
  createProduct,
  createRefund,
  detachPaymentMethod,
  finalizeInvoice,
  getAccountLink,
  getCustomer,
  getCustomerId,
  getReceipt,
  getStripeAccount,
  hasStripeAccount,
  hasStripeBankAccount,
  payInvoice,
  paymentMethod,
};
