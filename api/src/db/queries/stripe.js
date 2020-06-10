const {
  createAccountLink,
  createExternalAccount,
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

module.exports = { getAccountLink, addExternalAccount };
