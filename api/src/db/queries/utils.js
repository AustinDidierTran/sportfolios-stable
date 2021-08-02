const { v1: uuidv1 } = require('uuid');
const { EXPIRATION_TIMES } = require('../../../../common/constants');
const { ENTITIES_ROLE_ENUM } = require('../../../../common/enums');
const { getEntityRole } = require('./entity');

const generateToken = () => {
  return uuidv1();
};

const generateAuthToken = async userId => {
  const token = generateToken();
  await knex('user_token').insert({
    user_id: userId,
    token_id: token,
    expires_at: new Date(Date.now() + EXPIRATION_TIMES.AUTH_TOKEN),
  });
  return token;
};

async function isAllowed(
  entityId,
  userId,
  acceptationRole = ENTITIES_ROLE_ENUM.ADMIN,
) {
  const role = await getEntityRole(entityId, userId);
  return role <= acceptationRole;
}

module.exports = { generateAuthToken, generateToken, isAllowed };
