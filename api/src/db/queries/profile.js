const knex = require('../connection');

function getUserInfo(user_id) {
  return knex('user_info')
    .select('*')
    .where({ user_id });
}

async function updateBirthDate(user_id, { birthDate }) {
  console.log('birthDate', birthDate);

  const updatedUser = await knex('user_info')
    .update({ birth_date: birthDate })
    .where({ user_id })
    .returning('user_id');

  if (!updatedUser) {
    return { code: 404 };
  }

  return { code: 200 };
}

module.exports = {
  getUserInfo,
  updateBirthDate,
};
