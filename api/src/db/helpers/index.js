const knex = require('../connection');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const { ENTITIES_TYPE_ENUM } = require('../../../../common/enums');

const {
  sendConfirmationEmail,
} = require('../../server/utils//nodeMailer');

const confirmEmail = async ({ email }) => {
  await knex('user_email')
    .update('confirmed_email_at', new Date())
    .where({ email });
};

const createUser = async password => {
  const userArray = await knex('users')
    .insert({ password })
    .returning(['id']);

  return userArray[0];
};

const createUserEmail = async ({ user_id, email }) => {
  await knex('user_email').insert({
    user_id,
    email,
  });
};

const createUserInfo = async ({ user_id, first_name, last_name }) => {
  const [id] = await knex('entities')
    .insert({
      type: ENTITIES_TYPE_ENUM.PERSON,
    })
    .returning('id');

  await knex('persons')
    .insert({
      id,
      first_name,
      last_name,
    })
    .returning('id');

  return knex('user_entity_role').insert({
    user_id,
    entity_id: id,
    role: 1,
  });
};

const createConfirmationEmailToken = async ({ email, token }) => {
  await knex('confirmation_email_token').insert({
    email,
    token: token,
    expires_at: new Date(Date.now() + 60 * 60 * 1000),
  });
};

const createRecoveryEmailToken = async ({ user_id, token }) => {
  await knex('recovery_email_token').insert({
    user_id,
    token,
    expires_at: new Date(Date.now() + 60 * 60 * 1000),
  });
};

const generateHashedPassword = async password => {
  const salt = await bcrypt.genSalt();

  const hashedPassword = await bcrypt.hash(password, salt);

  return hashedPassword;
};

const generateToken = () => {
  return uuid.v1();
};

const getBasicUserInfoFromId = async user_id => {
  const { rows: basicUserInfo } = await knex.raw(
    `SELECT p.id, p.first_name, p.last_name, p.birth_date, p.language, p.created_at, uer.role FROM persons AS p
    LEFT JOIN user_entity_role AS uer ON uer.entity_id = p.id
    WHERE user_id = '${user_id}'`,
  );

  const app_role = await knex('user_app_role')
    .select(['app_role'])
    .where({ user_id });

  if (!basicUserInfo || !basicUserInfo.length) {
    return null;
  }

  return app_role.length
    ? { ...basicUserInfo[0], app_role: app_role[0].app_role }
    : basicUserInfo[0];
};

const getEmailsFromUserId = async user_id => {
  if (!user_id) {
    return null;
  }

  const emails = await knex('user_email')
    .select(['email', 'confirmed_email_at'])
    .where({ user_id });

  return emails;
};

const getEmailFromToken = async ({ token }) => {
  const response = await knex('confirmation_email_token')
    .select(['email', 'expires_at'])
    .where({ token });

  if (!response.length || Date.now() > response[0].expires_at) {
    return null;
  }

  return response[0].email;
};

const getHashedPasswordFromId = async id => {
  const response = await knex('users')
    .where({ id })
    .returning(['password']);

  if (!response.length) {
    return null;
  }

  return response[0].password;
};

const getUserIdFromEmail = async email => {
  const response = await knex('user_email')
    .select(['user_id'])
    .where({ email });

  if (!response.length) {
    return null;
  }

  return response[0].user_id;
};

const getUserIdFromRecoveryPasswordToken = async token => {
  const response = await knex('recovery_email_token')
    .select(['user_id', 'expires_at', 'used_at'])
    .where({ token });

  if (
    !response.length ||
    response[0].used_at ||
    Date.now() > response[0].expires_at
  ) {
    return null;
  }
};

const setRecoveryTokenToUsed = async token => {
  await knex('recovery_email_token')
    .update({ used_at: new Date() })
    .where({ token });
};

const updateBasicUserInfoFromUserId = async ({
  user_id,
  firstName,
  language,
  lastName,
}) => {
  const update = {};

  if (firstName) {
    update.first_name = firstName;
  }

  if (language) {
    update.language = language;
  }

  if (lastName) {
    update.last_name = lastName;
  }

  await knex('persons')
    .update(update)
    .where({ user_id });
};

const updatePasswordFromUserId = async ({ hashedPassword, id }) => {
  await knex('users')
    .update({ password: hashedPassword })
    .where({ id });
};

const validateEmailIsConfirmed = async email => {
  const response = await knex('user_email')
    .where({ email })
    .returning(['confirmed_email_at']);

  return response.length && response[0].confirmed_email_at !== null;
};

const validateEmailIsUnique = async email => {
  const users = await knex('user_email')
    .where({ email })
    .returning(['id']);

  return !users.length;
};

const sendNewConfirmationEmailAllIncluded = async email => {
  const confirmationEmailToken = generateToken();

  await createConfirmationEmailToken({
    email,
    token: confirmationEmailToken,
  });

  await sendConfirmationEmail({
    email,
    token: confirmationEmailToken,
  });
};

module.exports = {
  confirmEmail,
  createUser,
  createUserEmail,
  createUserInfo,
  createConfirmationEmailToken,
  createRecoveryEmailToken,
  generateHashedPassword,
  generateToken,
  getBasicUserInfoFromId,
  getEmailFromToken,
  getEmailsFromUserId,
  getHashedPasswordFromId,
  getUserIdFromEmail,
  getUserIdFromRecoveryPasswordToken,
  sendNewConfirmationEmailAllIncluded,
  setRecoveryTokenToUsed,
  updateBasicUserInfoFromUserId,
  updatePasswordFromUserId,
  validateEmailIsConfirmed,
  validateEmailIsUnique,
};
