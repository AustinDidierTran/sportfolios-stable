const knex = require('../connection');
const moment = require('moment');
const { signS3Request } = require('../../server/utils/aws');

function getS3Signature(userId) {
  const date = moment().format('YYYYMMDD');
  const randomString = Math.random()
    .toString(36)
    .substring(2, 7);

  const fileName = `/images/profile/${date}-${randomString}-${userId}`;
  const presignedS3URL = signS3Request(fileName);

  return { code: 200, fileName, presignedS3URL };
}

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
  getS3Signature,
  getUserInfo,
  updateBirthDate,
  updatePhotoUrl,
};
