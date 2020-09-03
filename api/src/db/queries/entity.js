const {
  ENTITIES_ROLE_ENUM,
  INVOICE_STATUS_ENUM,
  STRIPE_ERROR_ENUM,
  REGISTRATION_STATUS_ENUM,
  REJECTION_ENUM,
} = require('../../../../common/enums');
const { ERROR_ENUM } = require('../../../../common/errors');
const moment = require('moment');
const { signS3Request } = require('../../server/utils/aws');

const {
  addEntity: addEntityHelper,
  addEntityRole: addEntityRoleHelper,
  addMember: addMemberHelper,
  addOption: addOptionHelper,
  addGame: addGameHelper,
  addPhase: addPhaseHelper,
  addTimeSlot: addTimeSlotHelper,
  addRoster: addRosterHelper,
  addTeamToEvent: addTeamToEventHelper,
  addMembership: addMembershipHelper,
  getEntityRole: getEntityRoleHelper,
  deleteEntity: deleteEntityHelper,
  deleteEntityMembership: deleteEntityMembershipHelper,
  deleteOption: deleteOptionHelper,
  getAllEntities: getAllEntitiesHelper,
  getAllOwnedEntities: getAllOwnedEntitiesHelper,
  getOwnedEvents: getOwnedEventsHelper,
  getAllRolesEntity: getAllRolesEntityHelper,
  getAllTypeEntities: getAllTypeEntitiesHelper,
  getEntity: getEntityHelper,
  getMembers: getMembersHelper,
  getMemberships: getMembershipsHelper,
  getRegistered: getRegisteredHelper,
  getAllRegistered: getAllRegisteredHelper,
  getRemainingSpots: getRemainingSpotsHelper,
  getRoster: getRosterHelper,
  getEvent: getEventHelper,
  getPhases: getPhasesHelper,
  getGeneralInfos: getGeneralInfosHelper,
  getOptions: getOptionsHelper,
  removeEntityRole: removeEntityRoleHelper,
  getRosterInvoiceItem,
  removeEventCartItem: removeEventCartItemHelper,
  unregister: unregisterHelper,
  updateEntityName: updateEntityNameHelper,
  updateEntityPhoto: updateEntityPhotoHelper,
  updateEntityRole: updateEntityRoleHelper,
  updateEvent: updateEventHelper,
  updateGeneralInfos: updateGeneralInfosHelper,
  updateMember: updateMemberHelper,
  updateRegistration: updateRegistrationHelper,
  eventInfos: eventInfosHelper,
  addPlayerToRoster: addPlayerToRosterHelper,
  deletePlayerFromRoster: deletePlayerFromRosterHelper,
} = require('../helpers/entity');
const { createRefund } = require('../helpers/stripe/checkout');
const {
  sendTeamRegistrationEmailToAdmin,
  sendAcceptedRegistrationEmail,
} = require('../../server/utils/nodeMailer');
const { addEventCartItem } = require('../helpers/shop');
const { getEmailsFromUserId } = require('../helpers');

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

async function getOwnedEvents(organizatioId) {
  return getOwnedEventsHelper(organizatioId);
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
async function getRemainingSpots(eventId) {
  return getRemainingSpotsHelper(eventId);
}

async function getRoster(rosterId, userId) {
  return getRosterHelper(rosterId, userId);
}

async function getEvent(eventId) {
  return getEventHelper(eventId);
}

async function getPhases(eventId) {
  return getPhasesHelper(eventId);
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
  const { entityId, ...otherBody } = body;
  if (!isAllowed(entityId, userId, ENTITIES_ROLE_ENUM.EDITOR)) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }
  return updateGeneralInfosHelper(entityId, otherBody);
}

async function addTeamToEvent(body, userId) {
  const { teamId, eventId, paymentOption, roster, status } = body;
  if (!isAllowed(teamId, userId, ENTITIES_ROLE_ENUM.EDITOR)) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }

  // Reject team if there is already too many registered teams
  const remainingSpots = await getRemainingSpotsHelper(eventId);

  if (remainingSpots < 1 && remainingSpots) {
    const registrationStatus = REGISTRATION_STATUS_ENUM.REFUSED;
    const reason = REJECTION_ENUM.NO_REMAINING_SPOTS;
    return { status: registrationStatus, reason };
  }

  // TODO: Validate status of team
  const registrationStatus = REGISTRATION_STATUS_ENUM.ACCEPTED;

  const team = await getEntity(teamId, userId);

  const event = await getEntity(eventId, userId);

  const rosterId = await addTeamToEventHelper({
    teamId,
    eventId,
    status,
    registrationStatus,
    paymentOption,
  });

  // Add roster
  await addRosterHelper(rosterId, roster);

  if (registrationStatus === REGISTRATION_STATUS_ENUM.ACCEPTED) {
    // Add item to cart
    await addEventCartItem(
      {
        stripePriceId: paymentOption,
        metadata: {
          sellerEntityId: eventId,
          buyerId: teamId,
          rosterId,
          team,
        },
      },
      userId,
    );

    // send mail to organization admin
    // TODO find real event user creator
    const creatorEmails = ['austindidier@sportfolios.app'];
    creatorEmails.map(async email =>
      sendTeamRegistrationEmailToAdmin({
        email,
        team,
        event,
      }),
    );

    // Send accepted email to team captain
    const captainEmails = await getEmailsFromUserId(userId);

    captainEmails.map(({ email }) =>
      sendAcceptedRegistrationEmail({
        team,
        event,
        email,
      }),
    );
  }
  // Handle other acceptation statuses

  return { status: registrationStatus };
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
  return addEntityRoleHelper(entity_id, entity_id_admin, role);
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
async function addGame(body) {
  const { phaseId, field, time, team1, team2 } = body;
  const res = await addGameHelper(phaseId, field, time, team1, team2);
  return res;
}

async function addPhase(body) {
  const { phase, eventId } = body;
  const res = await addPhaseHelper(phase, eventId);
  return res;
}

async function addTimeSlot(body) {
  const { date, eventId } = body;
  const res = await addTimeSlotHelper(date, eventId);
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
      // Registration paid, refund please
      await createRefund({ invoiceItemId });
    } else {
      // Registration is not paid, remove from cart
      await removeEventCartItemHelper({ rosterId });
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

async function addPlayerToRoster(body, userId) {
  return addPlayerToRosterHelper(body, userId);
}

async function deletePlayerFromRoster(id, userId) {
  return deletePlayerFromRosterHelper(id, userId);
}

module.exports = {
  addEntity,
  addEntityRole,
  addMember,
  addMembership,
  addGame,
  addPhase,
  addTimeSlot,
  addOption,
  addTeamToEvent,
  addRoster,
  deleteEntity,
  deleteEntityMembership,
  deleteOption,
  getAllEntities,
  getAllOwnedEntities,
  getOwnedEvents,
  getAllRolesEntity,
  getAllTypeEntities,
  getEntity,
  getEntity,
  getMembers,
  getOptions,
  getMemberships,
  getRegistered,
  getAllRegistered,
  getRemainingSpots,
  getEvent,
  getPhases,
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
  getRoster,
  addPlayerToRoster,
  deletePlayerFromRoster,
  deleteEntityHelper,
};
