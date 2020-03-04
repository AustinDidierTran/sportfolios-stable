const knex = require('../connection');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const { sendConfirmationEmail } = require('../../server/utils/nodeMailer');

const signup = async ({ email, password }) => {
  const salt = await bcrypt.genSalt();

  const hashedPassword = await bcrypt.hash(password, salt);

  const confirmationEmailToken = uuid.v1();

  const users = await knex('users')
    .insert({
      password: hashedPassword,
    })
    .returning(['id']);

  const user = users[0];

  await knex('user_email').insert({
    user_id: user.id,
    email,
  })

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
  const response = await knex('users')
    .where({ email })
    .returning('*');

  const user = response[0];

  if (!user) {
    // do something
    return null;
  }

  const isSame = bcrypt.compareSync(password, user.password);

  if (isSame) {
    const token = uuid.v1();

    await knex('user_token').insert({
      user_id: user.id,
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

  console.log(response);
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
