import knex from '../connection.js';
import {
  GLOBAL_ENUM,
  ENTITIES_ROLE_ENUM,
  NOTIFICATION_ARRAY,
} from '../../../../common/enums/index.js';
import { EXPIRATION_TIMES } from '../../../../common/constants/index.js';

export const createRecoveryEmailToken = async ({ userId, token }) => {
  await knex('recovery_email_token').insert({
    user_id: userId,
    token,
    expires_at: new Date(Date.now() + EXPIRATION_TIMES.ACCOUNT_RECOVERY_TOKEN),
  });
};

export const createUser = async body => {
  const {
    password,
    email,
    name,
    surname,
    facebook_id,
    newsLetterSubscription,
    cognitoId,
    language,
  } = body;

  await knex.transaction(async trx => {
    const [user_id] = await knex('users')
      .insert([{ password, cognito_id: cognitoId, language }])
      .returning('id')
      .transacting(trx);

    // Create user email
    await knex('user_email')
      .insert({
        user_id,
        email: email.toLowerCase(),
        is_subscribed: newsLetterSubscription,
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
  });
};

export const createUserComplete = async body => {
  const {
    password,
    email,
    name,
    surname,
    facebook_id,
    newsLetterSubscription,
    cognitoId,
    language,
  } = body;

  await knex.transaction(async trx => {
    // Create user
    const [user_id] = await knex('users')
      .insert([{ password, cognito_id: cognitoId, language }])
      .returning('id')
      .transacting(trx);

    // Create user email
    await knex('user_email')
      .insert({
        user_id,
        email: email.toLowerCase(),
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
};

export const getEmailFromToken = async ({ token }) => {
  const response = await knex('confirmation_email_token')
    .select(['email', 'expires_at'])
    .where({ token });

  if (!response.length || Date.now() > response[0].expires_at) {
    return null;
  }

  return response[0].email;
};

export const getUserIdFromRecoveryPasswordToken = async token => {
  const [response] = await knex('recovery_email_token')
    .select(['user_id', 'expires_at', 'used_at'])
    .where({ token });

  if (!response || response.used_at || Date.now() > response.expires_at) {
    return null;
  }

  return response.user_id;
};

export const setRecoveryTokenToUsed = async token => {
  await knex('recovery_email_token')
    .update({ used_at: new Date() })
    .where({ token });
};

export const validateEmailIsUnique = async email => {
  const users = await knex('user_email')
    .where(knex.raw('lower("email")'), '=', email.toLowerCase())
    .returning(['id']);
  return !users.length;
};

export const getUserIdFromAuthToken = async token => {
  const [{ user_id } = {}] = await knex('user_token')
    .select('user_id')
    .where('token_id', token)
    .whereRaw('expires_at > now()');

  return user_id;
};

export const updateCognitoIdUser = async ({ userId, cognitoId }) => {
  await knex('users')
    .update({ cognito_id: cognitoId })
    .where({ id: userId });
};
