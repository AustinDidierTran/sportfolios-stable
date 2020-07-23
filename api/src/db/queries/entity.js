const {
  ENTITIES_ROLE_ENUM,
  INVOICE_STATUS_ENUM,
  STRIPE_ERROR_ENUM,
} = require('../../../../common/enums');
const { ERROR_ENUM } = require('../../../../common/errors');
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
  getAllOwnedEntities: getAllOwnedEntitiesHelper,
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
  getRosterInvoiceItem,
  unregister: unregisterHelper,
  updateEntityName: updateEntityNameHelper,
  updateEntityPhoto: updateEntityPhotoHelper,
  updateEntityRole: updateEntityRoleHelper,
  updateEvent: updateEventHelper,
  updateGeneralInfos: updateGeneralInfosHelper,
  updateMember: updateMemberHelper,
  updateRegistration: updateRegistrationHelper,
  eventInfos: eventInfosHelper,
} = require('../helpers/entity');
const { createRefund } = require('../helpers/stripe/checkout');

async function isAllowed(entityId, userId, acceptationRole) {
  const role = await getEntityRoleHelper(entityId, userId);
  return role <= acceptationRole;
}

async function getEntity(id, user_id) {
  return getEntityHelper(id, user_id);
}

async function getAllEntities(params) {
  return getAllEntitiesHelper(params);
}
async function getAllOwnedEntities(type, userId) {
  return getAllOwnedEntitiesHelper(type, userId);
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
  if (!isAllowed(eventId, userId, ENTITIES_ROLE_ENUM.EDITOR)) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }
  return updateEventHelper(
    eventId,
    maximumSpots,
    eventStart,
    eventEnd,
    userId,
  );
}

async function updateGeneralInfos(body, userId) {
  const { entityId, description } = body;
  if (!isAllowed(entityId, userId, ENTITIES_ROLE_ENUM.EDITOR)) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }
  return updateGeneralInfosHelper(entityId, description);
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

  if (!isAllowed(id, userId)) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }
  if (name || surname) {
    await updateEntityNameHelper(id, name, surname);
  }
  if (photoUrl) {
    await updateEntityPhotoHelper(id, photoUrl);
  }
  return { id, name, surname, photoUrl };
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
  if (!isAllowed(entity_id, userId, ENTITIES_ROLE_ENUM.ADMIN)) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }
  if (role === ENTITIES_ROLE_ENUM.VIEWER) {
    return removeEntityRoleHelper(entity_id, entity_id_admin, userId);
  } else {
    return updateEntityRoleHelper(
      entity_id,
      entity_id_admin,
      role,
      userId,
    );
  }
}

async function updateRegistration(body, userId) {
  const { rosterId, eventId, invoiceItemId, status } = body;
  if (!isAllowed(eventId, userId, ENTITIES_ROLE_ENUM.ADMIN)) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }
  return updateRegistrationHelper(
    rosterId,
    eventId,
    invoiceItemId,
    status,
  );
}

async function addEntityRole(body, userId) {
  const { entity_id, entity_id_admin, role } = body;
  if (!isAllowed(entity_id, userId, ENTITIES_ROLE_ENUM.ADMIN)) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }
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
  const { eventId, name, price, endTime, startTime } = body;
  if (!isAllowed(eventId, userId, ENTITIES_ROLE_ENUM.EDITOR)) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }
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

async function addRoster(body) {
  const { rosterId, roster } = body;
  const res = await addRosterHelper(rosterId, roster);
  return res;
}

const unregister = async (body, userId) => {
  const { eventId, rosterId } = body;
  if (!isAllowed(eventId, userId, ENTITIES_ROLE_ENUM.EDITOR)) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }

  const { invoiceItemId, status } = await getRosterInvoiceItem({
    eventId,
    rosterId,
  });

  try {
    if (status === INVOICE_STATUS_ENUM.PAID) {
      await createRefund({ invoiceItemId });
    }

    await unregisterHelper({ rosterId, eventId });
  } catch (err) {
    if (err.code === STRIPE_ERROR_ENUM.CHARGE_ALREADY_REFUNDED) {
      // Error is fine, keep unregistering
      await unregisterHelper({ rosterId, eventId });
    } else {
      throw err;
    }
  }

  return getAllRegisteredHelper(eventId, userId);
};

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
  getAllOwnedEntities,
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
  unregister,
  updateEntity,
  updateEntityRole,
  updateEvent,
  updateGeneralInfos,
  updateMember,
  updateRegistration,
  eventInfos,
};
