const knex = require('../connection');

function getUserInfo(user_id) {
  return knex('user_info')
    .select('*')
    .where({ user_id });
}

module.exports = {
  getUserInfo,
};
