const knex = require('../connection');

function getUserInfo(user_id) {
  return knex('user_info')
    .select('*')
    .where({ user_id });
}

async function updateBirthDate(user_id, { birthDate }) {
  const updatedUser = await knex('user_info')
    .update({ birth_date: birthDate })
    .where({ user_id })
    .returning('user_id');

  if (!updatedUser) {
    return { code: 404 };
  }

  return { code: 200 };
}

async function updatePhotoUrl(user_id, { photoUrl }) {
  const updatedUser = await knex('user_info')
    .update({ photo_url: photoUrl })
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
  updatePhotoUrl,
};
