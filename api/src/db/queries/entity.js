const { ENTITIES_ROLE_ENUM } = require('../../../../common/enums');
const moment = require('moment');
const { signS3Request } = require('../../server/utils/aws');

const {
  addEntity: addEntityHelper,
  addEntityRole: addEntityRoleHelper,
  addMember: addMemberHelper,
  addOption: addOptionHelper,
  addMembership: addMembershipHelper,
  deleteEntity: deleteEntityHelper,
  deleteEntityMembership: deleteEntityMembershipHelper,
  deleteOption: deleteOptionHelper,
  getAllEntities: getAllEntitiesHelper,
  getAllRolesEntity: getAllRolesEntityHelper,
  getAllTypeEntities: getAllTypeEntitiesHelper,
  getEntity: getEntityHelper,
  getEntityRole,
  getMembers: getMembersHelper,
  getMemberships: getMembershipsHelper,
  getOptions: getOptionsHelper,
  removeEntityRole: removeEntityRoleHelper,
  updateEntityName: updateEntityNameHelper,
  updateEntityPhoto: updateEntityPhotoHelper,
  updateEntityRole: updateEntityRoleHelper,
  updateMember: updateMemberHelper,
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

async function getMembers(persons, organization_id) {
  return getMembersHelper(persons, organization_id);
}

async function getMemberships(entity_id) {
  return getMembershipsHelper(entity_id);
}

async function getOptions(event_id) {
  return getOptionsHelper(event_id);
}

const addEntity = async (body, user_id) => {
  return addEntityHelper(body, user_id);
};

async function updateEntity(body, user_id) {
  const { id, name, surname, photoUrl } = body;

  const role = await getEntityRole(id, user_id);

  if (role <= ENTITIES_ROLE_ENUM.EDITOR) {
    if (name || surname) {
      await updateEntityNameHelper(id, name, surname);
    }
    if (photoUrl) {
      await updateEntityPhotoHelper(id, photoUrl);
    }
    return { id, name, surname, photoUrl };
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
  if (role === ENTITIES_ROLE_ENUM.VIEWER) {
    return removeEntityRoleHelper(entity_id, entity_id_admin);
  } else {
    return updateEntityRoleHelper(entity_id, entity_id_admin, role);
  }
}

async function addEntityRole(body) {
  const { entity_id, entity_id_admin, role } = body;
  return await addEntityRoleHelper(entity_id, entity_id_admin, role);
}

async function updateMember(body) {
  const {
    member_type,
    organization_id,
    person_id,
    expiration_date,
  } = body;
  const res = await updateMemberHelper(
    member_type,
    organization_id,
    person_id,
    expiration_date,
  );
  return res;
}

async function addMember(body) {
  const {
    member_type,
    organization_id,
    person_id,
    expiration_date,
  } = body;
  const res = await addMemberHelper(
    member_type,
    organization_id,
    person_id,
    expiration_date,
  );
  return res;
}
async function addOption(body, user_id) {
  const { event_id, name, price, end_time, start_time } = body;
  const res = await addOptionHelper(
    event_id,
    name,
    price,
    end_time,
    start_time,
    user_id,
  );
  return res;
}

async function addMembership(body, user_id) {
  const {
    entity_id,
    membership_type,
    length,
    fixed_date,
    price,
  } = body;
  const res = await addMembershipHelper(
    entity_id,
    membership_type,
    length,
    fixed_date,
    price,
    user_id,
  );
  return res;
}

async function deleteEntity(id, user_id) {
  return deleteEntityHelper(id, user_id);
}

async function deleteEntityMembership(query) {
  const { entity_id, membership_type, length, fixed_date } = query;

  return deleteEntityMembershipHelper(
    entity_id,
    membership_type,
    length,
    fixed_date,
  );
}

async function deleteOption(id) {
  return deleteOptionHelper(id);
}

module.exports = {
  addEntity,
  addEntityRole,
  addMember,
  addMembership,
  addOption,
  deleteEntity,
  deleteEntityMembership,
  deleteOption,
  getAllEntities,
  getAllRolesEntity,
  getAllTypeEntities,
  getEntity,
  getEntity,
  getMembers,
  getOptions,
  getMemberships,
  getS3Signature,
  updateEntity,
  updateEntityRole,
  updateMember,
};
