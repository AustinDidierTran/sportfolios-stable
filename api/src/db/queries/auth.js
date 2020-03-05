const knex = require('../connection');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const { sendConfirmationEmail, sendRecoveryEmail } = require('../../server/utils/nodeMailer');

const validateEmailIsUnique = async (email) => {
  const users = await knex('user_email')
    .where('email', email)
    .returning(['id']);

  return !users.length;
}

const createUser = async (password) => {
  const userArray = await knex('users')
    .insert({ password }).returning(['id']);

  return userArray[0];
}

const getUserIdFromEmail = async (email) => {
  const response = await knex('user_email')
    .where({ email })
    .returning(['user_id']);

  if (!response.length) {
    return null;
  }

  return response[0].user_id;
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

const generateHashedPassword = async password => {
  const salt = await bcrypt.genSalt();

  const hashedPassword = await bcrypt.hash(password, salt);

  return hashedPassword;
}

const validateEmailIsConfirmed = async (email) => {
  const response = await knex('user_email')
    .where({ email })
    .returning(['confirmed_email_at']);

  return response.length && response[0].confirmed_email_at !== null;
}

const generateToken = () => {
  return uuid.v1();
}

const signup = async ({ firstName, lastName, email, password }) => {
  // Validate email is not already taken
  const isUnique = validateEmailIsUnique(email);

  if (!isUnique) return { code: 403 };

  const hashedPassword = await generateHashedPassword(password)

  const confirmationEmailToken = generateToken();

  const user = await createUser(hashedPassword);

  await knex('user_email').insert({
    user_id: user.id,
    email,
  })

  await knex('user_info').insert({
    user_id: user.id,
    first_name: firstName,
    last_name: lastName
  });

  await knex('confirmation_email_token').insert({
    email,
    token: confirmationEmailToken,
    expires_at: new Date(Date.now() + 60 * 60 * 1000)
  });

  // Send confirmation email with link
  await sendConfirmationEmail({
    email,
    token: confirmationEmailToken,
  });

  return { code: 200 };
};

const login = async ({ email, password }) => {
  // Validate email is confirmed
  const emailIsConfirmed = await validateEmailIsConfirmed(email);

  if (!emailIsConfirmed) {
    return { status: 401 };
  }

  const user_id = await getUserIdFromEmail(email);

  const hashedPassword = await getHashedPasswordFromId(user_id);
  if (!hashedPassword) {
    return { status: 402 };
  }

  const isSame = bcrypt.compareSync(password, hashedPassword);

  if (isSame) {
    const token = generateToken();

    await knex('user_token').insert({
      user_id: user_id,
      token_id: token,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return { status: 200, token };
  } else {
    return { status: 403 };
  }
};

const confirmEmail = async ({ token }) => {
  const response = await knex('confirmation_email_token')
    .select(['email', 'expires_at'])
    .where({ token });

  const [{ email, expires_at }] = response;

  if (!email) {
    // Email not found
    return 404;
  }

  if (Date.now() > expires_at) {
    // Token expired
    return 403;
  }

  await knex('user_email')
    .update('confirmed_email_at', new Date())
    .where({ email })

  return 200;
}

const recoveryEmail = async ({ email }) => {
  const response = await knex('user_email')
    .select(['user_id'])
    .where({ email });

  if (!response.length) {
    return 404;
  }

  const { user_id } = response[0];
  const token = generateToken();

  await knex('recovery_email_token')
    .insert({
      user_id,
      token,
      expires_at: new Date(Date.now() + 60 * 60 * 1000)
    });

  await sendRecoveryEmail({ email, token });

  return 200;
}

const recoverPassword = async ({ token, password }) => {
  const response = await knex('recovery_email_token')
    .select(['user_id', 'expires_at', 'used_at'])
    .where({ token });

  if (!response.length || response[0].used_at || Date.now() > response[0].expires_at) {
    return 403;
  }

  const hashedPassword = await generateHashedPassword(password);

  await knex('users')
    .update({ password: hashedPassword })
    .where({ id: response[0].user_id });

  await knex('recovery_email_token')
    .update({ used_at: new Date() })
    .where({ token });

  return 200;
}

const resendConfirmationEmail = async ({ email }) => {
  const response = await knex('user_email')
    .select(['confirmed_email_at'])
    .where({ email });

  if (!response.length) {
    // Account does not exist
    return 404;
  }

  if (response[0].confirmed_email_at) {
    // Email is already confirmed, don't send a new email
    return 403;
  }

  const token = generateToken();

  await knex('confirmation_email_token').insert({
    email,
    token,
    expires_at: new Date(Date.now() + 60 * 60 * 1000)
  });

  // Send confirmation email with link
  await sendConfirmationEmail({
    email,
    token,
  });

  return 200;
}

const changePassword = async ({ authToken, oldPassword, newPassword }) => {
  let response = await knex('user_token')
    .select(['user_id', 'expires_at'])
    .where({ token_id: authToken });

  if (!response.length || response[0].expires_at < new Date()) {
    return 402;
  }

  const user_id = response[0].user_id;

  response = await knex('users')
    .select(['password'])
    .where({ id: user_id })

  if (!response.length) {
    return 404;
  }

  const oldHashedPassword = response[0].password;

  const isSame = bcrypt.compareSync(oldPassword, oldHashedPassword);

  if (!isSame) {
    return 403;
  }

  const newHashedPassword = await generateHashedPassword(newPassword);

  await knex('users')
    .update({ password: newHashedPassword })
    .where({ id: user_id });

  return 200;
}

module.exports = {
  changePassword,
  confirmEmail,
  recoverPassword,
  recoveryEmail,
  sendConfirmationEmail: resendConfirmationEmail,
  login,
  signup,
};
