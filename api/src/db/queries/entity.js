const { ENTITIES_ROLE_ENUM } = require('../../../../common/enums');
const moment = require('moment');
const { signS3Request } = require('../../server/utils/aws');

const {
  addEntity: addEntityHelper,
  addEntityRole: addEntityRoleHelper,
  addMember: addMemberHelper,
  addOption: addOptionHelper,
  addTeamToEvent: addTeamToEventHelper,
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
  getRegistered: getRegisteredHelper,
  getAllRegistered: getAllRegisteredHelper,
  getEvent: getEventHelper,
  getOptions: getOptionsHelper,
  removeEntityRole: removeEntityRoleHelper,
  updateEntityName: updateEntityNameHelper,
  updateEntityPhoto: updateEntityPhotoHelper,
  updateEntityRole: updateEntityRoleHelper,
  updateEvent: updateEventHelper,
  updateMember: updateMemberHelper,
  updateRegistration: updateRegistrationHelper,
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

async function getRegistered(team_id, event_id) {
  return getRegisteredHelper(team_id, event_id);
}

async function getAllRegistered(eventId, userId) {
  return getAllRegisteredHelper(eventId, userId);
}

async function getEvent(eventId) {
  return getEventHelper(eventId);
}

async function updateEvent(body) {
  const { eventId, maximumSpots, eventStart, eventEnd } = body;
  return updateEventHelper(
    eventId,
    maximumSpots,
    eventStart,
    eventEnd,
  );
}

async function addTeamToEvent(body) {
  const { team_id, event_id, invoice_id, status } = body;
  return addTeamToEventHelper(team_id, event_id, invoice_id, status);
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

async function updateRegistration(body) {
  const { roster_id, event_id, invoice_id, status } = body;

  return updateRegistrationHelper(
    roster_id,
    event_id,
    invoice_id,
    status,
  );
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

async function addOption(body, userId) {
  const { event_id, name, price, end_time, start_time } = body;
  const res = await addOptionHelper(
    event_id,
    name,
    price,
    end_time,
    start_time,
    userId,
  );
  return res;
}

async function addMembership(body, userId) {
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
    userId,
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
  addTeamToEvent,
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
  getRegistered,
  getAllRegistered,
  getEvent,
  getS3Signature,
  updateEntity,
  updateEntityRole,
  updateEvent,
  updateMember,
  updateRegistration,
};
