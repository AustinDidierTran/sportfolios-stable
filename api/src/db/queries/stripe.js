const {
  addPaymentMethodCustomer,
  addPrice,
  addProduct,
  checkout: checkoutHelper,
  createAccountLink,
  createCustomer,
  createExternalAccount,
  createInvoice,
  createInvoiceItem,
  createItem: createItemHelper,
  createPaymentMethod: createPaymentMethodHelper,
  createRefund: createRefundHelper,
  deleteItem: deleteItemHelper,
  editItem: editItemHelper,
  eventHasBankAccount: eventHasBankAccountHelper,
  finalizeInvoice: finalizeInvoiceHelper,
  getCustomer: getCustomerHelper,
  getCustomerId: getCustomerIdHelper,
  getOrCreateCustomer,
  getPaymentMethods: getPaymentMethodsHelper,
  getReceipt: getReceiptHelper,
  getStripeAccount: getStripeAccountHelper,
  getBankAccounts: getBankAccountsHelper,
  hasStripeAccount: hasStripeAccountHelper,
  hasStripeBankAccount: hasStripeBankAccountHelper,
  payInvoice: payInvoiceHelper,
  removePaymentMethodCustomer,
  sendReceiptEmail: sendReceiptEmailHelper,
  sendRegistrationEmail: sendRegistrationEmailHelper,
  updateDefaultCreditCard: updateDefaultCreditCardHelper,
  deleteCreditCard: deleteCreditCardHelper,
} = require('../helpers/stripe');

const getAccountLink = async (ip, userId) => {
  return createAccountLink({ ip, userId });
};

const addExternalAccount = async (body, userId, ip) => {
  //TODO: Add verification on authorizations ( isAdmin ?)
  return createExternalAccount(body, userId, ip);
};

const getStripeAccount = async userId => {
  return getStripeAccountHelper(userId);
};

const getBankAccounts = async userId => {
  return getBankAccountsHelper(userId);
};

const hasStripeAccount = async userId => {
  return hasStripeAccountHelper(userId);
};
const hasStripeBankAccount = async userId => {
  return hasStripeBankAccountHelper(userId);
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

const editItem = async (body, userId) => {
  return editItemHelper(body, userId);
};

const deleteItem = async body => {
  return deleteItemHelper(body);
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
const updateDefaultCreditCard = async (body, userId) => {
  return updateDefaultCreditCardHelper(body, userId);
};
const deleteCreditCard = async (body, userId) => {
  return deleteCreditCardHelper(body, userId);
};

module.exports = {
  addCustomer,
  addExternalAccount,
  addInvoice,
  addInvoiceItem,
  attachPaymentMethod,
  checkout,
  createItem,
  createPaymentMethod,
  createPrice,
  createProduct,
  createRefund,
  deleteItem,
  detachPaymentMethod,
  editItem,
  eventHasBankAccount,
  finalizeInvoice,
  getAccountLink,
  getCustomer,
  getCustomerId,
  getPaymentMethods,
  getReceipt,
  getStripeAccount,
  getBankAccounts,
  hasStripeAccount,
  hasStripeBankAccount,
  payInvoice,
  sendReceiptEmail,
  sendRegistrationEmail,
  updateDefaultCreditCard,
  deleteCreditCard,
};
