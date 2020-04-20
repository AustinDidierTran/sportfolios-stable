const knex = require('../connection');
const moment = require('moment');
const { signS3Request } = require('../../server/utils/aws');

async function getS3Signature(userId, { fileType }) {
  const date = moment().format('YYYYMMDD');
  const randomString = Math.random()
    .toString(36)
    .substring(2, 7);

  const fileName = `images/profile/${date}-${randomString}-${userId}`;
  const data = await signS3Request(fileName, fileType);

  return { code: 200, data };
}

async function getUserInfo(sender, user_id) {
  const [followers] =
    (sender !== user_id &&
      (await knex('followers')
        .select('*')
        .where({ sender }))) ||
    [];

  const [userInfo] = await knex('user_info')
    .select('*')
    .where({ user_id });

  if (!userInfo) {
    return null;
  }

  return { ...userInfo, isFollowing: Boolean(followers) };
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
  getS3Signature,
  getUserInfo,
  updateBirthDate,
  updatePhotoUrl,
};
