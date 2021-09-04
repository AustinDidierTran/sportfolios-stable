import knex from '../connection.js';
import { v1 as uuidv1 } from 'uuid';
import { EXPIRATION_TIMES } from '../../../../common/constants/index.js';
import { ENTITIES_ROLE_ENUM } from '../../../../common/enums/index.js';
import { getEntityRole } from './entity.js';

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

export { generateAuthToken, generateToken, isAllowed };
