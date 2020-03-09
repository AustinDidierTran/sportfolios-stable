const knex = require('../connection');
const bcrypt = require('bcrypt');
const uuid = require('uuid');

const confirmEmail = async ({ email }) => {
  await knex('user_email')
    .update('confirmed_email_at', new Date())
    .where({ email })
}

const createUser = async (password) => {
  const userArray = await knex('users')
    .insert({ password }).returning(['id']);

  return userArray[0];
}

const createUserEmail = async ({ user_id, email }) => {
  await knex('user_email').insert({
    user_id,
    email,
  })
}

const createUserInfo = async ({ user_id, first_name, last_name }) => {
  await knex('user_info').insert({
    user_id: user_id,
    first_name,
    last_name
  });
}

const createConfirmationEmailToken = async ({ email, token }) => {
  await knex('confirmation_email_token').insert({
    email,
    token: token,
    expires_at: new Date(Date.now() + 60 * 60 * 1000)
  });
}

const createRecoveryEmailToken = async ({ user_id, token }) => {
  await knex('recovery_email_token')
    .insert({
      user_id,
      token,
      expires_at: new Date(Date.now() + 60 * 60 * 1000)
    });
}

const generateHashedPassword = async password => {
  const salt = await bcrypt.genSalt();

  const hashedPassword = await bcrypt.hash(password, salt);

  return hashedPassword;
}

const generateToken = () => {
  return uuid.v1();
}

const getEmailFromToken = async ({ token }) => {
  const response = await knex('confirmation_email_token')
    .select(['email', 'expires_at'])
    .where({ token });

  if (!response.length || Date.now() > response[0].expires_at) {
    return null;
  }

  return response[0].email;
}

const getHashedPasswordFromId = async (id) => {
  const response = await knex('users')
    .where({ id })
    .returning(['password']);

  if (!response.length) {
    return null;
  }

  return response[0].password;
}

const getUserIdFromEmail = async (email) => {
  const response = await knex('user_email')
    .select(['user_id'])
    .where({ email });

  if (!response.length) {
    return null;
  }

  return response[0].user_id;
}

const getUserIdFromRecoveryPasswordToken = async (token) => {
  const response = await knex('recovery_email_token')
    .select(['user_id', 'expires_at', 'used_at'])
    .where({ token });

  if (!response.length || response[0].used_at || Date.now() > response[0].expires_at) {
    return null;
  }
}

const getUserIdFromToken = async (token) => {
  let response = await knex('user_token')
    .select(['user_id', 'expires_at'])
    .where({ token_id: token });

  if (!response.length || response[0].expires_at < new Date()) {
    return null;
  }

  return response[0].user_id;
}

const setRecoveryTokenToUsed = async (token) => {
  await knex('recovery_email_token')
    .update({ used_at: new Date() })
    .where({ token });
}

const updatePasswordFromUserId = async ({
  hashedPassword,
  id,
}) => {
  await knex('users')
    .update({ password: hashedPassword })
    .where({ id });
}

const validateEmailIsConfirmed = async (email) => {
  const response = await knex('user_email')
    .where({ email })
    .returning(['confirmed_email_at']);

  return response.length && response[0].confirmed_email_at !== null;
}

const validateEmailIsUnique = async (email) => {
  const users = await knex('user_email')
    .where('email', email)
    .returning(['id']);

  return !users.length;
}


module.exports = {
  confirmEmail,
  createUser,
  createUserEmail,
  createUserInfo,
  createConfirmationEmailToken,
  createRecoveryEmailToken,
  generateHashedPassword,
  generateToken,
  getEmailFromToken,
  getHashedPasswordFromId,
  getUserIdFromEmail,
  getUserIdFromRecoveryPasswordToken,
  getUserIdFromToken,
  setRecoveryTokenToUsed,
  updatePasswordFromUserId,
  validateEmailIsConfirmed,
  validateEmailIsUnique,
}