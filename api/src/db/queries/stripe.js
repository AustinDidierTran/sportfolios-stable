const { createAccountLink } = require('../helpers/stripe');

const getAccountLink = async (entity_id, ip) => {
  const accountLink = await createAccountLink({
    entity_id,
    ip,
  });

  return accountLink;
};

module.exports = { getAccountLink };
