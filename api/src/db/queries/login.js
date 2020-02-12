const knex = require('../connection');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const { sendMail } = require('../../server/utils/nodeMailer');

const signup = async ({ email, password }) => {
  const salt = await bcrypt.genSalt();

  const hashedPassword = await bcrypt.hash(password, salt);

  console.log('hashedPassword', hashedPassword);

  const confirmationEmailToken = uuid.v1();

  console.log('confirmationEmailToken', confirmationEmailToken);

  const response = await knex('users')
    .insert({
      email,
      password: hashedPassword,
      confirmation_email_token: confirmationEmailToken,
    })
    .returning('*');

  // Send confirmation email with link
  await sendMail({
    sendTo: email,
    subject: 'Confirmation Email',
    text: `There is your confirmation email with your token ${confirmationEmailToken}`,
  });

  console.log('response', response);

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

module.exports = {
  login,
  signup,
};
