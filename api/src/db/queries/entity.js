const knex = require('../connection');
const moment = require('moment');
const { signS3Request } = require('../../server/utils/aws');

const {
  getAllEntities: getAllEntitiesHelper,
  getEntity: getEntityHelper,
  getAllTypeEntities: getAllTypeEntitiesHelper,
  updateEntityName: updateEntityNameHelper,
  updateEntityPhoto: updateEntityPhotoHelper,
} = require('../helpers/entity');

async function getEntity(id) {
  return getEntityHelper(id);
}

async function getAllEntities(id) {
  return getAllEntitiesHelper(id);
}

async function getAllTypeEntities(id) {
  return getAllTypeEntitiesHelper(id);
}

async function updateEntity(body) {
  const { id, name, photo_url } = body;

  if (name) {
    await updateEntityNameHelper(id, name);
  }
  if (photo_url) {
    console.log('ALLLO');
    await updateEntityPhotoHelper(id, photo_url);
  }
  return { id, name, photo_url };
}

async function getS3Signature(userId, { fileType }) {
  const date = moment().format('YYYYMMDD');
  const randomString = Math.random()
    .toString(36)
    .substring(2, 7);

  const fileName = `images/entity/${date}-${randomString}-${userId}`;
  const data = await signS3Request(fileName, fileType);

  return { code: 200, data };
}
module.exports = {
  getAllEntities,
  getAllTypeEntities,
  getEntity,
  getS3Signature,
  updateEntity,
};
