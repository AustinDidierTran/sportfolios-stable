const {
  ENTITIES_ROLE_ENUM,
  INVOICE_STATUS_ENUM,
  STRIPE_ERROR_ENUM,
  STATUS_ENUM,
  REJECTION_ENUM,
} = require('../../../../common/enums');
const { ERROR_ENUM } = require('../../../../common/errors');
const moment = require('moment');
const { signS3Request } = require('../../server/utils/aws');

const {
  addAlias: addAliasHelper,
  addEntity: addEntityHelper,
  addEntityRole: addEntityRoleHelper,
  addField: addFieldHelper,
  addGame: addGameHelper,
  addMember: addMemberHelper,
  addMembership: addMembershipHelper,
  addOption: addOptionHelper,
  addPhase: addPhaseHelper,
  addPlayerToRoster: addPlayerToRosterHelper,
  addRegisteredToSchedule: addRegisteredToScheduleHelper,
  addRoster: addRosterHelper,
  addScoreAndSpirit: addScoreAndSpiritHelper,
  addScoreSuggestion: addScoreSuggestionHelper,
  addTeamToEvent: addTeamToEventHelper,
  addTeamToSchedule: addTeamToScheduleHelper,
  addTimeSlot: addTimeSlotHelper,
  canUnregisterTeam: canUnregisterTeamHelper,
  deleteEntity: deleteEntityHelper,
  deleteEntityMembership: deleteEntityMembershipHelper,
  deleteGame: deleteGameHelper,
  deleteOption: deleteOptionHelper,
  deletePlayerFromRoster: deletePlayerFromRosterHelper,
  eventInfos: eventInfosHelper,
  getAlias: getAliasHelper,
  getAllEntities: getAllEntitiesHelper,
  getAllForYouPagePosts: getAllForYouPagePostsHelper,
  getAllOwnedEntities: getAllOwnedEntitiesHelper,
  getAllRegisteredInfos: getAllRegisteredInfosHelper,
  getAllRolesEntity: getAllRolesEntityHelper,
  getAllTypeEntities: getAllTypeEntitiesHelper,
  getEntity: getEntityHelper,
  getEntityRole: getEntityRoleHelper,
  getEvent: getEventHelper,
  getFields: getFieldsHelper,
  getGames: getGamesHelper,
  getTeamGames: getTeamGamesHelper,
  getPhasesGameAndTeams: getPhasesGameAndTeamsHelper,
  getGeneralInfos: getGeneralInfosHelper,
  getMembers: getMembersHelper,
  getMemberships: getMembershipsHelper,
  getOptions: getOptionsHelper,
  getOwnedEvents: getOwnedEventsHelper,
  getPhases: getPhasesHelper,
  getRankings: getRankingsHelper,
  getRegistered: getRegisteredHelper,
  getRemainingSpots: getRemainingSpotsHelper,
  getAllAcceptedRegistered: getAllAcceptedRegisteredHelper,
  getRoster: getRosterHelper,
  getRosterInvoiceItem,
  getScoreSuggestion: getScoreSuggestionHelper,
  getSameSuggestions: getSameSuggestionsHelper,
  getSlots: getSlotsHelper,
  getTeamsSchedule: getTeamsScheduleHelper,
  getWichTeamsCanUnregister: getWichTeamsCanUnregisterHelper,
  removeEntityRole: removeEntityRoleHelper,
  removeEventCartItem: removeEventCartItemHelper,
  unregister: unregisterHelper,
  updateAlias: updateAliasHelper,
  updateEntityName: updateEntityNameHelper,
  updateEntityPhoto: updateEntityPhotoHelper,
  updateEntityRole: updateEntityRoleHelper,
  updateEvent: updateEventHelper,
  updateGame: updateGameHelper,
  updateSuggestionStatus: updateSuggestionStatusHelper,
  updateGeneralInfos: updateGeneralInfosHelper,
  updateMember: updateMemberHelper,
  updateRegistration: updateRegistrationHelper,
} = require('../helpers/entity');
const { createRefund } = require('../helpers/stripe/checkout');
const {
  sendTeamRegistrationEmailToAdmin,
  sendAcceptedRegistrationEmail,
} = require('../../server/utils/nodeMailer');
const { addEventCartItem } = require('../helpers/shop');
const { getEmailsFromUserId } = require('../helpers');

async function isAllowed(
  entityId,
  userId,
  acceptationRole = ENTITIES_ROLE_ENUM.ADMIN,
) {
  const role = await getEntityRoleHelper(entityId, userId);
  return role <= acceptationRole;
}

async function getEntity(id, user_id) {
  return getEntityHelper(id, user_id);
}

async function getAllEntities(params) {
  return getAllEntitiesHelper(params);
}

async function getAllForYouPagePosts() {
  return getAllForYouPagePostsHelper();
}
async function getScoreSuggestion(query) {
  const { event_id, start_time, rosterId1, rosterId2 } = query;
  return getScoreSuggestionHelper(
    event_id,
    start_time,
    rosterId1,
    rosterId2,
  );
}
async function getSameSuggestions(query) {
  const {
    eventId,
    startTime,
    yourRosterId,
    opposingRosterId,
    yourScore,
    opposingTeamScore,
  } = query;
  return getSameSuggestionsHelper(
    eventId,
    startTime,
    yourRosterId,
    opposingRosterId,
    yourScore,
    opposingTeamScore,
  );
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

async function getAllRegisteredInfos(eventId, userId) {
  return getAllRegisteredInfosHelper(eventId, userId);
}

async function getAllAcceptedRegistered(eventId) {
  return getAllAcceptedRegisteredHelper(eventId);
}

async function getRemainingSpots(eventId) {
  return getRemainingSpotsHelper(eventId);
}

async function getRankings(eventId) {
  return getRankingsHelper(eventId);
}

async function getRoster(rosterId) {
  return getRosterHelper(rosterId);
}

async function getEvent(eventId) {
  return getEventHelper(eventId);
}

async function getAlias(entityId) {
  return getAliasHelper(entityId);
}

async function getPhases(eventId) {
  return getPhasesHelper(eventId);
}

async function getGames(eventId) {
  return getGamesHelper(eventId);
}
async function getTeamGames(eventId) {
  return getTeamGamesHelper(eventId);
}
async function getPhasesGameAndTeams(eventId, phaseId) {
  return getPhasesGameAndTeamsHelper(eventId, phaseId);
}

async function getSlots(eventId) {
  return getSlotsHelper(eventId);
}

async function getTeamsSchedule(eventId) {
  return getTeamsScheduleHelper(eventId);
}
async function getFields(eventId) {
  return getFieldsHelper(eventId);
}

async function getGeneralInfos(entityId, userId) {
  return getGeneralInfosHelper(entityId, userId);
}

async function updateEvent(body, userId) {
  const { eventId, maximumSpots, eventStart, eventEnd } = body;
  if (
    !(await isAllowed(eventId, userId, ENTITIES_ROLE_ENUM.EDITOR))
  ) {
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
  if (
    !(await isAllowed(entityId, userId, ENTITIES_ROLE_ENUM.EDITOR))
  ) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }
  return updateGeneralInfosHelper(entityId, otherBody);
}

async function addTeamToEvent(body, userId) {
  const { teamId, eventId, paymentOption, roster, status } = body;
  if (!(await isAllowed(teamId, userId, ENTITIES_ROLE_ENUM.EDITOR))) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }

  // Reject team if there is already too many registered teams
  const remainingSpots = await getRemainingSpotsHelper(eventId);

  if (remainingSpots === 0) {
    const registrationStatus = STATUS_ENUM.REFUSED;
    const reason = REJECTION_ENUM.NO_REMAINING_SPOTS;
    return { status: registrationStatus, reason };
  }

  // TODO: Validate status of team
  const registrationStatus = STATUS_ENUM.ACCEPTED;

  const team = await getEntity(teamId, userId);

  const event = await getEntity(eventId, userId);

  const realEventId = await (await getEntity(eventId, userId)).id;

  const rosterId = await addTeamToEventHelper({
    teamId,
    eventId: realEventId,
    status,
    registrationStatus,
    paymentOption,
  });

  // Add roster
  if (roster) {
    await addRosterHelper(rosterId, roster);
  }
  if (paymentOption) {
    if (registrationStatus === STATUS_ENUM.ACCEPTED) {
      // Add item to cart
      await addEventCartItem(
        {
          stripePriceId: paymentOption,
          metadata: {
            sellerEntityId: realEventId,
            buyerId: teamId,
            rosterId,
            team,
          },
        },
        userId,
      );
    }

    // send mail to organization admin
    // TODO find real event user creator
    const creatorEmails = ['austindidier@sportfolios.app'];
    creatorEmails.map(async email =>
      sendTeamRegistrationEmailToAdmin({
        email,
        team,
        event,
        placesLeft: await getRemainingSpotsHelper(event.id),
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
  return { status: registrationStatus, rosterId };
}

async function getOptions(eventId) {
  return getOptionsHelper(eventId);
}

const addEntity = async (body, user_id) => {
  return addEntityHelper(body, user_id);
};

async function updateEntity(body, userId) {
  const { id, name, surname, photoUrl } = body;

  if (!(await isAllowed(id, userId), ENTITIES_ROLE_ENUM.ADMIN)) {
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
  if (
    !(await isAllowed(entity_id, userId, ENTITIES_ROLE_ENUM.ADMIN))
  ) {
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
  if (!(await isAllowed(eventId, userId, ENTITIES_ROLE_ENUM.ADMIN))) {
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
  if (
    !(await isAllowed(entity_id, userId, ENTITIES_ROLE_ENUM.ADMIN))
  ) {
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

async function updateAlias(body) {
  const { entityId, alias } = body;
  const res = await updateAliasHelper(entityId, alias);
  return res;
}
async function updateGame(body) {
  const {
    gameId,
    phaseId,
    field,
    time,
    rosterId1,
    rosterId2,
    name1,
    name2,
    teamId1,
    teamId2,
  } = body;
  const res = await updateGameHelper(
    gameId,
    phaseId,
    field,
    time,
    rosterId1,
    rosterId2,
    name1,
    name2,
    teamId1,
    teamId2,
  );
  return res;
}

async function updateSuggestionStatus(body) {
  const {
    gameId,
    eventId,
    startTime,
    yourRosterId,
    opposingRosterId,
    yourScore,
    opposingTeamScore,
    status,
  } = body;
  const res = await updateSuggestionStatusHelper(
    gameId,
    eventId,
    startTime,
    yourRosterId,
    opposingRosterId,
    yourScore,
    opposingTeamScore,
    status,
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

async function addAlias(body) {
  const { entityId, alias } = body;
  const res = await addAliasHelper(entityId, alias);
  return res;
}

async function addGame(body) {
  const {
    eventId,
    phaseId,
    field,
    time,
    rosterId1,
    rosterId2,
    name1,
    name2,
  } = body;
  const res = await addGameHelper(
    eventId,
    phaseId,
    field,
    time,
    rosterId1,
    rosterId2,
    name1,
    name2,
  );
  return res;
}

async function addScoreAndSpirit(body) {
  const res = await addScoreAndSpiritHelper(body);
  return res;
}

async function addScoreSuggestion(body, userId) {
  const {
    gameId,
    eventId,
    startTime,
    yourTeamName,
    yourTeamId,
    yourScore,
    opposingTeamName,
    opposingTeamId,
    opposingTeamScore,
    opposingTeamSpirit,
    players,
    comments,
    suggestedBy,
  } = body;

  if (
    suggestedBy &&
    !(await isAllowed(suggestedBy, userId, ENTITIES_ROLE_ENUM.EDITOR))
  ) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }

  const res = await addScoreSuggestionHelper(
    gameId,
    eventId,
    startTime,
    yourTeamName,
    yourTeamId,
    yourScore,
    opposingTeamName,
    opposingTeamId,
    opposingTeamScore,
    opposingTeamSpirit,
    players,
    comments,
    suggestedBy,
  );
  return res;
}

async function addField(body) {
  const { field, eventId } = body;
  const res = await addFieldHelper(field, eventId);
  return res;
}

async function addTeamToSchedule(body) {
  const { eventId, name, rosterId } = body;
  const res = await addTeamToScheduleHelper(eventId, name, rosterId);
  return res;
}

async function addRegisteredToSchedule(body) {
  const { eventId } = body;
  const res = await addRegisteredToScheduleHelper(eventId);
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
  if (
    !(await isAllowed(eventId, userId, ENTITIES_ROLE_ENUM.EDITOR))
  ) {
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

const canUnregisterTeamsList = async (rosterIds, eventId) => {
  return getWichTeamsCanUnregisterHelper(
    JSON.parse(rosterIds),
    eventId,
  );
};

const unregisterTeams = async (body, userId) => {
  const { eventId, rosterIds } = body;
  const result = { failed: false, data: [] };

  if (
    !(await isAllowed(eventId, userId, ENTITIES_ROLE_ENUM.EDITOR))
  ) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }

  for (const rosterId of rosterIds) {
    if (await canUnregisterTeamHelper(rosterId, eventId)) {
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
    } else {
      // team is in a game, can't unregister and refund
      result.failed = true;
    }
  }

  result.data = await getAllRegisteredInfosHelper(eventId, userId);
  return result;
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

async function deleteGame(userId, query) {
  const { eventId, gameId } = query;
  if (
    !(await isAllowed(eventId, userId, ENTITIES_ROLE_ENUM.EDITOR))
  ) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }
  return deleteGameHelper(gameId);
}

module.exports = {
  addAlias,
  addEntity,
  addEntityRole,
  addField,
  addGame,
  addMember,
  addMembership,
  addOption,
  addPhase,
  addPlayerToRoster,
  addRegisteredToSchedule,
  addRoster,
  addScoreAndSpirit,
  addScoreSuggestion,
  addTeamToEvent,
  addTeamToSchedule,
  addTimeSlot,
  canUnregisterTeamsList,
  deleteEntity,
  deleteEntityHelper,
  deleteEntityHelper,
  deleteEntityMembership,
  deleteGame,
  deleteGame,
  deleteOption,
  deletePlayerFromRoster,
  eventInfos,
  eventInfos,
  getAlias,
  getAllEntities,
  getAllForYouPagePosts,
  getAllOwnedEntities,
  getAllAcceptedRegistered,
  getAllRegisteredInfos,
  getAllRolesEntity,
  getAllTypeEntities,
  getEntity,
  getEvent,
  getFields,
  getGames,
  getTeamGames,
  getPhasesGameAndTeams,
  getGeneralInfos,
  getMembers,
  getMemberships,
  getOptions,
  getOwnedEvents,
  getPhases,
  getRankings,
  getRegistered,
  getRemainingSpots,
  getRoster,
  getS3Signature,
  getScoreSuggestion,
  getSameSuggestions,
  getSlots,
  getTeamsSchedule,
  isAllowed,
  unregisterTeams,
  updateAlias,
  updateEntity,
  updateEntityRole,
  updateEvent,
  updateGame,
  updateSuggestionStatus,
  updateGeneralInfos,
  updateMember,
  updateRegistration,
};
