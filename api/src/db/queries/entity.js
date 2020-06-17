const moment = require('moment');
const { signS3Request } = require('../../server/utils/aws');

const {
  addEntity: addEntityHelper,
  addEntityRole: addEntityRoleHelper,
  addMember: addMemberHelper,
  getAllEntities: getAllEntitiesHelper,
  getAllRolesEntity: getAllRolesEntityHelper,
  getAllTypeEntities: getAllTypeEntitiesHelper,
  getEntity: getEntityHelper,
  getUsersAuthorization: getUsersAuthorizationHelper,
  updateEntityName: updateEntityNameHelper,
  updateEntityPhoto: updateEntityPhotoHelper,
  updateEntityRole: updateEntityRoleHelper,
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

  const res = await getUsersAuthorizationHelper(id);

  const isAuthorized =
    res.findIndex(r => r.user_id === user_id) !== -1;

  if (isAuthorized) {
    if (name || surname) {
      await updateEntityNameHelper(id, name, surname);
    }
    if (photo_url) {
      await updateEntityPhotoHelper(id, photo_url);
    }
    return { id, name, surname, photo_url };
  } else {
    throw 'Acces denied';
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

async function addEntityRole(body) {
  const { entity_id, entity_id_admin, role } = body;
  await addEntityRoleHelper(entity_id, entity_id_admin, role);
}

async function addMember(body) {
  const { member_type, organization_id, person_id } = body;
  const res = await addMemberHelper(
    member_type,
    organization_id,
    person_id,
  );
  console.log({ res });
  return res;
}

module.exports = {
  addEntity,
  addMember,
  getEntity,
  addEntityRole,
  getAllEntities,
  getAllRolesEntity,
  getAllTypeEntities,
  getEntity,
  getS3Signature,
  updateEntity,
  updateEntityRole,
};
