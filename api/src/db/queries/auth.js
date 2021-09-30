import knex from '../connection.js';
import {
  GLOBAL_ENUM,
  ENTITIES_ROLE_ENUM,
  NOTIFICATION_ARRAY,
} from '../../../../common/enums/index.js';
import { EXPIRATION_TIMES } from '../../../../common/constants/index.js';

async function createRecoveryEmailToken({ userId, token }) {
  await knex('recovery_email_token').insert({
    user_id: userId,
    token,
    expires_at: new Date(
      Date.now() + EXPIRATION_TIMES.ACCOUNT_RECOVERY_TOKEN,
    ),
  });
}

async function createUserComplete(body) {
  const {
    password,
    email,
    name,
    surname,
    facebook_id,
    newsLetterSubscription,
    cognitoId,
  } = body;

  await knex.transaction(async trx => {
    // Create user

    const [user_id] = await knex('users')
      .insert([{ password: password, cognito_id: cognitoId }])
      .returning('id')
      .transacting(trx);

    // Create user email
    await knex('user_email')
      .insert({
        user_id,
        email,
        is_subscribed: newsLetterSubscription,
      })
      .transacting(trx);

    // Create user info
    const [entity_id] = await knex('entities')
      .insert({
        type: GLOBAL_ENUM.PERSON,
      })
      .returning('id')
      .transacting(trx);

    await knex('entities_general_infos')
      .insert({
        entity_id,
        name,
        surname,
      })
      .transacting(trx);

    await knex('user_entity_role')
      .insert({
        user_id,
        entity_id,
        role: ENTITIES_ROLE_ENUM.ADMIN,
      })
      .transacting(trx);

    await knex('user_primary_person')
      .insert({ user_id, primary_person: entity_id })
      .transacting(trx);
    //Set app connections
    await knex('user_apps_id')
      .insert({
        user_id,
        facebook_id,
      })
      .transacting(trx);

    await Promise.all(
      NOTIFICATION_ARRAY.map(async notif => {
        await knex('user_notification_setting')
          .insert({
            user_id,
            type: notif.type,
            email: notif.email,
            chatbot: notif.chatbot,
            in_app: notif.inApp,
          })
          .transacting(trx);
      }),
    );
    return trx;
  });
}

async function getEmailFromToken({ token }) {
  const response = await knex('confirmation_email_token')
    .select(['email', 'expires_at'])
    .where({ token });

  if (!response.length || Date.now() > response[0].expires_at) {
    return null;
  }

  return response[0].email;
}

async function getUserIdFromRecoveryPasswordToken(token) {
  const [response] = await knex('recovery_email_token')
    .select(['user_id', 'expires_at', 'used_at'])
    .where({ token });

  if (
    !response ||
    response.used_at ||
    Date.now() > response.expires_at
  ) {
    return null;
  }

  return response.user_id;
}

async function setRecoveryTokenToUsed(token) {
  await knex('recovery_email_token')
    .update({ used_at: new Date() })
    .where({ token });
}

async function validateEmailIsUnique(email) {
  const users = await knex('user_email')
    .where({ email })
    .returning(['id']);
  return !users.length;
}

async function getUserIdFromAuthToken(token) {
  const [{ user_id } = {}] = await knex('user_token')
    .select('user_id')
    .where('token_id', token)
    .whereRaw('expires_at > now()');

  return user_id;
}

export const updateCognitoIdUser = async ({ userId, cognitoId }) => {
  await knex('users')
    .update({ cognito_id: cognitoId })
    .where({ id: userId });
}

export {
  createRecoveryEmailToken,
  createUserComplete,
  getEmailFromToken,
  getUserIdFromRecoveryPasswordToken,
  setRecoveryTokenToUsed,
  validateEmailIsUnique,
  getUserIdFromAuthToken,
};
