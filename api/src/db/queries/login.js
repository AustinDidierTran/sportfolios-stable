const knex = require('../connection');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const moment = require('moment');

const signup = async ({ email, password }) => {
  const salt = await bcrypt.genSalt();

  const hashedPassword = await bcrypt.hash(password, salt);
  return knex('users')
    .insert({
      email,
      password: hashedPassword,
    })
    .returning('*');
};

const login = async ({ email, password }) => {
  const user = await knex('users')
    .where({ email })
    .returning('*');

  if (!user) {
    // do something
  }

  const isSame = bcrypt.compareSync(password, user[0].password);

  if (isSame) {
    const token = uuid.v1();

    await knex('user_token').insert({
      user_id: user[0].id,
      token_id: token,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return token;
  }
};

module.exports = {
  login,
  signup,
};
