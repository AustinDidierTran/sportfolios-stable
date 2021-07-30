const knex = require('../connection');

async function getEmailUser(userId) {
  const [{ email }] = await knex('user_email')
    .select('email')
    .where({ user_id: userId });
  return email;
}

module.exports = {
  getEmailUser,
};
