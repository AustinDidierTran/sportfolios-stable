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
  getEventAccounts: getEventAccountsHelper,
  finalizeInvoice: finalizeInvoiceHelper,
  getCustomer: getCustomerHelper,
  getCustomerId: getCustomerIdHelper,
  getOrCreateCustomer,
  getPaymentMethods: getPaymentMethodsHelper,
  getReceipt: getReceiptHelper,
  getTaxes: getTaxesHelper,
  getBankAccounts: getBankAccountsHelper,
  createAccountLink2: createAccountLink2Helper,
  createStripeConnectedAccount: createStripeConnectedAccountHelper,
  hasStripeAccount: hasStripeAccountHelper,
  hasStripeBankAccount: hasStripeBankAccountHelper,
  payInvoice: payInvoiceHelper,
  removePaymentMethodCustomer,
  sendReceiptEmail: sendReceiptEmailHelper,
  sendRegistrationEmail: sendRegistrationEmailHelper,
  updateDefaultCreditCard: updateDefaultCreditCardHelper,
  updateDefaultBankAccount: updateDefaultBankAccountHelper,
  deleteCreditCard: deleteCreditCardHelper,
  deleteBankAccount: deleteBankAccountHelper,
} = require('../../db/queries/stripe');

function getAccountLink(ip, entityId) {
  return createAccountLink({ ip, entityId });
}

function addExternalAccount(body, ip) {
  return createExternalAccount(body, ip);
}

function getBankAccounts(entityId) {
  return getBankAccountsHelper(entityId);
}

function createAccountLink2(accountId) {
  return createAccountLink2Helper(accountId);
}

function createStripeConnectedAccount(accountId) {
  return createStripeConnectedAccountHelper(accountId);
}

function hasStripeAccount(entityId) {
  return hasStripeAccountHelper(entityId);
}
function hasStripeBankAccount(entityId) {
  return hasStripeBankAccountHelper(entityId);
}
function getEventAccounts(eventId) {
  return getEventAccountsHelper(eventId);
}

function getPaymentMethods(userId) {
  return getPaymentMethodsHelper(userId);
}

function getCustomerId(userId) {
  return getCustomerIdHelper(userId);
}

function getCustomer(body, userId) {
  return getCustomerHelper(userId);
}

function addCustomer(body, userId) {
  return getOrCreateCustomer(body, userId);
}

function addInvoiceItem(body, userId) {
  return createInvoiceItem(body, userId);
}

function addInvoice(body, userId) {
  return createInvoice(body, userId);
}

function finalizeInvoice(body, userId) {
  return finalizeInvoiceHelper(body, userId);
}

function payInvoice(body, userId) {
  return payInvoiceHelper(body, userId);
}

async function createPaymentMethod(body, userId) {
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
}

function attachPaymentMethod(body, userId) {
  return addPaymentMethodCustomer(body, userId);
}

function detachPaymentMethod(body, userId) {
  return removePaymentMethodCustomer(body, userId);
}

function createProduct(body, userId) {
  return addProduct(body, userId);
}

function createPrice(body, userId) {
  return addPrice(body, userId);
}

function createItem(body, userId) {
  return createItemHelper(body, userId);
}

function editItem(body, userId) {
  return editItemHelper(body, userId);
}

function deleteItem(body) {
  return deleteItemHelper(body);
}

function getReceipt(query, userId) {
  return getReceiptHelper(query, userId);
}

function getTaxes() {
  return getTaxesHelper();
}

function checkout(body, userId) {
  return checkoutHelper(body, userId);
}

function sendReceiptEmail(body, userId) {
  return sendReceiptEmailHelper(body, userId);
}

function sendRegistrationEmail(body, userId) {
  return sendRegistrationEmailHelper(body, userId);
}

function createRefund(body, userId) {
  return createRefundHelper(body, userId);
}

function updateDefaultCreditCard(body, userId) {
  return updateDefaultCreditCardHelper(body, userId);
}

function updateDefaultBankAccount(body) {
  return updateDefaultBankAccountHelper(body);
}

function deleteCreditCard(body, userId) {
  return deleteCreditCardHelper(body, userId);
}

function deleteBankAccount(body) {
  return deleteBankAccountHelper(body);
}

module.exports = {
  addCustomer,
  addExternalAccount,
  addInvoice,
  addInvoiceItem,
  attachPaymentMethod,
  checkout,
  createAccountLink2,
  createItem,
  createPaymentMethod,
  createPrice,
  createProduct,
  createRefund,
  createStripeConnectedAccount,
  deleteBankAccount,
  deleteCreditCard,
  deleteItem,
  detachPaymentMethod,
  editItem,
  finalizeInvoice,
  getAccountLink,
  getBankAccounts,
  getCustomer,
  getCustomerId,
  getEventAccounts,
  getPaymentMethods,
  getReceipt,
  getTaxes,
  hasStripeAccount,
  hasStripeBankAccount,
  payInvoice,
  sendReceiptEmail,
  sendRegistrationEmail,
  updateDefaultBankAccount,
  updateDefaultCreditCard,
};
