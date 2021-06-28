const {
  ENTITIES_ROLE_ENUM,
  INVOICE_STATUS_ENUM,
  STATUS_ENUM,
  REJECTION_ENUM,
  NOTIFICATION_TYPE,
  GLOBAL_ENUM,
  ROSTER_ROLE_ENUM,
} = require('../../../../common/enums');
const { ERROR_ENUM } = require('../../../../common/errors');
const moment = require('moment');
const { signS3Request } = require('../../server/utils/aws');

const {
  acceptScoreSuggestion: acceptScoreSuggestionHelper,
  addEntity: addEntityHelper,
  addEntityRole: addEntityRoleHelper,
  addEventCartItem,
  addEventRoster: addEventRosterHelper,
  addField: addFieldHelper,
  addGame: addGameHelper,
  addGameAttendances: addGameAttendancesHelper,
  addMember: addMemberHelper,
  addMemberDonation: addMemberDonationHelper,
  addMemberManually: addMemberManuallyHelper,
  addMembership: addMembershipHelper,
  addOption: addOptionHelper,
  addPartner: addPartnerHelper,
  addPersonToEvent: addPersonToEventHelper,
  addPhase: addPhaseHelper,
  addPlayerCartItem: addPlayerCartItemHelper,
  addPlayerToRoster: addPlayerToRosterHelper,
  addPlayerToTeam: addPlayerToTeamHelper,
  addPractice: addPracticeHelper,
  addReport: addReportHelper,
  addScoreSuggestion: addScoreSuggestionHelper,
  addSpiritSubmission: addSpiritSubmissionHelper,
  addTeamRoster: addTeamRosterHelper,
  sendRequestToJoinTeam: sendRequestToJoinTeamHelper,
  addTeamToEvent: addTeamToEventHelper,
  addTimeSlot: addTimeSlotHelper,
  cancelRosterInviteToken: cancelRosterInviteTokenHelper,
  canRemovePlayerFromRoster: canRemovePlayerFromRosterHelper,
  canUnregisterTeam: canUnregisterTeamHelper,
  deleteEntity: deleteEntityHelper,
  deleteEntityMembership: deleteEntityMembershipHelper,
  deleteGame: deleteGameHelper,
  deleteMembership: deleteMembershipHelper,
  deleteMembershipWithId: deleteMembershipWithIdHelper,
  deleteOption: deleteOptionHelper,
  deletePartner: deletePartnerHelper,
  deletePersonFromEvent,
  deletePlayer: deletePlayerHelper,
  deletePlayerFromRoster: deletePlayerFromRosterHelper,
  deletePractice: deletePracticeHelper,
  deleteReport: deleteReportHelper,
  deleteRoster: deleteRosterHelper,
  deleteRosterPlayer: deleteRosterPlayerHelper,
  eventInfos: eventInfosHelper,
  generateReport: generateReportHelper,
  getAlias: getAliasHelper,
  getAllEntities: getAllEntitiesHelper,
  getAllExercises: getAllExercisesHelper,
  getAllForYouPagePosts: getAllForYouPagePostsHelper,
  getAllOwnedEntities: getAllOwnedEntitiesHelper,
  getAllPeopleRegisteredInfos: getAllPeopleRegisteredInfosHelper,
  getAllPlayersAcceptedRegistered: getAllPlayersAcceptedRegisteredHelper,
  getAllPlayersPending: getAllPlayersPendingHelper,
  getAllTeamPlayersPending: getAllTeamPlayersPendingHelper,
  getAllRolesEntity: getAllRolesEntityHelper,
  getAllTeamGames: getAllTeamGamesHelper,
  getAllTeamPractices: getAllTeamPracticesHelper,
  getAllTeamsAcceptedInfos: getAllTeamsAcceptedInfosHelper,
  getAllTeamsAcceptedRegistered: getAllTeamsAcceptedRegisteredHelper,
  getAllTeamsPending: getAllTeamsPendingHelper,
  getAllTeamsRefused: getAllTeamsRefusedHelper,
  getAllTeamsRegisteredInfos: getAllTeamsRegisteredInfosHelper,
  getAllTypeEntities: getAllTypeEntitiesHelper,
  getCreatorsUserId,
  getEmailPerson,
  getEntitiesTypeById: getEntitiesTypeByIdHelper,
  getEntity: getEntityHelper,
  getEntityRole: getEntityRoleHelper,
  getEvent: getEventHelper,
  getEventAdmins: getEventAdminsHelper,
  getEventIdFromRosterId,
  getFields: getFieldsHelper,
  getGameInfo: getGameInfoHelper,
  getGamePlayersWithRole,
  getGames: getGamesHelper,
  getGameSubmissionInfos: getGameSubmissionInfosHelper,
  getGeneralInfos: getGeneralInfosHelper,
  getGraphAmountGeneratedByEvent: getGraphAmountGeneratedByEventHelper,
  getGraphMemberCount: getGraphMemberCountHelper,
  getGraphUserCount: getGraphUserCountHelper,
  getLastRankedTeam: getLastRankedTeamHelper,
  getMembers: getMembersHelper,
  getMembership,
  getMemberships: getMembershipsHelper,
  getMostRecentMember: getMostRecentMemberHelper,
  getMyPersonsAdminsOfTeam: getMyPersonsAdminsOfTeamHelper,
  getNbOfTeamsInEvent: getNbOfTeamsInEventHelper,
  getOptions: getOptionsHelper,
  getOrganizationMembers: getOrganizationMembersHelper,
  getOrganizationTokenPromoCode: getOrganizationTokenPromoCodeHelper,
  getOwnedEvents: getOwnedEventsHelper,
  getOwnerStripePrice,
  getPartners: getPartnersHelper,
  getPersonGames: getPersonGamesHelper,
  getPersonInfos: getPersonInfosHelper,
  getPersonInvoiceItem,
  getPersonPaymentOption,
  getPhasesGameAndTeams: getPhasesGameAndTeamsHelper,
  getPhasesWithoutPrerank: getPhasesWithoutPrerankHelper,
  getPlayerInvoiceItem: getPlayerInvoiceItemHelper,
  getPracticeBasicInfo: getPracticeBasicInfoHelper,
  getPracticeInfo: getPracticeInfoHelper,
  getPreranking: getPrerankingHelper,
  getPrimaryPerson: getPrimaryPersonHelper,
  getRealId: getRealIdHelper,
  getRegistered: getRegisteredHelper,
  getRegisteredPersons,
  getRegistrationIndividualPaymentOption: getRegistrationIndividualPaymentOptionHelper,
  getRegistrationStatus,
  getRegistrationTeamPaymentOption: getRegistrationTeamPaymentOptionHelper,
  getRemainingSpots: getRemainingSpotsHelper,
  getReports: getReportsHelper,
  getRoleRoster,
  getRoster: getRosterHelper,
  getRosterByEventAndUser: getRosterByEventAndUserHelper,
  getRosterEventInfos,
  getRosterIdFromInviteToken,
  getRosterInviteToken: getRosterInviteTokenHelper,
  getRosterInvoiceItem,
  getRosterPlayers: getRosterPlayersHelper,
  getMyTeamPlayers: getMyTeamPlayersHelper,
  getRostersNames: getRostersNamesHelper,
  getScoreSuggestion: getScoreSuggestionHelper,
  getSessionLocations: getSessionLocationsHelper,
  getSlots: getSlotsHelper,
  getTeamCoachedByUser: getTeamCoachedByUserHelper,
  getTeamCreatorUserId,
  getTeamEventsInfos: getTeamEventsInfosHelper,
  getTeamGames: getTeamGamesHelper,
  getTeamIdFromRosterId,
  getTeamPaymentOptionFromRosterId,
  getTeamPlayers: getTeamPlayersHelper,
  getTeamRosters: getTeamRostersHelper,
  getTeamsSchedule: getTeamsScheduleHelper,
  getUnplacedGames: getUnplacedGamesHelper,
  getUserIdFromPersonId,
  getWichTeamsCanUnregister: getWichTeamsCanUnregisterHelper,
  hasMemberships: hasMembershipsHelper,
  insertRosterInviteToken,
  removeEntityRole: removeEntityRoleHelper,
  removeEventCartItem: removeEventCartItemHelper,
  removeIndividualEventCartItem: removeIndividualEventCartItemHelper,
  removeIndividualPaymentCartItem: removeIndividualPaymentCartItemHelper,
  setGameScore: setGameScoreHelper,
  unregister: unregisterHelper,
  updateAlias: updateAliasHelper,
  updateEntityName: updateEntityNameHelper,
  updateEntityPhoto: updateEntityPhotoHelper,
  updateEntityRole: updateEntityRoleHelper,
  updateEvent: updateEventHelper,
  updateGame: updateGameHelper,
  updateGamesInteractiveTool: updateGamesInteractiveToolHelper,
  updateGeneralInfos: updateGeneralInfosHelper,
  updateMember: updateMemberHelper,
  updateMemberOptionalField: updateMemberOptionalFieldHelper,
  updateMembershipTermsAndConditions: updateMembershipTermsAndConditionsHelper,
  updateOption: updateOptionHelper,
  updatePartner: updatePartnerHelper,
  updatePersonInfosHelper,
  updatePlayer: updatePlayerHelper,
  updatePlayerAcceptation: updatePlayerAcceptationHelper,
  updateTeamPlayerAcceptation: updateTeamPlayerAcceptationHelper,
  updatePlayerPaymentStatus: updatePlayerPaymentStatusHelper,
  updatePractice: updatePracticeHelper,
  updatePracticeRsvp: updatePracticeRsvpHelper,
  updatePreRanking: updatePreRankingHelper,
  updateRegistration: updateRegistrationHelper,
  updateRegistrationPerson: updateRegistrationPersonHelper,
  updateRoster: updateRosterHelper,
  updateRosterPlayer: updateRosterPlayerHelper,
  updateRosterRole: updateRosterRoleHelper,
  updateSuggestionStatus: updateSuggestionStatusHelper,
  updateTeamAcceptation: updateTeamAcceptationHelper,
} = require('../helpers/entity');
const { createRefund } = require('../helpers/stripe/checkout');
const {
  sendCartItemAddedPlayerEmail,
  sendImportMemberNonExistingEmail,
} = require('../../server/utils/nodeMailer');
const { addMembershipCartItem } = require('../helpers/shop');
const {
  generateMemberImportToken,
  getLanguageFromEmail,
  getUserIdFromEmail,
  validateEmailIsUnique: validateEmailIsUniqueHelper,
  getPrimaryPersonIdFromUserId,
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

async function getEntity(id, userId) {
  const res = await getEntityHelper(id, userId);
  if (res.basicInfos.type === GLOBAL_ENUM.PERSON) {
    res.gamesInfos = await getPersonGamesHelper(id);
  }
  if (res.basicInfos.type === GLOBAL_ENUM.TEAM) {
    res.gamesInfos = await getTeamEventsInfosHelper(id);
  }

  return res;
}

function getAllEntities(params) {
  return getAllEntitiesHelper(params);
}

function getAllForYouPagePosts() {
  return getAllForYouPagePostsHelper();
}

function getScoreSuggestion(gameId) {
  return getScoreSuggestionHelper(gameId);
}

function getAllOwnedEntities(type, userId, querry, onlyAdmin) {
  return getAllOwnedEntitiesHelper(type, userId, querry, onlyAdmin);
}

function getOwnedEvents(organizationId) {
  return getOwnedEventsHelper(organizationId);
}

function getAllTypeEntities(type) {
  return getAllTypeEntitiesHelper(type);
}

function getEntitiesTypeById(id) {
  return getEntitiesTypeByIdHelper(id);
}

function getAllRolesEntity(id) {
  return getAllRolesEntityHelper(id);
}

function getMembers(persons, organizationId) {
  return getMembersHelper(persons, organizationId);
}

function getReports(entityId) {
  return getReportsHelper(entityId);
}

function generateReport(reportId) {
  return generateReportHelper(reportId);
}

function hasMemberships(organizationId) {
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

async function getOrganizationTokenPromoCode(organizationId, userId) {
  if (
    !(await isAllowed(
      organizationId,
      userId,
      ENTITIES_ROLE_ENUM.EDITOR,
    ))
  ) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }
  return getOrganizationTokenPromoCodeHelper(organizationId);
}

function eventInfos(id, userId) {
  return eventInfosHelper(id, userId);
}

function getMemberships(entityId) {
  return getMembershipsHelper(entityId);
}

async function getMostRecentMember(organizationId, userId) {
  const personId = await getPrimaryPersonIdFromUserId(userId);
  return getMostRecentMemberHelper(personId, organizationId);
}

function getPartners(entityId) {
  return getPartnersHelper(entityId);
}

function getRegistered(teamId, eventId) {
  return getRegisteredHelper(teamId, eventId);
}

function getAllTeamsRegisteredInfos(eventId, userId) {
  return getAllTeamsRegisteredInfosHelper(eventId, userId);
}

function getAllTeamsAcceptedInfos(eventId, userId) {
  return getAllTeamsAcceptedInfosHelper(eventId, userId);
}

function getAllPeopleRegisteredInfos(eventId, userId) {
  return getAllPeopleRegisteredInfosHelper(eventId, userId);
}

function getAllTeamsAcceptedRegistered(eventId) {
  return getAllTeamsAcceptedRegisteredHelper(eventId);
}

function getAllPlayersAcceptedRegistered(eventId) {
  return getAllPlayersAcceptedRegisteredHelper(eventId);
}

function getRemainingSpots(eventId) {
  return getRemainingSpotsHelper(eventId);
}

function getPreranking(eventId) {
  return getPrerankingHelper(eventId);
}
function getPrimaryPerson(userId) {
  return getPrimaryPersonHelper(userId);
}

function getRoster(rosterId, withSub) {
  return getRosterHelper(rosterId, withSub);
}

async function getRosterAllIncluded(rosterId, userId, withSub) {
  const players = getRoster(rosterId, withSub);
  const role = getRoleRoster(rosterId, userId);

  const eventId = await getEventIdFromRosterId(rosterId);
  const registrationStatus = getRegistrationStatus(rosterId);

  const [{ name } = {}] = await getRostersNames([rosterId]);
  return {
    roster: {
      players: await players,
      role: await role,
      rosterId,
      name: name,
      registrationStatus: await registrationStatus,
    },
    eventId,
  };
}

function getEvent(eventId) {
  return getEventHelper(eventId);
}

function getAlias(entityId) {
  return getAliasHelper(entityId);
}
function getRole(entityId, userId) {
  return getEntityRoleHelper(entityId, userId);
}

function validateEmailIsUnique(email) {
  return validateEmailIsUniqueHelper(email);
}

function getPhases(eventId) {
  return getPhasesWithoutPrerankHelper(eventId);
}

function getGameInfo(gameId, userId) {
  return getGameInfoHelper(gameId, userId);
}

function getSessionLocations(teamId) {
  return getSessionLocationsHelper(teamId);
}

function getPracticeBasicInfo(teamId, userId) {
  return getPracticeBasicInfoHelper(teamId, userId);
}

function getPracticeInfo(practiceId, userId) {
  return getPracticeInfoHelper(practiceId, userId);
}

function getGames(eventId) {
  return getGamesHelper(eventId);
}

function getMyRosterIds(eventId, userId) {
  return getRosterByEventAndUserHelper(eventId, userId);
}

function getGameSubmissionInfos(gameId, rosterId) {
  return getGameSubmissionInfosHelper(gameId, rosterId);
}

function getUnplacedGames(eventId) {
  return getUnplacedGamesHelper(eventId);
}

function getTeamGames(eventId) {
  return getTeamGamesHelper(eventId);
}

function getTeamRosters(teamId) {
  return getTeamRostersHelper(teamId);
}

function getPhasesGameAndTeams(eventId, phaseId) {
  return getPhasesGameAndTeamsHelper(eventId, phaseId);
}

function getSlots(eventId) {
  return getSlotsHelper(eventId);
}

function getTeamsSchedule(eventId) {
  return getTeamsScheduleHelper(eventId);
}

function getTeamPlayers(teamId) {
  return getTeamPlayersHelper(teamId);
}

function getRosterPlayers(rosterId) {
  return getRosterPlayersHelper(rosterId);
}

function getMyTeamPlayers(teamId, userId) {
  return getMyTeamPlayersHelper(teamId, userId);
}

function getFields(eventId) {
  return getFieldsHelper(eventId);
}

function getGeneralInfos(entityId, userId) {
  return getGeneralInfosHelper(entityId, userId);
}

function getGraphAmountGeneratedByEvent(
  eventPaymentId,
  language,
  date,
) {
  return getGraphAmountGeneratedByEventHelper(
    eventPaymentId,
    language,
    date,
  );
}

function getGraphUserCount(date, language) {
  return getGraphUserCountHelper(date, language);
}

function getGraphMemberCount(organizationId, date) {
  return getGraphMemberCountHelper(organizationId, date);
}

async function getAllTeamsPendingAndRefused(eventId) {
  const pending = await getAllTeamsPendingHelper(eventId);
  const refused = await getAllTeamsRefusedHelper(eventId);
  return { pending, refused };
}

async function getAllPlayersPendingAndRefused(eventId) {
  const pending = await getAllPlayersPendingHelper(eventId);
  const refused = await getAllPlayersRefusedHelper(eventId);
  return { pending, refused };
}

function getAllTeamPlayersPending(teamId) {
  return getAllTeamPlayersPendingHelper(teamId);
}

function getPersonInfos(entityId) {
  return getPersonInfosHelper(entityId);
}

function getRegistrationTeamPaymentOption(paymentOptionId) {
  return getRegistrationTeamPaymentOptionHelper(paymentOptionId);
}

async function getPossibleSubmissionerInfos(gameId, teams, userId) {
  const teamsList = JSON.parse(teams);
  const adminsOfTeams = await Promise.all(
    teamsList.map(async t => {
      const admins = await getMyPersonsAdminsOfTeamHelper(
        t.rosterId,
        userId,
      );
      if (!admins) {
        return;
      }
      const myTeam = teamsList.find(
        team => team.rosterId === t.rosterId,
      );
      const enemyTeam = teamsList.find(
        team => team.rosterId !== t.rosterId,
      );
      return {
        myTeam: {
          rosterId: myTeam.rosterId,
          name: myTeam.name,
        },
        enemyTeam: {
          rosterId: enemyTeam.rosterId,
          name: enemyTeam.name,
        },
        myAdminPersons: admins,
      };
    }),
  );
  const validTeams = adminsOfTeams.filter(res => res !== undefined);
  if (validTeams.length === 0) {
    return ERROR_ENUM.ACCESS_DENIED;
  }

  return validTeams;
}

async function updateEvent(body, userId) {
  const { eventId, maximumSpots, startDate, endDate } = body;
  const nbOfTeams = await getNbOfTeamsInEventHelper(eventId);
  const lastTeamInPrerank = await getLastRankedTeamHelper(eventId);
  if (
    !(await isAllowed(eventId, userId, ENTITIES_ROLE_ENUM.EDITOR))
  ) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }

  if (typeof maximumSpots === 'number' && nbOfTeams > maximumSpots) {
    const reason = REJECTION_ENUM.TOO_MANY_TEAMS;
    return { reason };
  }
  if (
    typeof maximumSpots === 'number' &&
    lastTeamInPrerank > maximumSpots
  ) {
    const reason = REJECTION_ENUM.LAST_TEAM_HIGHER_THAN_SPOTS;
    return { reason };
  }
  const res = await updateEventHelper(
    eventId,
    maximumSpots,
    startDate,
    endDate,
  );

  return res;
}

function getRealId(id) {
  return getRealIdHelper(id);
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
  const {
    teamId,
    eventId,
    paymentOption,
    roster,
    status,
    informations,
  } = body;
  if (!(await isAllowed(teamId, userId, ENTITIES_ROLE_ENUM.EDITOR))) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }
  if (!paymentOption) {
    throw new Error(ERROR_ENUM.VALUE_IS_REQUIRED);
  }
  // Reject team if there is already too many registered teams
  const numberOfTeamsRemaining = getRemainingSpotsHelper(eventId);
  if (
    typeof numberOfTeamsRemaining === 'number' &&
    numberOfTeamsRemaining < 1
  ) {
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

  let registrationStatus = isFreeOption
    ? STATUS_ENUM.ACCEPTED_FREE
    : STATUS_ENUM.ACCEPTED;

  if (teamPaymentOption.team_acceptation) {
    registrationStatus = STATUS_ENUM.PENDING;
  }

  const rosterId = await addTeamToEventHelper({
    teamId,
    eventId,
    status: isFreeOption ? INVOICE_STATUS_ENUM.FREE : status,
    registrationStatus,
    paymentOption,
    informations,
  });

  // Add roster
  if (roster) {
    await Promise.all(
      roster.map(async r => {
        await addPlayerToRoster(
          {
            personId: r.personId,
            role: r.role,
            isSub: false,
            rosterId,
          },
          userId,
        );
      }),
    );
  }

  const creatorUserIds = await getCreatorsUserId(eventId);

  if (registrationStatus === STATUS_ENUM.PENDING) {
    creatorUserIds.map(async userId => {
      const placesLeft = await getRemainingSpotsHelper(event.id);
      const infos = { team, event, placesLeft };
      sendNotification(
        NOTIFICATION_TYPE.TEAM_PENDING_REGISTRATION_ADMIN,
        userId,
        infos,
      );
    });
  } else {
    if (registrationStatus === STATUS_ENUM.ACCEPTED) {
      // wont be added to cart if free
      const ownerId = await getOwnerStripePrice(
        teamPaymentOption.team_stripe_price_id,
      );
      await addEventCartItem(
        {
          stripePriceId: teamPaymentOption.team_stripe_price_id,
          metadata: {
            eventId: event.id,
            sellerEntityId: ownerId,
            buyerId: teamId,
            rosterId,
            team,
          },
        },
        userId,
      );
    }

    const infos = { team, event, isFreeOption };
    sendNotification(
      NOTIFICATION_TYPE.TEAM_REGISTRATION,
      userId,
      infos,
    );

    creatorUserIds.map(async userId => {
      const placesLeft = await getRemainingSpotsHelper(event.id);
      const infos = { team, event, placesLeft };
      sendNotification(
        NOTIFICATION_TYPE.TEAM_REGISTRATION_TO_ADMIN,
        userId,
        infos,
      );
    });
  }

  return { status: registrationStatus, rosterId };
}

const addPlayersCartItems = async rosterId => {
  const players = await getRoster(rosterId);

  await Promise.all(
    players.map(async p => {
      if (p.paymentStatus == INVOICE_STATUS_ENUM.OPEN) {
        await addPlayerCartItem({
          personId: p.personId,
          name: p.name,
          rosterId,
          isSub: p.isSub,
        });
      }
    }),
  );
  return players;
};

const addPlayerCartItem = async body => {
  const { personId, rosterId, name, isSub } = body;
  const { cartItem, event, team } = await addPlayerCartItemHelper({
    personId,
    rosterId,
    name,
    isSub,
  });

  if (cartItem) {
    const email = await getEmailPerson(personId);
    const language = await getLanguageFromEmail(email);
    const userId = await getUserIdFromPersonId(personId);
    await sendCartItemAddedPlayerEmail({
      email,
      teamName: team.name,
      eventName: event.name,
      language,
      userId,
    });
  }
  return cartItem;
};

async function addTeamAsAdmin(body, userId) {
  const { eventId, name } = body;
  if (
    !(await isAllowed(eventId, userId, ENTITIES_ROLE_ENUM.EDITOR))
  ) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }
  // Reject team if there is already too many registered teams
  const remainingSpots = await getRemainingSpotsHelper(eventId);
  if (typeof remainingSpots === 'number' && remainingSpots < 1) {
    return {
      status: STATUS_ENUM.REFUSED,
      reason: REJECTION_ENUM.NO_REMAINING_SPOTS,
    };
  }

  const person = await getPrimaryPerson(userId);
  const team = await addEntityHelper({
    name,
    creator: person.id,
    type: GLOBAL_ENUM.TEAM,
  });

  const event = (await getEntity(eventId, userId)).basicInfos;

  const registrationStatus = STATUS_ENUM.ACCEPTED_FREE;

  const rosterId = await addTeamToEventHelper({
    teamId: team.id,
    eventId: event.id,
    status: INVOICE_STATUS_ENUM.FREE,
    registrationStatus,
  });

  const roster = [
    {
      personId: person.id,
      name: `${person.name} ${person.surname}`,
      rosterId,
      role: ROSTER_ROLE_ENUM.CAPTAIN,
    },
  ];

  // Add roster
  await addEventRosterHelper(rosterId, roster);

  // Handle other acceptation statuses
  return { status: registrationStatus, rosterId };
}

async function addPersonToEvent(body, userId) {
  const {
    eventId,
    paymentOption,
    persons,
    status,
    informations,
  } = body;

  if (!paymentOption) {
    throw new Error(ERROR_ENUM.VALUE_IS_REQUIRED);
  }

  const remainingSpots = await getRemainingSpotsHelper(eventId);
  // Reject team if there is already too many registered teams
  if (
    typeof remainingSpots === 'number' &&
    remainingSpots < persons.length
  ) {
    const registrationStatus = STATUS_ENUM.REFUSED;
    const reason = REJECTION_ENUM.NO_REMAINING_SPOTS;
    return { status: registrationStatus, reason };
  }

  const event = (await getEntity(eventId, userId)).basicInfos;

  const individualPaymentOption = await getRegistrationIndividualPaymentOptionHelper(
    paymentOption,
  );

  const isFreeOption = individualPaymentOption.individual_price === 0;
  // TODO: Validate status of team
  let registrationStatus = isFreeOption
    ? STATUS_ENUM.ACCEPTED_FREE
    : STATUS_ENUM.ACCEPTED;

  if (individualPaymentOption.player_acceptation) {
    registrationStatus = STATUS_ENUM.PENDING;
  }

  const registeredPersons = await getRegisteredPersons(
    persons,
    eventId,
  );

  if (registeredPersons.length > 0) {
    return {
      status: STATUS_ENUM.REFUSED,
      reason: REJECTION_ENUM.ALREADY_REGISTERED,
      persons: registeredPersons,
    };
  }
  await Promise.all(
    persons.map(async person => {
      await addPersonToEventHelper({
        personId: person.id,
        eventId: event.id,
        status: isFreeOption ? INVOICE_STATUS_ENUM.FREE : status,
        registrationStatus,
        paymentOption,
        informations,
      });

      if (registrationStatus === STATUS_ENUM.PENDING) {
        const creatorUserIds = await getCreatorsUserId(eventId);
        await Promise.all(
          creatorUserIds.map(async userId => {
            const infos = {
              person,
              event,
              placesLeft: remainingSpots,
            };
            sendNotification(
              NOTIFICATION_TYPE.PERSON_PENDING_REGISTRATION_TO_ADMIN,
              userId,
              infos,
            );
          }),
        );
      } else {
        if (registrationStatus === STATUS_ENUM.ACCEPTED) {
          // wont be added to cart if free
          const ownerId = await getOwnerStripePrice(
            individualPaymentOption.individual_stripe_price_id,
          );
          await addEventCartItem(
            {
              stripePriceId:
                individualPaymentOption.individual_stripe_price_id,
              metadata: {
                eventId: event.id,
                sellerEntityId: ownerId,
                buyerId: person.id,
                person: person,
              },
            },
            userId,
          );
        }
        const infos = {
          person,
          event,
          isFreeOption,
        };
        //send notification to person
        sendNotification(
          NOTIFICATION_TYPE.PERSON_REGISTRATION,
          userId,
          infos,
        );
        // send notification to organization admin
        const creatorUserIds = await getCreatorsUserId(eventId);
        await Promise.all(
          creatorUserIds.map(async userId => {
            const infos = {
              person,
              event,
              placesLeft: remainingSpots,
            };
            sendNotification(
              NOTIFICATION_TYPE.PERSON_REGISTRATION_TO_ADMIN,
              userId,
              infos,
            );
          }),
        );
      }
    }),
  );
  return { status: registrationStatus, persons };
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

function getOptions(eventId) {
  return getOptionsHelper(eventId);
}

function addEntity(body, userId) {
  return addEntityHelper(body, userId);
}

function addPartner(body) {
  return addPartnerHelper(body);
}

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
  const { rosterId, playerId, role } = body;
  const { eventId } = await getRosterEventInfos(rosterId);
  const userRole = await getRoleRoster(rosterId, userId);
  if (
    !(await isAllowed(eventId, userId, ENTITIES_ROLE_ENUM.ADMIN)) &&
    !(
      userRole === ROSTER_ROLE_ENUM.CAPTAIN ||
      userRole === ROSTER_ROLE_ENUM.COACH
    )
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

async function updateMemberOptionalField(body) {
  const {
    membershipId,
    heardOrganization,
    gettingInvolved,
    frequentedSchool,
    jobTitle,
    employer,
  } = body;

  const res = await updateMemberOptionalFieldHelper(
    membershipId,
    heardOrganization,
    gettingInvolved,
    frequentedSchool,
    jobTitle,
    employer,
  );

  return res;
}

async function updateTeamAcceptation(body) {
  const { eventId, rosterId, registrationStatus } = body;
  const res = await updateTeamAcceptationHelper(
    eventId,
    rosterId,
    registrationStatus,
  );
  const event = (await getEntity(eventId)).basicInfos;
  const teamId = await getTeamIdFromRosterId(rosterId);
  const team = (await getEntity(teamId)).basicInfos;
  const userId = await getTeamCreatorUserId(teamId);

  if (
    registrationStatus === STATUS_ENUM.ACCEPTED ||
    registrationStatus === STATUS_ENUM.ACCEPTED_FREE
  ) {
    const teamPaymentOption = await getTeamPaymentOptionFromRosterId(
      rosterId,
      eventId,
    );
    if (teamPaymentOption.teamStripePriceId) {
      const ownerId = await getOwnerStripePrice(
        teamPaymentOption.teamStripePriceId,
      );

      await addEventCartItem(
        {
          stripePriceId: teamPaymentOption.teamStripePriceId,
          metadata: {
            eventId: event.id,
            sellerEntityId: ownerId,
            buyerId: teamId,
            rosterId,
            team,
          },
        },
        userId,
      );
    }

    const infos = { team, event, isFreeOption: false };
    sendNotification(
      NOTIFICATION_TYPE.TEAM_REGISTRATION,
      userId,
      infos,
    );
  }

  if (registrationStatus === STATUS_ENUM.REFUSED) {
    const infos = { team, event };
    sendNotification(
      NOTIFICATION_TYPE.TEAM_REFUSED_REGISTRATION,
      userId,
      infos,
    );
  }
  return res;
}

async function updateTeamPlayerAcceptation(body) {
  const { teamId, personId, status } = body;
  const res = await updateTeamPlayerAcceptationHelper(
    teamId,
    personId,
    status,
  );
  return res;
}

async function updatePlayerAcceptation(body) {
  const { eventId, personId, registrationStatus } = body;
  const res = await updatePlayerAcceptationHelper(
    eventId,
    personId,
    registrationStatus,
  );

  const event = (await getEntity(eventId)).basicInfos;
  const person = (await getEntity(personId)).basicInfos;

  const userId = await getUserIdFromPersonId(personId);

  if (registrationStatus === STATUS_ENUM.ACCEPTED) {
    const personPaymentOption = await getPersonPaymentOption(
      personId,
      eventId,
    );

    const ownerId = await getOwnerStripePrice(
      personPaymentOption.individualStripePriceId,
    );

    await addEventCartItem(
      {
        stripePriceId: personPaymentOption.individualStripePriceId,
        metadata: {
          eventId,
          sellerEntityId: ownerId,
          buyerId: personId,
          person,
        },
      },
      userId,
    );

    const infos = { person, event, isFreeOption: false };
    sendNotification(
      NOTIFICATION_TYPE.PERSON_REGISTRATION,
      userId,
      infos,
    );
  }
  if (registrationStatus === STATUS_ENUM.ACCEPTED_FREE) {
    const infos = { person, event, isFreeOption: true };
    sendNotification(
      NOTIFICATION_TYPE.PERSON_REGISTRATION,
      userId,
      infos,
    );
  }
  if (registrationStatus === STATUS_ENUM.REFUSED) {
    const infos = { person, event };
    sendNotification(
      NOTIFICATION_TYPE.PERSON_REFUSED_REGISTRATION,
      userId,
      infos,
    );
  }
  return res;
}

async function updateAlias(body) {
  const { entityId, alias } = body;
  const res = await updateAliasHelper(entityId, alias);
  return res;
}

function updateOption(body) {
  return updateOptionHelper(body);
}

function updateMembershipTermsAndConditions(body) {
  return updateMembershipTermsAndConditionsHelper(body);
}

function updatePartner(body) {
  return updatePartnerHelper(body);
}

function updatePlayer(body) {
  return updatePlayerHelper(body);
}

function updateRosterPlayer(body) {
  return updateRosterPlayerHelper(body);
}

function updateRoster(body) {
  return updateRosterHelper(body);
}

async function updateGame(body) {
  const {
    gameId,
    phaseId,
    fieldId,
    timeslotId,
    rankingId1,
    rankingId2,
    oldRanking1,
    oldRanking2,
    description,
  } = body;
  const res = await updateGameHelper(
    gameId,
    phaseId,
    fieldId,
    timeslotId,
    rankingId1,
    rankingId2,
    oldRanking1,
    oldRanking2,
    description,
  );
  return res;
}

async function updatePractice(body, userId) {
  const {
    id,
    name,
    dateStart,
    dateEnd,
    newLocation,
    locationId,
    address,
  } = body;

  if (!(await isAllowed(id, userId), ENTITIES_ROLE_ENUM.EDITOR)) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }

  return updatePracticeHelper(
    id,
    name,
    dateStart,
    dateEnd,
    newLocation,
    locationId,
    address,
  );
}

async function updatePracticeRsvp(body, userId) {
  const { id, rsvp, personId, updateAll } = body;

  if (!(await isAllowed(id, userId), ENTITIES_ROLE_ENUM.EDITOR)) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }

  return updatePracticeRsvpHelper(
    id,
    rsvp,
    personId,
    updateAll,
    userId,
  );
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

async function updateSuggestionStatus(body, userId) {
  const { eventId } = body;
  if (
    !(await isAllowed(eventId, userId, ENTITIES_ROLE_ENUM.EDITOR))
  ) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }
  return updateSuggestionStatusHelper(body);
}

function addMemberManually(body) {
  return addMemberManuallyHelper(body);
}

function addReport(body) {
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
        m.email,
      );
      const organization = await getEntityHelper(organizationId);
      const userId = await getUserIdFromEmail(m.email);

      if (!userId) {
        sendImportMemberNonExistingEmail({
          email: m.email,
          token,
          language,
          organizationName: organization.basicInfos.name,
        });
      } else {
        const infos = {
          token,
          organizationName: organization.basicInfos.name,
        };
        sendNotification(
          NOTIFICATION_TYPE.IMPORT_MEMBER,
          userId,
          infos,
        );
      }
      return m;
    }),
  );
  return res;
}

async function addMemberDonation(body, userId) {
  const { amount, anonyme, note, organizationId, personId } = body;
  const res = await addMemberDonationHelper(
    amount,
    anonyme,
    note,
    organizationId,
    personId,
    userId,
  );
  return res;
}

async function addMember(body, userId) {
  const { membershipId, organizationId, personId } = body;

  const membership = await getMembership(membershipId);
  if (membership.price === 0) {
    return addMemberManuallyHelper({
      ...body,
      termsAndConditionsId: membership.terms_and_conditions_id,
    });
  }

  const res = await addMemberHelper({
    ...body,
    termsAndConditionsId: membership.terms_and_conditions_id,
  });
  const person = (await getEntity(personId)).basicInfos;
  const organization = (await getEntity(organizationId)).basicInfos;

  await addMembershipCartItem(
    {
      ...membership,
      membershipId: membership.id,
      id: res.id,
      person,
      organization,
      sellerEntityId: organizationId,
    },
    userId,
  );

  return res;
}

async function addGame(body, userId) {
  const {
    eventId,
    phaseId,
    fieldId,
    timeslotId,
    rankingId1,
    rankingId2,
  } = body;

  if (
    !(await isAllowed(eventId, userId, ENTITIES_ROLE_ENUM.EDITOR))
  ) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }

  const res = await addGameHelper(
    eventId,
    phaseId,
    fieldId,
    timeslotId,
    rankingId1,
    rankingId2,
  );

  return res;
}

async function addPractice(body, userId) {
  const {
    name,
    dateStart,
    dateEnd,
    address,
    locationId,
    newLocation,
    teamId,
  } = body;

  if (!(await isAllowed(teamId, userId, ENTITIES_ROLE_ENUM.EDITOR))) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }

  const res = await addPracticeHelper(
    name,
    dateStart,
    dateEnd,
    address,
    locationId,
    newLocation,
    teamId,
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

function getRostersNames(rosterArray) {
  return getRostersNamesHelper(rosterArray);
}

async function setGameScore(body, userId) {
  const { eventId, gameId, score, isManualAdd } = body;
  if (
    !(await isAllowed(eventId, userId, ENTITIES_ROLE_ENUM.EDITOR))
  ) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }
  return setGameScoreHelper(gameId, score, isManualAdd);
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
      opponentsPlayers.forEach(p => {
        const infos = {
          ...metadata,
          myRosterId: p.roster_id,
          myPlayerId: p.player_id,
        };
        sendNotification(
          NOTIFICATION_TYPE.OTHER_TEAM_SUBMITTED_A_SCORE,
          p.player_owner,
          infos,
        );
      });

      // send notifications to event admins in case of score conflict
      if (res.conflict) {
        const infos = {
          eventId: event_id,
          eventName: event_name,
          gameId: body.game_id,
        };

        const adminsUserIds = await getEventAdminsHelper(event_id);
        adminsUserIds.forEach(adminUserId => {
          sendNotification(
            NOTIFICATION_TYPE.SCORE_SUBMISSION_CONFLICT,
            adminUserId,
            infos,
          );
        });
      }
    }
  }
  return res;
}

async function addField(body, userId) {
  const { field, eventId } = body;
  if (
    !(await isAllowed(eventId, userId, ENTITIES_ROLE_ENUM.EDITOR))
  ) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }
  return addFieldHelper(field, eventId);
}
//TODO: delete this function and replace queries by controller in route
async function addPhase(body, userId) {
  const { phase, spots, eventId } = body;
  if (
    !(await isAllowed(eventId, userId, ENTITIES_ROLE_ENUM.EDITOR))
  ) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }
  return addPhaseHelper(phase, spots, eventId);
}

async function addTimeSlot(body, userId) {
  const { date, eventId } = body;
  if (
    !(await isAllowed(eventId, userId, ENTITIES_ROLE_ENUM.EDITOR))
  ) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }
  return addTimeSlotHelper(date, eventId);
}

async function addOption(body, userId) {
  const {
    endTime,
    eventId,
    eventType,
    name,
    ownerId,
    playerPrice,
    playerTaxes,
    startTime,
    teamPrice,
    teamTaxes,
    informations,
    manualAcceptation,
  } = body;
  if (
    !(await isAllowed(eventId, userId, ENTITIES_ROLE_ENUM.EDITOR))
  ) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }
  const res = await addOptionHelper(
    endTime,
    eventId,
    eventType,
    name,
    ownerId,
    playerPrice,
    playerTaxes,
    startTime,
    teamPrice,
    teamTaxes,
    informations,
    manualAcceptation,
    userId,
  );
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
        const teamId = await getTeamIdFromRosterId(rosterId);
        const captainUserId = await getTeamCreatorUserId(teamId);
        const team = (await getEntity(teamId, captainUserId))
          .basicInfos;
        const event = (await getEntity(eventId)).basicInfos;
        const infos = { team, event, status };
        sendNotification(
          NOTIFICATION_TYPE.TEAM_UNREGISTERED,
          captainUserId,
          infos,
        );
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

  result.data = await getAllTeamsRegisteredInfosHelper(
    eventId,
    userId,
  );
  return result;
};

async function unregisterPeople(body, userId) {
  const { eventId, people } = body;
  const result = { failed: false, data: [] };
  if (
    !(await isAllowed(eventId, userId, ENTITIES_ROLE_ENUM.EDITOR))
  ) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }

  try {
    for (const person of people) {
      const { personId, stripePrice } = person;
      const { invoiceItemId, status } = await getPersonInvoiceItem({
        eventId,
        personId,
      });

      if (status === INVOICE_STATUS_ENUM.PAID) {
        // Registration paid, refund please
        await createRefund({ invoiceItemId });
        await updateRegistrationPersonHelper(
          personId,
          eventId,
          invoiceItemId,
          INVOICE_STATUS_ENUM.REFUNDED,
        );
      } else if (status === INVOICE_STATUS_ENUM.OPEN) {
        // Registration is not paid, remove from cart
        await removeIndividualEventCartItemHelper({
          personId,
          eventId,
          stripePrice,
        });
      }
      await deletePersonFromEvent({ personId, eventId });
    }
  } catch (error) {
    // do not make api call fail, current teams state will be returned
    result.failed = true;
  }

  result.data = await getAllPeopleRegisteredInfosHelper(
    eventId,
    userId,
  );
  return result;
}

async function addMembership(body, userId) {
  const {
    entityId,
    membership,
    length,
    date,
    type,
    price,
    description,
    fileName,
    fileUrl,
    taxRatesId,
  } = body;
  const res = await addMembershipHelper(
    entityId,
    membership,
    length,
    date,
    type,
    price,
    description,
    fileName,
    fileUrl,
    taxRatesId,
    userId,
  );
  return res;
}

function deleteEntity(body, userId) {
  return deleteEntityHelper(body, userId);
}

function deletePartner(partnerId) {
  return deletePartnerHelper(partnerId);
}

function deletePlayer(id) {
  return deletePlayerHelper(id);
}

function deleteRoster(id) {
  return deleteRosterHelper(id);
}

function deleteRosterPlayer(id) {
  return deleteRosterPlayerHelper(id);
}

function deleteEntityMembership(query) {
  const { membershipId } = query;
  return deleteEntityMembershipHelper(membershipId);
}

function deleteMembership(query) {
  const { memberType, organizationId, personId } = query;
  return deleteMembershipHelper(memberType, organizationId, personId);
}

function deleteMembershipWithId(query) {
  const { membershipId } = query;
  return deleteMembershipWithIdHelper(membershipId);
}

function deleteReport(query) {
  const { reportId } = query;
  return deleteReportHelper(reportId);
}

function deleteOption(id) {
  return deleteOptionHelper(id);
}

async function addPlayersToTeam(body, userId) {
  const { players, teamId } = body;
  const team = (await getEntity(teamId, userId)).basicInfos;
  return Promise.all(
    players.map(async player => {
      const res = await addPlayerToTeamHelper(player, teamId);
      const userId = await getUserIdFromPersonId(player.id);
      const infos = { team };
      sendNotification(
        NOTIFICATION_TYPE.ADDED_TO_TEAM,
        userId,
        infos,
      );
      return res;
    }),
  );
}

async function sendRequestToJoinTeam(body, userId) {
  const { personId, teamId } = body;

  const res = await sendRequestToJoinTeamHelper(personId, teamId);

  const team = (await getEntity(teamId, userId)).basicInfos;
  const person = (await getEntity(personId, userId)).basicInfos;
  const teamCaptainUserId = await getTeamCreatorUserId(teamId);

  const infos = { team, person };
  sendNotification(
    NOTIFICATION_TYPE.REQUEST_TO_JOIN_TEAM,
    teamCaptainUserId,
    infos,
  );
  return res;
}

function addTeamRoster(body) {
  return addTeamRosterHelper(body);
}

async function addPlayerToRoster(body, userId) {
  const { personId, role, isSub, rosterId } = body;
  const eventId = await getEventIdFromRosterId(rosterId);
  const teamId = await getTeamIdFromRosterId(rosterId);
  const team = (await getEntity(teamId, userId)).basicInfos;
  const event = (await getEntity(eventId, userId)).basicInfos;
  const playerUserId = await getUserIdFromPersonId(personId);

  const { name } = await getPersonInfos(personId);

  const roster = await getRosterEventInfos(rosterId);
  const individualOption = await getRegistrationIndividualPaymentOptionHelper(
    roster.paymentOptionId,
  );
  const res = await addPlayerToRosterHelper({
    role,
    isSub,
    personId,
    rosterId,
    individualOption,
    teamId,
  });

  if (
    (roster.status === INVOICE_STATUS_ENUM.FREE ||
      roster.status === INVOICE_STATUS_ENUM.PAID) &&
    individualOption &&
    individualOption.individual_price > 0
  ) {
    await addPlayerCartItem({ name, rosterId, personId, isSub });
  }

  if (playerUserId === userId) {
    return res;
  }

  const infos = {
    event,
    team,
    name,
  };

  sendNotification(
    NOTIFICATION_TYPE.ADDED_TO_EVENT,
    playerUserId,
    infos,
  );
  return res;
}

async function deletePlayerFromRoster(id, userId) {
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
    const { eventId } = await getRosterEventInfos(rosterId);
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

  return deletePlayerFromRosterHelper({ id });
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

async function deletePractice(userId, query) {
  const { teamId, practiceId } = query;
  if (!(await isAllowed(teamId, userId, ENTITIES_ROLE_ENUM.EDITOR))) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }
  return deletePracticeHelper(practiceId);
}

async function createRosterInviteToken(userId, rosterId) {
  const admins = await getMyPersonsAdminsOfTeamHelper(
    rosterId,
    userId,
  );
  if (!admins) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }
  const token = await insertRosterInviteToken(rosterId);
  return token;
}

async function getRosterInviteToken(userId, rosterId) {
  const admins = await getMyPersonsAdminsOfTeamHelper(
    rosterId,
    userId,
  );
  if (!admins) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }
  const token = await getRosterInviteTokenHelper(rosterId);
  if (!token) {
    return insertRosterInviteToken(rosterId);
  }
  return token;
}

async function cancelRosterInviteToken(userId, rosterId) {
  const admins = await getMyPersonsAdminsOfTeamHelper(
    rosterId,
    userId,
  );
  if (!admins) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }
  return cancelRosterInviteTokenHelper(rosterId);
}

async function getNewRosterInviteToken(userId, rosterId) {
  const admins = await getMyPersonsAdminsOfTeamHelper(
    rosterId,
    userId,
  );
  if (!admins) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }
  //Making the old one expire
  const res = await cancelRosterInviteTokenHelper(rosterId);
  if (!res) {
    return;
  }
  return insertRosterInviteToken(rosterId);
}

async function getRosterFromInviteToken(token, userId) {
  const rosterId = await getRosterIdFromInviteToken(token);
  if (!rosterId) {
    return;
  }
  return getRosterAllIncluded(rosterId, userId, true);
}

async function getTeamCoachedByUser(userId) {
  const res = await getTeamCoachedByUserHelper(userId);
  if (!res) {
    return;
  }

  return res;
}

async function getAllTeamGames(teamId) {
  const res = await getAllTeamGamesHelper(teamId);
  if (!res) {
    return;
  }

  return res;
}

async function getAllTeamPractices(teamId) {
  const res = await getAllTeamPracticesHelper(teamId);
  if (!res) {
    return;
  }

  return res;
}

async function getAllExercises() {
  const res = await getAllExercisesHelper();
  if (!res) {
    return;
  }

  return res;
}

module.exports = {
  acceptScoreSuggestion,
  acceptScoreSuggestion,
  addEntity,
  addEntityRole,
  addField,
  addGame,
  addGameAttendances,
  addMember,
  addMemberDonation,
  addMemberManually,
  addMembership,
  addOption,
  addPartner,
  addPersonToEvent,
  addPhase,
  addPlayersCartItems,
  addPlayersToTeam,
  sendRequestToJoinTeam,
  addTeamRoster,
  addPlayerToRoster,
  addPractice,
  addReport,
  addScoreSuggestion,
  addSpiritSubmission,
  addTeamAsAdmin,
  addTeamToEvent,
  addTimeSlot,
  cancelRosterInviteToken,
  cancelRosterInviteToken,
  canUnregisterTeamsList,
  createRosterInviteToken,
  createRosterInviteToken,
  deleteEntity,
  deleteEntityHelper,
  deleteEntityHelper,
  deleteEntityMembership,
  deleteGame,
  deleteMembership,
  deleteMembershipWithId,
  deleteOption,
  deletePartner,
  deletePlayer,
  deleteRoster,
  deleteRosterPlayer,
  deletePlayerFromRoster,
  deletePractice,
  deleteReport,
  eventInfos,
  eventInfos,
  generateReport,
  getAlias,
  getAllEntities,
  getAllExercises,
  getAllForYouPagePosts,
  getAllOwnedEntities,
  getAllPeopleRegisteredInfos,
  getAllPlayersAcceptedRegistered,
  getAllPlayersPendingAndRefused,
  getAllTeamPlayersPending,
  getAllRolesEntity,
  getAllTeamsAcceptedInfos,
  getAllTeamsAcceptedRegistered,
  getAllTeamGames,
  getAllTeamPractices,
  getAllTeamsPendingAndRefused,
  getAllTeamsRegisteredInfos,
  getAllTypeEntities,
  getEntitiesTypeById,
  getEntity,
  getEvent,
  getFields,
  getGameInfo,
  getGames,
  getGameSubmissionInfos,
  getGeneralInfos,
  getGraphAmountGeneratedByEvent,
  getGraphMemberCount,
  getGraphUserCount,
  getInteractiveToolData,
  getMembers,
  getMemberships,
  getMostRecentMember,
  getMyRosterIds,
  getNewRosterInviteToken,
  getOptions,
  getOrganizationMembers,
  getOrganizationTokenPromoCode,
  getOwnedEvents,
  getPartners,
  getPersonInfos,
  getPhases,
  getPhasesGameAndTeams,
  getPossibleSubmissionerInfos,
  getPracticeBasicInfo,
  getPracticeInfo,
  getPreranking,
  getPrimaryPerson,
  getRealId,
  getRegistered,
  getRemainingSpots,
  getReports,
  getRole,
  getRoster,
  getRosterAllIncluded,
  getRosterFromInviteToken,
  getRosterFromInviteToken,
  getRosterInviteToken,
  getRosterInviteToken,
  getRostersNames,
  getRostersNames,
  getS3Signature,
  getScoreSuggestion,
  getSessionLocations,
  getSlots,
  getTeamCoachedByUser,
  getTeamGames,
  getTeamRosters,
  getTeamPlayers,
  getRosterPlayers,
  getMyTeamPlayers,
  getTeamsSchedule,
  hasMemberships,
  importMembers,
  isAllowed,
  setGameScore,
  unregisterPeople,
  unregisterTeams,
  updateAlias,
  updateEntity,
  updateEntityRole,
  updateEvent,
  updateGame,
  updateGamesInteractiveTool,
  updateGeneralInfos,
  updateMember,
  updateMemberOptionalField,
  updateMembershipTermsAndConditions,
  updateOption,
  updatePartner,
  updatePlayer,
  updateRosterPlayer,
  updateRoster,
  updatePersonInfos,
  updatePlayerAcceptation,
  updateTeamPlayerAcceptation,
  updatePractice,
  updatePracticeRsvp,
  updatePreRanking,
  updateRegistration,
  updateRosterRole,
  updateSuggestionStatus,
  updateTeamAcceptation,
  validateEmailIsUnique,
};
