const knex = require('../connection');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const { sendConfirmationEmail } = require('../../server/utils/nodeMailer');

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

const validateEmailIsConfirmed = async (email) => {
  const response = await knex('user_email')
    .where({ email })
    .returning(['confirmed_email_at']);

  return response.length && response[0].confirmed_email_at !== null;
}

const signup = async ({ firstName, lastName, email, password }) => {
  // Validate email is not already taken
  const isUnique = validateEmailIsUnique(email);

  if (!isUnique) return { code: 403 };

  const salt = await bcrypt.genSalt();

  const hashedPassword = await bcrypt.hash(password, salt);

  const confirmationEmailToken = uuid.v1();

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
    sendTo: email,
    token: confirmationEmailToken,
  });

  return null;
};

const login = async ({ email, password }) => {
  // Validate email is confirmed
  const emailIsConfirmed = await validateEmailIsConfirmed(email);

  if (!emailIsConfirmed) {
    // TODO: do something
    return null;
  }

  const user_id = await getUserIdFromEmail(email);

  const hashedPassword = await getHashedPasswordFromId(user_id);
  if (!hashedPassword) {
    // TODO: do something
    return null;
  }

  const isSame = bcrypt.compareSync(password, hashedPassword);

  if (isSame) {
    const token = uuid.v1();

    await knex('user_token').insert({
      user_id: user_id,
      token_id: token,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return token;
  } else {
    return null;
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

module.exports = {
  confirmEmail,
  login,
  signup,
};
