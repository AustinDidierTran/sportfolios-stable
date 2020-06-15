const {
  createAccountLink,
  createExternalAccount,
  getStripeAccountId,
  createPaymentIntent,
  createCustomer,
  createInvoiceItem,
  invoicePayment,
} = require('../helpers/stripe');

const getAccountLink = async (entity_id, ip) => {
  const accountLink = await createAccountLink({
    entity_id,
    ip,
  });

  return accountLink;
};

const addExternalAccount = async (body, user_id, ip) => {
  //TODO: Add verification on authorizations ( isAdmin ?)
  return createExternalAccount(body, user_id, ip);
};

const getStripeAccount = async entity_id => {
  const accountLink = await getStripeAccountId(entity_id);

  return accountLink;
};

const addPaymentIntent = async (body, user_id, ip) => {
  return createPaymentIntent(body, user_id, ip);
};

const addCustomer = async (body, user_id) => {
  return createCustomer(body, user_id);
};

const addInvoiceItem = async (body, user_id) => {
  return createInvoiceItem(body, user_id);
};

const addInvoice = async (body, user_id) => {
  return invoicePayment(body, user_id);
};

module.exports = {
  getAccountLink,
  addExternalAccount,
  getStripeAccount,
  addPaymentIntent,
  addCustomer,
  addInvoiceItem,
  addInvoice,
};
