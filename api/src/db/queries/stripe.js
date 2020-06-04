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

const addExternalAccount = async (body, id, ip) => {
  //TODO: Add verification on authorizations ( isAdmin ?)

  const id2 = '349ebb1c-0b63-47e0-a42a-13d20407e2ab';
  return createExternalAccount(body, id2, ip);
};

module.exports = { getAccountLink, addExternalAccount };
