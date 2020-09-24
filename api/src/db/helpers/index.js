const knex = require('../connection');
const bcrypt = require('bcrypt');
const { v1: uuidv1 } = require('uuid');
const {
  ENTITIES_ROLE_ENUM,
  GLOBAL_ENUM,
} = require('../../../../common/enums');

const {
  sendConfirmationEmail,
} = require('../../server/utils//nodeMailer');
const { ERROR_ENUM } = require('../../../../common/errors');

const confirmEmail = async ({ email }) => {
  await knex('user_email')
    .update('confirmed_email_at', new Date())
    .where({ email });
};

const createUserEmail = async body => {
  const { user_id, email } = body;

  await knex('user_email').insert({ user_id, email });
};

const createUserComplete = async body => {
  const { password, email, name, surname } = body;

  await knex.transaction(async trx => {
    // Create user
    const [user_id] = await knex('users')
      .insert({ password })
      .returning('id')
      .transacting(trx);

    // Create user email
    await knex('user_email')
      .insert({ user_id, email })
      .transacting(trx);

    // Create user info
    const [entity_id] = await knex('entities')
      .insert({
        type: GLOBAL_ENUM.PERSON,
      })
      .returning('id')
      .transacting(trx);

    await knex('entities_name')
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
  });
};

const createConfirmationEmailToken = async ({ email, token }) => {
  await knex('confirmation_email_token').insert({
    email,
    token: token,
    expires_at: new Date(Date.now() + 60 * 60 * 1000),
  });
};

const createRecoveryEmailToken = async ({ userId, token }) => {
  await knex('recovery_email_token').insert({
    user_id: userId,
    token,
    expires_at: new Date(Date.now() + 60 * 60 * 1000),
  });
};

const generateHashedPassword = async password => {
  if (!password) {
    throw new Error(ERROR_ENUM.VALUE_IS_REQUIRED);
  }
  if (password.length < 8 || password.length > 24) {
    throw new Error(ERROR_ENUM.VALUE_IS_INVALID);
  }
  const salt = await bcrypt.genSalt();

  const hashedPassword = await bcrypt.hash(password, salt);

  return hashedPassword;
};

const generateToken = () => {
  return uuidv1();
};

const generateAuthToken = async userId => {
  const token = generateToken();
  await knex('user_token').insert({
    user_id: userId,
    token_id: token,
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });
  return token;
};

const getBasicUserInfoFromId = async user_id => {
  const [{ app_role } = {}] = await knex('user_app_role')
    .select(['app_role'])
    .where({ user_id });

  const [{ language } = {}] = await knex('users')
    .select('language')
    .where({ id: user_id });

  const persons = await knex('user_entity_role')
    .select(
      'user_entity_role.entity_id',
      'name',
      'surname',
      'photo_url',
    )
    .leftJoin(
      'entities',
      'user_entity_role.entity_id',
      '=',
      'entities.id',
    )
    .leftJoin(
      'entities_name',
      'user_entity_role.entity_id',
      '=',
      'entities_name.entity_id',
    )
    .leftJoin(
      'entities_photo',
      'user_entity_role.entity_id',
      '=',
      'entities_photo.entity_id',
    )
    .where('entities.type', GLOBAL_ENUM.PERSON)
    .andWhere({ user_id });

  return {
    persons,
    app_role,
    language,
    user_id,
  };
};

const getEmailsFromUserId = async userId => {
  if (!userId) {
    return [];
  }

  const emails = await knex('user_email')
    .select(['email', 'confirmed_email_at'])
    .where({ user_id: userId });

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
  const [{ password } = {}] = await knex('users')
    .where({ id })
    .returning(['password']);

  return password;
};

const getPrimaryPersonIdFromUserId = async user_id => {
  const [{ primary_person: id }] = await knex('user_primary_person')
    .select('primary_person')
    .where({ user_id });
  return id;
};

const getUserIdFromEmail = async body => {
  const { email } = body;

  const [{ user_id } = {}] = await knex('user_email')
    .select(['user_id'])
    .where({ email });

  return user_id;
};

const getLanguageFromEmail = async email => {
  const id = await getUserIdFromEmail({ email });
  const infos = await getBasicUserInfoFromId(id);
  return infos.language;
};

const getUserIdFromRecoveryPasswordToken = async token => {
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
};

const setRecoveryTokenToUsed = async token => {
  await knex('recovery_email_token')
    .update({ used_at: new Date() })
    .where({ token });
};

const updateBasicUserInfoFromUserId = async ({
  user_id,
  language,
}) => {
  const update = {};

  if (language) {
    update.language = language;
  }

  await knex('users')
    .update(update)
    .where({ id: user_id });
};

const updatePasswordFromUserId = async ({ hashedPassword, id }) => {
  await knex('users')
    .update({ password: hashedPassword })
    .where({ id });
};

const updatePrimaryPerson = async (user_id, primary_person) => {
  return await knex('user_primary_person')
    .update({ primary_person })
    .where({ user_id });
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

const sendNewConfirmationEmailAllIncluded = async (
  email,
  successRoute,
) => {
  const confirmationEmailToken = generateToken();

  await createConfirmationEmailToken({
    email,
    token: confirmationEmailToken,
  });

  await sendConfirmationEmail({
    email,
    token: confirmationEmailToken,
    successRoute,
  });
};

module.exports = {
  confirmEmail,
  createUserEmail,
  createUserComplete,
  createConfirmationEmailToken,
  createRecoveryEmailToken,
  generateHashedPassword,
  generateToken,
  generateAuthToken,
  getBasicUserInfoFromId,
  getEmailFromToken,
  getEmailsFromUserId,
  getHashedPasswordFromId,
  getLanguageFromEmail,
  getUserIdFromEmail,
  getUserIdFromRecoveryPasswordToken,
  sendNewConfirmationEmailAllIncluded,
  setRecoveryTokenToUsed,
  updateBasicUserInfoFromUserId,
  updatePasswordFromUserId,
  validateEmailIsConfirmed,
  validateEmailIsUnique,
  getPrimaryPersonIdFromUserId,
  updatePrimaryPerson,
};
