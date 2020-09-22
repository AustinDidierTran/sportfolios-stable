const knex = require('../connection');
const moment = require('moment');

async function getUserInfo(sender, target) {
  const [{ count }] = (sender !== target &&
    (await knex('followers')
      .count('*')
      .where({ sender, target }))) || [{ count: 0 }];

  const [userInfo] = await knex('persons')
    .select('*')
    .where({ user_id: target });

  if (!userInfo) {
    return null;
  }

  return { ...userInfo, isFollowing: Boolean(+count) };
}

async function updateBirthDate(user_id, { birthDate }) {
  const date = moment(birthDate);

  if (!date.isValid()) {
    return { code: 403 };
  }

  if (date.diff(moment()) > 0) {
    return { code: 402 };
  }

  const updatedUser = await knex('persons')
    .update({ birth_date: birthDate })
    .where({ user_id })
    .returning('user_id');

  if (!updatedUser) {
    return { code: 404 };
  }

  return { code: 200 };
}

async function updatePhotoUrl(user_id, { photoUrl }) {
  const updatedUser = await knex('persons')
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
