const knex = require('../connection');
const moment = require('moment');
const { STATUS_ENUM } = require('../../../../common/enums');

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
    return { code: STATUS_ENUM.FORBIDDEN };
  }

  if (date.diff(moment()) > 0) {
    return { code: STATUS_ENUM.UNAUTHORIZED };
  }

  const updatedUser = await knex('persons')
    .update({ birth_date: birthDate })
    .where({ user_id })
    .returning('user_id');

  if (!updatedUser) {
    return { code: STATUS_ENUM.ERROR };
  }

  return { code: STATUS_ENUM.SUCCESS };
}

async function updatePhotoUrl(user_id, { photoUrl }) {
  const updatedUser = await knex('persons')
    .update({ photo_url: photoUrl })
    .where({ user_id })
    .returning('user_id');

  if (!updatedUser) {
    return { code: STATUS_ENUM.ERROR };
  }

  return { code: STATUS_ENUM.SUCCESS };
}

module.exports = {
  getUserInfo,
  updateBirthDate,
  updatePhotoUrl,
};
