const moment = require('moment');
const { signS3Request } = require('../../server/utils/aws');

const {
  addEntity: addEntityHelper,
  getAllEntities: getAllEntitiesHelper,
  getEntity: getEntityHelper,
  getAllTypeEntities: getAllTypeEntitiesHelper,
  updateEntityName: updateEntityNameHelper,
  updateEntityPhoto: updateEntityPhotoHelper,
  getAllRolesEntity: getAllRolesEntityHelper,
  getUsersAuthorization: getUsersAuthorizationHelper,
} = require('../helpers/entity');

async function getEntity(id) {
  return getEntityHelper(id);
}

async function getAllEntities(params) {
  return getAllEntitiesHelper(params);
}

async function getAllTypeEntities(type) {
  return getAllTypeEntitiesHelper(type);
}

async function getAllRolesEntity(id) {
  return getAllRolesEntityHelper(id);
}

const addEntity = async (body, user_id) => {
  return addEntityHelper(body, user_id);
};

async function updateEntity(body, user_id) {
  const { id, name, surname, photo_url } = body;

  const userId = await getUsersAuthorizationHelper(id);

  const isAuthorized = userId.includes(user_id);

  if (isAuthorized) {
    if (name || surname) {
      await updateEntityNameHelper(id, name, surname);
    }
    if (photo_url) {
      await updateEntityPhotoHelper(id, photo_url);
    }
    return { id, name, surname, photo_url };
  }
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
  addEntity,
  getAllEntities,
  getAllTypeEntities,
  getEntity,
  getS3Signature,
  updateEntity,
  getAllRolesEntity,
};
