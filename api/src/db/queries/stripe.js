const {
  addPaymentMethodCustomer,
  addPrice,
  addProduct,
  checkout: checkoutHelper,
  createCustomer,
  createAccountLink,
  createExternalAccount,
  createInvoice,
  createInvoiceItem,
  createItem: createItemHelper,
  createPaymentMethod: createPaymentMethodHelper,
  createRefund: createRefundHelper,
  eventHasBankAccount: eventHasBankAccountHelper,
  finalizeInvoice: finalizeInvoiceHelper,
  getCustomer: getCustomerHelper,
  getCustomerId: getCustomerIdHelper,
  getOrCreateCustomer,
  getReceipt: getReceiptHelper,
  getStripeAccount: getStripeAccountHelper,
  hasStripeAccount: hasStripeAccountHelper,
  hasStripeBankAccount: hasStripeBankAccountHelper,
  payInvoice: payInvoiceHelper,
  getPaymentMethods: getPaymentMethodsHelper,
  removePaymentMethodCustomer,
  sendReceiptEmail: sendReceiptEmailHelper,
  sendRegistrationEmail: sendRegistrationEmailHelper,
} = require('../helpers/stripe');

const getAccountLink = async (entity_id, ip) => {
  return createAccountLink({ entity_id, ip });
};

const addExternalAccount = async (body, ip) => {
  //TODO: Add verification on authorizations ( isAdmin ?)
  return createExternalAccount(body, ip);
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
const eventHasBankAccount = async adminId => {
  return eventHasBankAccountHelper(adminId);
};

const getPaymentMethods = async userId => {
  return getPaymentMethodsHelper(userId);
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

const createPaymentMethod = async (body, userId) => {
  const paymentMethodId = await createPaymentMethodHelper(
    body,
    userId,
  );

  const customerId = await createCustomer(
    body,
    userId,
    paymentMethodId,
  );

  return customerId;
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

const sendReceiptEmail = async (body, userId) => {
  return sendReceiptEmailHelper(body, userId);
};

const sendRegistrationEmail = async (body, userId) => {
  return sendRegistrationEmailHelper(body, userId);
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
  eventHasBankAccount,
  finalizeInvoice,
  getAccountLink,
  getCustomer,
  getCustomerId,
  getPaymentMethods,
  getReceipt,
  getStripeAccount,
  hasStripeAccount,
  hasStripeBankAccount,
  payInvoice,
  createPaymentMethod,
  sendReceiptEmail,
  sendRegistrationEmail,
};
