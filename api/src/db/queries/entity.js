const { ENTITIES_ROLE_ENUM } = require('../../../../common/enums');
const moment = require('moment');
const { signS3Request } = require('../../server/utils/aws');

const {
  addEntity: addEntityHelper,
  addEntityRole: addEntityRoleHelper,
  addMember: addMemberHelper,
  addOption: addOptionHelper,
  addRoster: addRosterHelper,
  addTeamToEvent: addTeamToEventHelper,
  addMembership: addMembershipHelper,
  getEntityRole: getEntityRoleHelper,
  deleteEntity: deleteEntityHelper,
  deleteEntityMembership: deleteEntityMembershipHelper,
  deleteOption: deleteOptionHelper,
  getAllEntities: getAllEntitiesHelper,
  getAllRolesEntity: getAllRolesEntityHelper,
  getAllTypeEntities: getAllTypeEntitiesHelper,
  getEntity: getEntityHelper,
  getMembers: getMembersHelper,
  getMemberships: getMembershipsHelper,
  getRegistered: getRegisteredHelper,
  getAllRegistered: getAllRegisteredHelper,
  getEvent: getEventHelper,
  getGeneralInfos: getGeneralInfosHelper,
  getOptions: getOptionsHelper,
  removeEntityRole: removeEntityRoleHelper,
  updateEntityName: updateEntityNameHelper,
  updateEntityPhoto: updateEntityPhotoHelper,
  updateEntityRole: updateEntityRoleHelper,
  updateEvent: updateEventHelper,
  updateGeneralInfos: updateGeneralInfosHelper,
  updateMember: updateMemberHelper,
  updateRegistration: updateRegistrationHelper,
  eventInfos: eventInfosHelper,
} = require('../helpers/entity');

async function isAllowed(entityId, userId, acceptationRole) {
  const role = await getEntityRoleHelper(entityId, userId);
  if (role <= acceptationRole) {
    return true;
  }
  return false;
  ß;
}

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

async function eventInfos(id, user_id) {
  return eventInfosHelper(id, user_id);
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

async function getGeneralInfos(entityId, userId) {
  return getGeneralInfosHelper(entityId, userId);
}

async function updateEvent(body, userId) {
  const { eventId, maximumSpots, eventStart, eventEnd } = body;
  if (isAllowed(eventId, userId, ENTITIES_ROLE_ENUM.EDITOR)) {
    return updateEventHelper(
      eventId,
      maximumSpots,
      eventStart,
      eventEnd,
      userId,
    );
  }
  throw 'Acces denied';
}

async function updateGeneralInfos(body, userId) {
  const { entityId, description } = body;
  if (isAllowed(entityId, userId, ENTITIES_ROLE_ENUM.EDITOR)) {
    return updateGeneralInfosHelper(entityId, description);
  }
  throw 'Acces denied';
}

async function addTeamToEvent(body) {
  const {
    team_id,
    event_id,
    invoice_id,
    status,
    registration_status,
  } = body;
  return addTeamToEventHelper(
    team_id,
    event_id,
    invoice_id,
    status,
    registration_status,
  );
}

async function getOptions(eventId) {
  return getOptionsHelper(eventId);
}

const addEntity = async (body, user_id) => {
  return addEntityHelper(body, user_id);
};

async function updateEntity(body, userId) {
  const { id, name, surname, photoUrl } = body;

  if (isAllowed(id, userId)) {
    if (name || surname) {
      await updateEntityNameHelper(id, name, surname);
    }
    if (photoUrl) {
      await updateEntityPhotoHelper(id, photoUrl);
    }
    return { id, name, surname, photoUrl };
  }
  throw 'Acces denied';
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

async function updateEntityRole(body, userId) {
  const { entity_id, entity_id_admin, role } = body;
  if (isAllowed(entity_id, userId, ENTITIES_ROLE_ENUM.ADMIN)) {
    if (role === ENTITIES_ROLE_ENUM.VIEWER) {
      return removeEntityRoleHelper(
        entity_id,
        entity_id_admin,
        userId,
      );
    } else {
      return updateEntityRoleHelper(
        entity_id,
        entity_id_admin,
        role,
        userId,
      );
    }
  }
  throw 'Acces denied';
}

async function updateRegistration(body, userId) {
  const { rosterId, eventId, invoiceItemId, status } = body;
  if (isAllowed(eventId, userId, ENTITIES_ROLE_ENUM.ADMIN)) {
    return updateRegistrationHelper(
      rosterId,
      eventId,
      invoiceItemId,
      status,
    );
  }
  throw 'Acces denied';
}

async function addEntityRole(body, userId) {
  const { entity_id, entity_id_admin, role } = body;
  if (isAllowed(entity_id, userId, ENTITIES_ROLE_ENUM.ADMIN)) {
    return await addEntityRoleHelper(
      entity_id,
      entity_id_admin,
      role,
    );
  }
  throw 'Acces denied';
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
  const { eventId, name, price, endTime, startTime } = body;
  if (isAllowed(eventId, userId, ENTITIES_ROLE_ENUM.EDITOR)) {
    const res = await addOptionHelper(
      eventId,
      name,
      price,
      endTime,
      startTime,
      userId,
    );
    return res;
  }
  throw 'Access denied';
}

async function addRoster(body) {
  const { rosterId, roster } = body;
  const res = await addRosterHelper(rosterId, roster);
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
  addRoster,
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
  getGeneralInfos,
  getS3Signature,
  updateEntity,
  updateEntityRole,
  updateEvent,
  updateGeneralInfos,
  updateMember,
  updateRegistration,
  eventInfos,
};
