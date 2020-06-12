const moment = require('moment');
const { signS3Request } = require('../../server/utils/aws');

const {
  addEntity: addEntityHelper,
  getAllEntities: getAllEntitiesHelper,
  getEntity: getEntityHelper,
  getAllTypeEntities: getAllTypeEntitiesHelper,
  getAllRolesEntity: getAllRolesEntityHelper,
  updateEntityName: updateEntityNameHelper,
  updateEntityPhoto: updateEntityPhotoHelper,
  getAllRolesEntity: getAllRolesEntityHelper,
  getUsersAuthorization: getUsersAuthorizationHelper,
  updateEntityRole: updateEntityRoleHelper,
  addEntityRole: addEntityRoleHelper,
  updateEntity: updateEntityHelper,
} = require('../helpers/entity');

async function getEntity(id, user_id) {
  return getEntityHelper(id, user_id);
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

async function updateEntityRole(body) {
  const { entity_id, entity_id_admin, role } = body;
  return updateEntityRoleHelper(entity_id, entity_id_admin, role);
}

async function updateEntity(body, user_id) {
  const { id, name, photo_url } = body;

  return await updateEntityHelper(id, name, photo_url, user_id);
}

async function addEntityRole(body) {
  const { entity_id, entity_id_admin, role } = body;
  await addEntityRoleHelper(entity_id, entity_id_admin, role);
}

module.exports = {
  addEntity,
  getEntity,
  getAllEntities,
  getAllTypeEntities,
  getAllRolesEntity,
  getS3Signature,
  updateEntity,
  updateEntityRole,
  addEntityRole,
};
