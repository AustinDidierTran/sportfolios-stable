const {
  ENTITIES_ROLE_ENUM,
  INVOICE_STATUS_ENUM,
  STATUS_ENUM,
  REJECTION_ENUM,
  NOTIFICATION_TYPE,
  GLOBAL_ENUM,
} = require('../../../../common/enums');
const { ERROR_ENUM } = require('../../../../common/errors');
const moment = require('moment');
const { signS3Request } = require('../../server/utils/aws');

const {
  addAlias: addAliasHelper,
  addEventCartItem,
  addEntity: addEntityHelper,
  addEntityRole: addEntityRoleHelper,
  addField: addFieldHelper,
  addGame: addGameHelper,
  addGameAttendances: addGameAttendancesHelper,
  addMember: addMemberHelper,
  addReport: addReportHelper,
  addMemberManually: addMemberManuallyHelper,
  addMembership: addMembershipHelper,
  addOption: addOptionHelper,
  addPhase: addPhaseHelper,
  addPlayerToRoster: addPlayerToRosterHelper,
  addRegisteredToSchedule: addRegisteredToScheduleHelper,
  addRoster: addRosterHelper,
  addNewPersonToRoster: addNewPersonToRosterHelper,
  addSpiritSubmission: addSpiritSubmissionHelper,
  addScoreAndSpirit: addScoreAndSpiritHelper,
  addScoreSuggestion: addScoreSuggestionHelper,
  acceptScoreSuggestion: acceptScoreSuggestionHelper,
  addTeamToEvent: addTeamToEventHelper,
  addTeamToSchedule: addTeamToScheduleHelper,
  addTimeSlot: addTimeSlotHelper,
  canRemovePlayerFromRoster: canRemovePlayerFromRosterHelper,
  canUnregisterTeam: canUnregisterTeamHelper,
  deleteEntity: deleteEntityHelper,
  deleteEntityMembership: deleteEntityMembershipHelper,
  deleteMembership: deleteMembershipHelper,
  deleteReport: deleteReportHelper,
  deleteGame: deleteGameHelper,
  deleteOption: deleteOptionHelper,
  deletePlayerFromRoster: deletePlayerFromRosterHelper,
  eventInfos: eventInfosHelper,
  getAlias: getAliasHelper,
  getAllAcceptedRegistered: getAllAcceptedRegisteredHelper,
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
  getGameSubmissionInfos: getGameSubmissionInfosHelper,
  getUnplacedGames: getUnplacedGamesHelper,
  getGeneralInfos: getGeneralInfosHelper,
  getMembers: getMembersHelper,
  getReports: getReportsHelper,
  getOwnerStripePrice,
  generateReport: generateReportHelper,
  hasMemberships: hasMembershipsHelper,
  getOrganizationMembers: getOrganizationMembersHelper,
  getMemberships: getMembershipsHelper,
  getMyPersonsAdminsOfTeam: getMyPersonsAdminsOfTeamHelper,
  getOptions: getOptionsHelper,
  getOwnedEvents: getOwnedEventsHelper,
  getPersonGames: getPersonGamesHelper,
  getPersonInfos: getPersonInfosHelper,
  getPhases: getPhasesHelper,
  getPhasesGameAndTeams: getPhasesGameAndTeamsHelper,
  getPrimaryPerson: getPrimaryPersonHelper,
  getRankings: getRankingsHelper,
  getRegistered: getRegisteredHelper,
  getRegistrationTeamPaymentOption: getRegistrationTeamPaymentOptionHelper,
  getRemainingSpots: getRemainingSpotsHelper,
  getRoster: getRosterHelper,
  getPlayerInvoiceItem: getPlayerInvoiceItemHelper,
  getRosterInvoiceItem,
  getSameSuggestions: getSameSuggestionsHelper,
  getScoreSuggestion: getScoreSuggestionHelper,
  getSlots: getSlotsHelper,
  getTeamGames: getTeamGamesHelper,
  getTeamsSchedule: getTeamsScheduleHelper,
  getWichTeamsCanUnregister: getWichTeamsCanUnregisterHelper,
  removeEntityRole: removeEntityRoleHelper,
  removeEventCartItem: removeEventCartItemHelper,
  removeIndividualPaymentCartItem: removeIndividualPaymentCartItemHelper,
  unregister: unregisterHelper,
  updateAlias: updateAliasHelper,
  updateEntityName: updateEntityNameHelper,
  updateEntityPhoto: updateEntityPhotoHelper,
  updateEntityRole: updateEntityRoleHelper,
  updateEvent: updateEventHelper,
  updateGame: updateGameHelper,
  updateGamesInteractiveTool: updateGamesInteractiveToolHelper,
  updateGeneralInfos: updateGeneralInfosHelper,
  updatePersonInfosHelper,
  updateMember: updateMemberHelper,
  updateOption: updateOptionHelper,
  updatePlayerPaymentStatus: updatePlayerPaymentStatusHelper,
  updatePreRanking: updatePreRankingHelper,
  updateRegistration: updateRegistrationHelper,
  updateRosterRole: updateRosterRoleHelper,
  updateSuggestionStatus: updateSuggestionStatusHelper,
  getMembership,
  getEntityOwners,
  getRealId,
  getGamePlayersWithRole,
  getRostersNames: getRostersNamesHelper,
} = require('../helpers/entity');
const { createRefund } = require('../helpers/stripe/checkout');
const {
  sendTeamRegistrationEmailToAdmin,
  sendAcceptedRegistrationEmail,
  sendImportMemberEmail,
} = require('../../server/utils/nodeMailer');
const { addMembershipCartItem } = require('../helpers/shop');
const {
  getEmailsFromUserId,
  getLanguageFromEmail,
  validateEmailIsUnique: validateEmailIsUniqueHelper,
  generateMemberImportToken,
} = require('../helpers');
const { sendNotification } = require('./notifications');

async function isAllowed(
  entityId,
  userId,
  acceptationRole = ENTITIES_ROLE_ENUM.ADMIN,
) {
  const role = await getEntityRoleHelper(entityId, userId);
  return role <= acceptationRole;
}

async function getEntity(id, user_id) {
  const res = await getEntityHelper(id, user_id);

  if (res.basicInfos.type === GLOBAL_ENUM.PERSON) {
    res.gamesInfos = await getPersonGamesHelper(id);
  }

  return res;
}

async function getAllEntities(params) {
  return getAllEntitiesHelper(params);
}

async function getAllForYouPagePosts() {
  return getAllForYouPagePostsHelper();
}
async function getScoreSuggestion(query) {
  const { event_id, gameId } = query;
  return getScoreSuggestionHelper(event_id, gameId);
}
async function getSameSuggestions(query) {
  const {
    eventId,
    gameId,
    yourRosterId,
    opposingRosterId,
    yourScore,
    opposingTeamScore,
  } = query;
  return getSameSuggestionsHelper(
    eventId,
    gameId,
    yourRosterId,
    opposingRosterId,
    yourScore,
    opposingTeamScore,
  );
}
async function getAllOwnedEntities(type, userId) {
  return getAllOwnedEntitiesHelper(type, userId);
}

async function getOwnedEvents(organizationId) {
  return getOwnedEventsHelper(organizationId);
}

async function getAllTypeEntities(type) {
  return getAllTypeEntitiesHelper(type);
}

async function getAllRolesEntity(id) {
  return getAllRolesEntityHelper(id);
}

async function getMembers(persons, organizationId) {
  return getMembersHelper(persons, organizationId);
}
async function getReports(entityId) {
  return getReportsHelper(entityId);
}
async function generateReport(reportId) {
  return generateReportHelper(reportId);
}
async function hasMemberships(organizationId) {
  return hasMembershipsHelper(organizationId);
}
async function getOrganizationMembers(organizationId, userId) {
  if (
    !(await isAllowed(
      organizationId,
      userId,
      ENTITIES_ROLE_ENUM.EDITOR,
    ))
  ) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }
  return getOrganizationMembersHelper(organizationId);
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
async function getPrimaryPerson(userId) {
  return getPrimaryPersonHelper(userId);
}

async function getRoster(rosterId, withSub) {
  return getRosterHelper(rosterId, withSub);
}

async function getEvent(eventId) {
  return getEventHelper(eventId);
}

async function getAlias(entityId) {
  return getAliasHelper(entityId);
}

async function validateEmailIsUnique(email) {
  return validateEmailIsUniqueHelper(email);
}

async function getPhases(eventId) {
  return getPhasesHelper(eventId);
}

async function getGames(eventId) {
  return getGamesHelper(eventId);
}

async function getGameSubmissionInfos(gameId, rosterId) {
  return getGameSubmissionInfosHelper(gameId, rosterId);
}

async function getUnplacedGames(eventId) {
  return getUnplacedGamesHelper(eventId);
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

async function getPersonInfos(entityId) {
  return getPersonInfosHelper(entityId);
}

async function getRegistrationTeamPaymentOption(paymentOptionId) {
  return getRegistrationTeamPaymentOptionHelper(paymentOptionId);
}

async function getPossibleSubmissionerInfos(gameId, teams, userId) {
  const teamsList = JSON.parse(teams);
  const adminsOfTeams = await Promise.all(
    teamsList.map(
      async t =>
        await getMyPersonsAdminsOfTeamHelper(
          t.rosterId,
          teamsList,
          userId,
        ),
    ),
  );

  const validTeams = adminsOfTeams.filter(res => res !== undefined);
  if (validTeams.length === 0) {
    return ERROR_ENUM.ACCESS_DENIED;
  }

  return validTeams;
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
async function updatePreRanking(body, userId) {
  const { eventId, ranking } = body;
  if (
    !(await isAllowed(eventId, userId, ENTITIES_ROLE_ENUM.EDITOR))
  ) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }
  return updatePreRankingHelper(eventId, ranking);
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

async function updatePersonInfos(body, userId) {
  const { entityId, ...otherBody } = body;
  if (
    !(await isAllowed(entityId, userId, ENTITIES_ROLE_ENUM.EDITOR))
  ) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }
  return updatePersonInfosHelper(entityId, otherBody);
}

async function addTeamToEvent(body, userId) {
  const { teamId, eventId, paymentOption, roster, status } = body;
  if (!(await isAllowed(teamId, userId, ENTITIES_ROLE_ENUM.EDITOR))) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }

  if (!paymentOption) {
    throw new Error(ERROR_ENUM.VALUE_IS_REQUIRED);
  }

  // Reject team if there is already too many registered teams
  if ((await getRemainingSpotsHelper(eventId)) === 0) {
    const registrationStatus = STATUS_ENUM.REFUSED;
    const reason = REJECTION_ENUM.NO_REMAINING_SPOTS;
    return { status: registrationStatus, reason };
  }

  const team = (await getEntity(teamId, userId)).basicInfos;
  const event = (await getEntity(eventId, userId)).basicInfos;

  const teamPaymentOption = await getRegistrationTeamPaymentOption(
    paymentOption,
  );
  const isFreeOption = teamPaymentOption.team_price === 0;
  // TODO: Validate status of team
  const registrationStatus = isFreeOption
    ? STATUS_ENUM.ACCEPTED_FREE
    : STATUS_ENUM.ACCEPTED;

  const rosterId = await addTeamToEventHelper({
    teamId,
    eventId: event.id,
    status: isFreeOption ? INVOICE_STATUS_ENUM.FREE : status,
    registrationStatus,
    paymentOption,
  });

  // Add roster
  if (roster) {
    await addRosterHelper(rosterId, roster, userId);
  }
  if (registrationStatus === STATUS_ENUM.ACCEPTED) {
    // wont be added to cart if free
    const ownerId = await getOwnerStripePrice(
      teamPaymentOption.team_stripe_price_id,
    );
    await addEventCartItem(
      {
        stripePriceId: teamPaymentOption.team_stripe_price_id,
        metadata: {
          sellerEntityId: ownerId,
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
  creatorEmails.map(async email => {
    const language = await getLanguageFromEmail(email);
    sendTeamRegistrationEmailToAdmin({
      email,
      team,
      event,
      language,
      placesLeft: await getRemainingSpotsHelper(event.id),
    });
  });

  // Send accepted email to team captain
  const captainEmails = await getEmailsFromUserId(userId);

  captainEmails.map(async ({ email }) => {
    const language = await getLanguageFromEmail(email);
    sendAcceptedRegistrationEmail({
      language,
      team,
      event,
      email,
      isFreeOption,
    });
  });

  // Handle other acceptation statuses
  return { status: registrationStatus, rosterId };
}

async function getInteractiveToolData(eventId, userId) {
  if (!(await isAllowed(eventId, userId), ENTITIES_ROLE_ENUM.ADMIN)) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }

  return {
    phases: await getPhases(eventId),
    teams: await getTeamsSchedule(eventId),
    timeSlots: await getSlots(eventId),
    fields: await getFields(eventId),
    games: await getGames(eventId),
    unplacedGames: await getUnplacedGames(eventId),
  };
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

async function updateRosterRole(body, userId) {
  const { eventId, teamId, playerId, role } = body;

  if (
    !(await isAllowed(eventId, userId, ENTITIES_ROLE_ENUM.ADMIN)) &&
    !(await isAllowed(teamId, userId, ENTITIES_ROLE_ENUM.ADMIN))
  ) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }

  return updateRosterRoleHelper(playerId, role);
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

async function updateOption(body) {
  return updateOptionHelper(body);
}

async function updateGame(body) {
  const {
    gameId,
    phaseId,
    fieldId,
    timeslotId,
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
    fieldId,
    timeslotId,
    rosterId1,
    rosterId2,
    name1,
    name2,
    teamId1,
    teamId2,
  );
  return res;
}

async function updateGamesInteractiveTool(body, userId) {
  const { eventId, games } = body;
  if (
    !(await isAllowed(eventId, userId, ENTITIES_ROLE_ENUM.EDITOR))
  ) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }

  return updateGamesInteractiveToolHelper(games);
}

async function updateSuggestionStatus(body) {
  const {
    gameId,
    eventId,
    yourRosterId,
    opposingRosterId,
    yourScore,
    opposingTeamScore,
    status,
  } = body;
  const res = await updateSuggestionStatusHelper(
    gameId,
    eventId,
    yourRosterId,
    opposingRosterId,
    yourScore,
    opposingTeamScore,
    status,
  );
  return res;
}

async function addMemberManually(body) {
  const {
    membershipType,
    organizationId,
    personId,
    expirationDate,
  } = body;

  const res = await addMemberManuallyHelper(
    membershipType,
    organizationId,
    personId,
    expirationDate,
  );
  return res;
}

async function addReport(body) {
  const { type, organizationId, date } = body;
  return addReportHelper(type, organizationId, date);
}

async function importMembers(body) {
  const { membershipType, organizationId, language, members } = body;
  const res = await Promise.all(
    members.map(async m => {
      const token = await generateMemberImportToken(
        organizationId,
        m.expirationDate,
        membershipType,
      );
      const organization = await getEntityHelper(organizationId);
      sendImportMemberEmail({
        email: m.email,
        token,
        language,
        organizationName: organization.basicInfos.name,
      });
      return m;
    }),
  );
  return res;
}

async function addMember(body, userId) {
  const {
    membershipId,
    membershipType,
    organizationId,
    personId,
    expirationDate,
  } = body;

  const membership = await getMembership(membershipId);
  if (membership.price === 0) {
    const res = await addMemberManuallyHelper(
      membershipType,
      organizationId,
      personId,
      expirationDate,
    );
    return res;
  }
  const res = await addMemberHelper(
    membershipType,
    organizationId,
    personId,
    expirationDate,
  );

  const person = (await getEntity(personId)).basicInfos;

  const organization = (await getEntity(organizationId)).basicInfos;

  await addMembershipCartItem(
    {
      ...membership,
      person,
      organization,
      sellerEntityId: organizationId,
    },
    userId,
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
    fieldId,
    timeslotId,
    rosterId1,
    rosterId2,
    name1,
    name2,
  } = body;
  const res = await addGameHelper(
    eventId,
    phaseId,
    fieldId,
    timeslotId,
    rosterId1,
    rosterId2,
    name1,
    name2,
  );
  return res;
}

async function addGameAttendances(body, userId) {
  const { editedBy } = body;
  if (
    editedBy &&
    !(await isAllowed(editedBy, userId, ENTITIES_ROLE_ENUM.EDITOR))
  ) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }
  return addGameAttendancesHelper(body);
}

async function addSpiritSubmission(body, userId) {
  const { submitted_by_person } = body;
  if (
    submitted_by_person &&
    !(await isAllowed(
      submitted_by_person,
      userId,
      ENTITIES_ROLE_ENUM.EDITOR,
    ))
  ) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }

  return addSpiritSubmissionHelper(body);
}

async function addScoreAndSpirit(body) {
  const res = await addScoreAndSpiritHelper(body);
  return res;
}

async function getRostersNames(rosterArray) {
  return getRostersNamesHelper(rosterArray);
}

async function acceptScoreSuggestion(body, userId) {
  const { submitted_by_person } = body;
  if (
    submitted_by_person &&
    !(await isAllowed(
      submitted_by_person,
      userId,
      ENTITIES_ROLE_ENUM.EDITOR,
    ))
  ) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }
  return acceptScoreSuggestionHelper(body);
}

async function addScoreSuggestion(body, userId) {
  const { submitted_by_person, submitted_by_roster } = body;

  if (
    submitted_by_person &&
    !(await isAllowed(
      submitted_by_person,
      userId,
      ENTITIES_ROLE_ENUM.EDITOR,
    ))
  ) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }

  const res = await addScoreSuggestionHelper(body);
  //Send notification to other rosters member to accept/decline the score
  if (res) {
    const gamePlayers = await getGamePlayersWithRole(body.game_id);
    if (gamePlayers && gamePlayers.length) {
      const event_id = gamePlayers[0].event_id;
      const event_name = gamePlayers[0].event_name;
      //Get each opponent teams user only once
      const opponentsPlayers = gamePlayers.filter(
        (value, index, array) =>
          value.roster_id != submitted_by_roster &&
          array.findIndex(
            value2 =>
              value2.roster_id != submitted_by_roster &&
              value.player_owner_id === value2.player_owner_id,
          ) === index,
      );
      const metadata = {
        score: body.score,
        gameId: body.game_id,
        eventId: event_id,
        eventName: event_name,
        submittedBy: submitted_by_roster,
        suggestionId: res[0].id,
      };
      const notif = {
        type: NOTIFICATION_TYPE.OTHER_TEAM_SUBMITTED_A_SCORE,
        entity_photo: event_id,
      };
      opponentsPlayers.forEach(p => {
        const fullMetadata = {
          ...metadata,
          myRosterId: p.roster_id,
          myPlayerId: p.player_id,
        };
        //TODO Add email infos
        sendNotification({
          ...notif,
          user_id: p.player_owner,
          metadata: fullMetadata,
        });
      });
    }
  }
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
  const {
    eventId,
    name,
    ownerId,
    taxRatesId,
    teamPrice,
    playerPrice,
    endTime,
    startTime,
  } = body;
  if (
    !(await isAllowed(eventId, userId, ENTITIES_ROLE_ENUM.EDITOR))
  ) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }
  const res = await addOptionHelper(
    eventId,
    name,
    ownerId,
    taxRatesId,
    teamPrice,
    playerPrice,
    endTime,
    startTime,
    userId,
  );
  return res;
}

async function addNewPersonToRoster(body, userId) {
  return addNewPersonToRosterHelper(body, userId);
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

  try {
    for (const rosterId of rosterIds) {
      if (await canUnregisterTeamHelper(rosterId, eventId)) {
        const { invoiceItemId, status } = await getRosterInvoiceItem({
          eventId,
          rosterId,
        });

        if (status === INVOICE_STATUS_ENUM.PAID) {
          // Registration paid, refund please
          await createRefund({ invoiceItemId });
          await updateRegistrationHelper(
            rosterId,
            eventId,
            invoiceItemId,
            INVOICE_STATUS_ENUM.REFUNDED,
          );
        } else if (status === INVOICE_STATUS_ENUM.OPEN) {
          // Registration is not paid, remove from cart
          await removeEventCartItemHelper({ rosterId });
        }

        const roster = await getRoster(rosterId, false);
        for (const player of roster) {
          if (player.paymentStatus === INVOICE_STATUS_ENUM.PAID) {
            // Individual payment paid, refund please
            await createRefund({
              invoiceItemId: player.invoiceItemId,
            });
            await updatePlayerPaymentStatusHelper({
              metadata: { buyerId: player.personId },
              rosterId,
              status: INVOICE_STATUS_ENUM.REFUNDED,
              invoiceItemId: player.invoiceItemId,
            });
          } else if (
            player.paymentStatus === INVOICE_STATUS_ENUM.OPEN
          ) {
            // Individual payment is not paid, remove from cart
            await removeIndividualPaymentCartItemHelper({
              buyerId: player.personId,
              rosterId,
            });
          }
        }

        // Remove all references to this this in this event and remove players.
        await unregisterHelper({ rosterId, eventId });
      } else {
        // team is in a game, can't unregister and refund
        result.failed = true;
      }
    }
  } catch (error) {
    // do not make api call fail, current teams state will be returned
    result.failed = true;
  }

  result.data = await getAllRegisteredInfosHelper(eventId, userId);
  return result;
};

async function addMembership(body, userId) {
  const {
    entityId,
    membership,
    length,
    date,
    type,
    price,
    taxRatesId,
  } = body;
  const res = await addMembershipHelper(
    entityId,
    membership,
    length,
    date,
    type,
    price,
    taxRatesId,
    userId,
  );
  return res;
}

async function deleteEntity(id, user_id) {
  return deleteEntityHelper(id, user_id);
}

async function deleteEntityMembership(query) {
  const { membershipId } = query;

  return deleteEntityMembershipHelper(membershipId);
}
async function deleteMembership(query) {
  const { memberType, organizationId, personId } = query;
  return deleteMembershipHelper(memberType, organizationId, personId);
}
async function deleteReport(query) {
  const { reportId } = query;
  return deleteReportHelper(reportId);
}

async function deleteOption(id) {
  return deleteOptionHelper(id);
}

async function addPlayerToRoster(body, userId) {
  const { teamId, eventId, teamName, personId, ...otherProps } = body;

  const res = await addPlayerToRosterHelper(
    { ...otherProps, personId },
    userId,
  );

  const owners = await getEntityOwners(personId);
  if (res && !body.isSub && owners) {
    const realEventId = await getRealId(eventId);
    const { name } = await getPersonInfos(personId);
    owners.forEach(owner => {
      const notif = {
        user_id: owner.user_id,
        type: NOTIFICATION_TYPE.ADDED_TO_ROSTER,
        entity_photo: realEventId || teamId,
        metadata: { eventId: realEventId, teamName },
      };
      const emailInfos = {
        type: NOTIFICATION_TYPE.ADDED_TO_ROSTER,
        realEventId,
        teamName,
        name,
      };

      sendNotification(notif, emailInfos);
    });
  }
  return res;
}

async function deletePlayerFromRoster(id, eventId, userId) {
  const {
    invoiceItemId,
    status,
    personId,
    rosterId,
  } = await getPlayerInvoiceItemHelper(id);

  if (!(await canRemovePlayerFromRosterHelper(rosterId, personId))) {
    return ERROR_ENUM.VALUE_IS_INVALID;
  }

  if (status === INVOICE_STATUS_ENUM.PAID) {
    // status is paid and event admin is removing
    if (await isAllowed(eventId, userId, ENTITIES_ROLE_ENUM.EDITOR)) {
      await createRefund({ invoiceItemId });
      await updatePlayerPaymentStatusHelper({
        metadata: { buyerId: personId },
        rosterId,
        status: INVOICE_STATUS_ENUM.REFUNDED,
        invoiceItemId,
      });
    } else {
      return ERROR_ENUM.ACCESS_DENIED;
    }
  } else if (status === INVOICE_STATUS_ENUM.OPEN) {
    // status is open, can remove from roster
    await removeIndividualPaymentCartItemHelper({
      buyerId: personId,
      rosterId,
    });
  }

  return deletePlayerFromRosterHelper(id);
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
  addGameAttendances,
  addReport,
  addMember,
  addMemberManually,
  addMembership,
  addOption,
  addPhase,
  addPlayerToRoster,
  addRegisteredToSchedule,
  addNewPersonToRoster,
  addSpiritSubmission,
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
  deleteMembership,
  deleteReport,
  deleteGame,
  deleteGame,
  deleteOption,
  deletePlayerFromRoster,
  eventInfos,
  eventInfos,
  getAlias,
  validateEmailIsUnique,
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
  getGameSubmissionInfos,
  getInteractiveToolData,
  getTeamGames,
  getPhasesGameAndTeams,
  getGeneralInfos,
  getMembers,
  getReports,
  generateReport,
  hasMemberships,
  getOrganizationMembers,
  getMemberships,
  getOptions,
  getOwnedEvents,
  getPersonInfos,
  getPhases,
  getRankings,
  getPrimaryPerson,
  getRegistered,
  getRemainingSpots,
  getRoster,
  getPossibleSubmissionerInfos,
  getS3Signature,
  getScoreSuggestion,
  getSameSuggestions,
  getSlots,
  getTeamsSchedule,
  importMembers,
  isAllowed,
  unregisterTeams,
  updateAlias,
  updateEntity,
  updateEntityRole,
  updateEvent,
  updatePersonInfos,
  updatePreRanking,
  updateGame,
  updateGamesInteractiveTool,
  updateSuggestionStatus,
  updateGeneralInfos,
  updateMember,
  updateOption,
  updateRegistration,
  updateRosterRole,
  getRostersNames,
  acceptScoreSuggestion,
};
