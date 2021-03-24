const {
  ENTITIES_ROLE_ENUM,
  INVOICE_STATUS_ENUM,
  STATUS_ENUM,
  REJECTION_ENUM,
  NOTIFICATION_TYPE,
  GLOBAL_ENUM,
  ROSTER_ROLE_ENUM,
  ROUTES_ENUM,
  TABS_ENUM,
} = require('../../../../common/enums');
const { ERROR_ENUM } = require('../../../../common/errors');
const moment = require('moment');
const { signS3Request } = require('../../server/utils/aws');

const {
  acceptScoreSuggestion: acceptScoreSuggestionHelper,
  addAlias: addAliasHelper,
  addEntity: addEntityHelper,
  addEntityRole: addEntityRoleHelper,
  addEventCartItem,
  addField: addFieldHelper,
  addGame: addGameHelper,
  addGameAttendances: addGameAttendancesHelper,
  addMember: addMemberHelper,
  addMemberManually: addMemberManuallyHelper,
  addMembership: addMembershipHelper,
  addOption: addOptionHelper,
  addPersonToEvent: addPersonToEventHelper,
  addPhase: addPhaseHelper,
  addPlayerToRoster: addPlayerToRosterHelper,
  addPlayerCartItem: addPlayerCartItemHelper,
  addReport: addReportHelper,
  addRoster: addRosterHelper,
  addScoreSuggestion: addScoreSuggestionHelper,
  addSpiritSubmission: addSpiritSubmissionHelper,
  addTeamToEvent: addTeamToEventHelper,
  addTimeSlot: addTimeSlotHelper,
  cancelRosterInviteToken: cancelRosterInviteTokenHelper,
  canRemovePlayerFromRoster: canRemovePlayerFromRosterHelper,
  canUnregisterTeam: canUnregisterTeamHelper,
  deleteEntity: deleteEntityHelper,
  deleteEntityMembership: deleteEntityMembershipHelper,
  deleteGame: deleteGameHelper,
  deleteMembership: deleteMembershipHelper,
  deleteOption: deleteOptionHelper,
  deletePersonFromEvent,
  deletePlayerFromRoster: deletePlayerFromRosterHelper,
  deleteReport: deleteReportHelper,
  eventInfos: eventInfosHelper,
  generateReport: generateReportHelper,
  getAlias: getAliasHelper,
  getAllEntities: getAllEntitiesHelper,
  getAllForYouPagePosts: getAllForYouPagePostsHelper,
  getAllOwnedEntities: getAllOwnedEntitiesHelper,
  getAllPeopleRegisteredInfos: getAllPeopleRegisteredInfosHelper,
  getAllPlayersAcceptedRegistered: getAllPlayersAcceptedRegisteredHelper,
  getAllRolesEntity: getAllRolesEntityHelper,
  getAllTeamsAcceptedRegistered: getAllTeamsAcceptedRegisteredHelper,
  getAllTeamsRegisteredInfos: getAllTeamsRegisteredInfosHelper,
  getAllTeamsAcceptedInfos: getAllTeamsAcceptedInfosHelper,
  getAllTypeEntities: getAllTypeEntitiesHelper,
  getEntitiesTypeById: getEntitiesTypeByIdHelper,
  getCreatorsEmails,
  getTeamCreatorEmail,
  getEmailPerson,
  getTeamPaymentOptionFromRosterId,
  getPersonPaymentOption,
  getEntity: getEntityHelper,
  getEntityRole: getEntityRoleHelper,
  getEvent: getEventHelper,
  getEventAdmins: getEventAdminsHelper,
  getFields: getFieldsHelper,
  getGamePlayersWithRole,
  getGameInfo: getGameInfoHelper,
  getGames: getGamesHelper,
  getGameSubmissionInfos: getGameSubmissionInfosHelper,
  getGeneralInfos: getGeneralInfosHelper,
  getGraphUserCount: getGraphUserCountHelper,
  getAllTeamsPending: getAllTeamsPendingHelper,
  getAllTeamsRefused: getAllTeamsRefusedHelper,
  getAllPlayersPending: getAllPlayersPendingHelper,
  getAllPlayersRefused: getAllPlayersRefusedHelper,
  getMembers: getMembersHelper,
  getMembership,
  getMemberships: getMembershipsHelper,
  getMyPersonsAdminsOfTeam: getMyPersonsAdminsOfTeamHelper,
  getOptions: getOptionsHelper,
  getOrganizationMembers: getOrganizationMembersHelper,
  getOwnedEvents: getOwnedEventsHelper,
  getOwnerStripePrice,
  getPersonGames: getPersonGamesHelper,
  getTeamGamesInfos: getTeamGamesInfosHelper,
  getPersonInfos: getPersonInfosHelper,
  getPersonInvoiceItem,
  getPhasesWithoutPrerank: getPhasesWithoutPrerankHelper,
  getPhasesGameAndTeams: getPhasesGameAndTeamsHelper,
  getPlayerInvoiceItem: getPlayerInvoiceItemHelper,
  getPrimaryPerson: getPrimaryPersonHelper,
  getPreranking: getPrerankingHelper,
  getRegistered: getRegisteredHelper,
  getRegisteredPersons,
  getRegistrationIndividualPaymentOption: getRegistrationIndividualPaymentOptionHelper,
  getRegistrationStatus,
  getRegistrationTeamPaymentOption: getRegistrationTeamPaymentOptionHelper,
  getRemainingSpots: getRemainingSpotsHelper,
  getReports: getReportsHelper,
  getRole,
  getRoster: getRosterHelper,
  getRosterEventInfos,
  getEventIdFromRosterId,
  getRosterIdFromInviteToken,
  getRosterInviteToken: getRosterInviteTokenHelper,
  getRosterInvoiceItem,
  getRostersNames: getRostersNamesHelper,
  getScoreSuggestion: getScoreSuggestionHelper,
  getSlots: getSlotsHelper,
  getTeamGames: getTeamGamesHelper,
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
  updateTeamAcceptation: updateTeamAcceptationHelper,
  updatePlayerAcceptation: updatePlayerAcceptationHelper,
  updateOption: updateOptionHelper,
  updatePersonInfosHelper,
  updatePlayerPaymentStatus: updatePlayerPaymentStatusHelper,
  updatePreRanking: updatePreRankingHelper,
  updateRegistration: updateRegistrationHelper,
  updateRegistrationPerson: updateRegistrationPersonHelper,
  updateRosterRole: updateRosterRoleHelper,
  updateSuggestionStatus: updateSuggestionStatusHelper,
  getTeamIdFromRosterId,
} = require('../helpers/entity');
const { createRefund } = require('../helpers/stripe/checkout');
const {
  sendTeamRegistrationEmailToAdmin,
  sendPersonRegistrationEmailToAdmin,
  sendPersonPendingRegistrationEmailToAdmin,
  sendPersonRegistrationEmail,
  sendPersonRefusedRegistrationEmail,
  sendTeamAcceptedRegistrationEmail,
  sendTeamUnregisteredEmail,
  sendTeamRefusedRegistrationEmail,
  sendTeamPendingRegistrationEmailToAdmin,
  sendImportMemberEmail,
  sendImportMemberNonExistingEmail,
  sendCartItemAddedPlayerEmail,
} = require('../../server/utils/nodeMailer');
const { addMembershipCartItem } = require('../helpers/shop');
const {
  getLanguageFromEmail,
  validateEmailIsUnique: validateEmailIsUniqueHelper,
  generateMemberImportToken,
  getUserIdFromEmail,
} = require('../helpers');
const { sendNotification } = require('./notifications');
const { formatLinkWithAuthToken } = require('../emails/utils');
const {
  formatRoute,
} = require('../../../../common/utils/stringFormat');

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
  if (res.basicInfos.type === GLOBAL_ENUM.TEAM) {
    res.gamesInfos = await getTeamGamesInfosHelper(id);
  }

  return res;
}

async function getAllEntities(params) {
  return getAllEntitiesHelper(params);
}

async function getAllForYouPagePosts() {
  return getAllForYouPagePostsHelper();
}

async function getScoreSuggestion(gameId) {
  return getScoreSuggestionHelper(gameId);
}

async function getAllOwnedEntities(type, userId, querry, onlyAdmin) {
  return getAllOwnedEntitiesHelper(type, userId, querry, onlyAdmin);
}

async function getOwnedEvents(organizationId) {
  return getOwnedEventsHelper(organizationId);
}

async function getAllTypeEntities(type) {
  return getAllTypeEntitiesHelper(type);
}

async function getEntitiesTypeById(id) {
  return getEntitiesTypeByIdHelper(id);
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

async function getAllTeamsRegisteredInfos(eventId, userId) {
  return getAllTeamsRegisteredInfosHelper(eventId, userId);
}
async function getAllTeamsAcceptedInfos(eventId, userId) {
  return getAllTeamsAcceptedInfosHelper(eventId, userId);
}
async function getAllPeopleRegisteredInfos(eventId, userId) {
  return getAllPeopleRegisteredInfosHelper(eventId, userId);
}

async function getAllTeamsAcceptedRegistered(eventId) {
  return getAllTeamsAcceptedRegisteredHelper(eventId);
}
async function getAllPlayersAcceptedRegistered(eventId) {
  return getAllPlayersAcceptedRegisteredHelper(eventId);
}

async function getRemainingSpots(eventId) {
  return getRemainingSpotsHelper(eventId);
}

async function getPreranking(eventId) {
  return getPrerankingHelper(eventId);
}
async function getPrimaryPerson(userId) {
  return getPrimaryPersonHelper(userId);
}

async function getRoster(rosterId, withSub) {
  return getRosterHelper(rosterId, withSub);
}

async function getRosterAllIncluded(rosterId, userId, withSub) {
  const players = getRoster(rosterId, withSub);
  const role = getRole(rosterId, userId);

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
  return getPhasesWithoutPrerankHelper(eventId);
}

async function getGameInfo(gameId) {
  return getGameInfoHelper(gameId);
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

async function getGraphUserCount() {
  return getGraphUserCountHelper();
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

async function getPersonInfos(entityId) {
  return getPersonInfosHelper(entityId);
}

async function getRegistrationTeamPaymentOption(paymentOptionId) {
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
  if (
    !(await isAllowed(eventId, userId, ENTITIES_ROLE_ENUM.EDITOR))
  ) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }
  return updateEventHelper(
    eventId,
    maximumSpots,
    startDate,
    endDate,
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
  if ((await getRemainingSpotsHelper(eventId)) < 1) {
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

  const email = await getTeamCreatorEmail(teamId);
  const creatorEmails = await getCreatorsEmails(eventId);

  if (registrationStatus === STATUS_ENUM.PENDING) {
    creatorEmails.map(async email => {
      const language = await getLanguageFromEmail(email);
      sendTeamPendingRegistrationEmailToAdmin({
        email,
        team,
        event,
        language,
        placesLeft: await getRemainingSpotsHelper(event.id),
        userId,
      });
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
    const language = await getLanguageFromEmail(email);
    sendTeamAcceptedRegistrationEmail({
      language,
      team,
      event,
      email,
      isFreeOption,
      userId,
    });

    creatorEmails.map(async email => {
      const language = await getLanguageFromEmail(email);
      sendTeamRegistrationEmailToAdmin({
        email,
        team,
        event,
        language,
        placesLeft: await getRemainingSpotsHelper(event.id),
        userId,
      });
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
  if ((await getRemainingSpotsHelper(eventId)) < 1) {
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
  await addRosterHelper(rosterId, roster);

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
  if (remainingSpots && remainingSpots < persons.length) {
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

      const email = await getEmailPerson(person.id);
      const language = await getLanguageFromEmail(email);
      if (registrationStatus === STATUS_ENUM.PENDING) {
        const creatorEmails = await getCreatorsEmails(eventId);
        await Promise.all(
          creatorEmails.map(async email => {
            const language = await getLanguageFromEmail(email);
            sendPersonPendingRegistrationEmailToAdmin({
              email,
              person,
              event,
              language,
              placesLeft: remainingSpots,
              userId,
            });
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
        //send mail to person
        await sendPersonRegistrationEmail({
          email,
          person,
          event,
          language,
          isFreeOption,
          userId,
        });
        // send mail to organization admin
        const creatorEmails = await getCreatorsEmails(eventId);
        await Promise.all(
          creatorEmails.map(async email => {
            const language = await getLanguageFromEmail(email);
            sendPersonRegistrationEmailToAdmin({
              email,
              person,
              event,
              language,
              placesLeft: remainingSpots,
              userId,
            });
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
  const { rosterId, playerId, role } = body;
  const { eventId } = await getRosterEventInfos(rosterId);
  const userRole = await getRole(rosterId, userId);
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
  const email = await getTeamCreatorEmail(teamId);
  const language = await getLanguageFromEmail(email);
  const userId = await getUserIdFromEmail(email);

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

    sendTeamAcceptedRegistrationEmail({
      email,
      team,
      event,
      language,
      isFreeOption: false,
      userId,
    });
  }

  if (registrationStatus === STATUS_ENUM.REFUSED) {
    sendTeamRefusedRegistrationEmail({
      email,
      team,
      event,
      language,
    });
  }
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

  const email = await getEmailPerson(personId);
  const language = await getLanguageFromEmail(email);
  const userId = await getUserIdFromEmail(email);

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

    sendPersonRegistrationEmail({
      email,
      person,
      event,
      language,
      isFreeOption: false,
      userId,
    });
  }
  if (registrationStatus === STATUS_ENUM.ACCEPTED_FREE) {
    sendPersonRegistrationEmail({
      email,
      person,
      event,
      language,
      isFreeOption: true,
      userId,
    });
  }
  if (registrationStatus === STATUS_ENUM.REFUSED) {
    sendPersonRefusedRegistrationEmail({
      email,
      person,
      event,
      language,
    });
  }
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

  return await updateSuggestionStatusHelper(body);
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
      token = await generateMemberImportToken(
        organizationId,
        m.expirationDate,
        membershipType,
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
        sendImportMemberEmail({
          email: m.email,
          token,
          language,
          organizationName: organization.basicInfos.name,
          userId,
        });
      }
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

async function getRostersNames(rosterArray) {
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

      // send notifications to event admins in case of score conflict
      if (res.conflict) {
        const conflictNotif = {
          type: NOTIFICATION_TYPE.SCORE_SUBMISSION_CONFLICT,
          entity_photo: event_id,
        };
        const conflictMetadata = {
          eventId: event_id,
          eventName: event_name,
          gameId: body.game_id,
        };

        const adminsUserIds = await getEventAdminsHelper(event_id);
        adminsUserIds.forEach(adminUserId => {
          sendNotification({
            ...conflictNotif,
            user_id: adminUserId,
            metadata: conflictMetadata,
          });
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
    name,
    ownerId,
    playerAcceptation,
    playerPrice,
    startTime,
    taxRatesId,
    teamAcceptation,
    teamActivity,
    teamPrice,
    informations,
  } = body;
  if (
    !(await isAllowed(eventId, userId, ENTITIES_ROLE_ENUM.EDITOR))
  ) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }
  const res = await addOptionHelper(
    endTime,
    eventId,
    name,
    ownerId,
    playerAcceptation,
    playerPrice,
    startTime,
    taxRatesId,
    teamAcceptation,
    teamActivity,
    teamPrice,
    informations,
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

        const email = await getTeamCreatorEmail(teamId);
        const language = await getLanguageFromEmail(email);
        const captainUserId = await getUserIdFromEmail(email);

        const team = (await getEntity(teamId, captainUserId))
          .basicInfos;
        const event = (await getEntity(eventId)).basicInfos;

        sendTeamUnregisteredEmail({
          language,
          email,
          team,
          event,
          status,
          userId: captainUserId,
        });
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

const unregisterPeople = async (body, userId) => {
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
  const { personId, role, isSub, rosterId } = body;
  const eventId = await getEventIdFromRosterId(rosterId);
  const teamId = await getTeamIdFromRosterId(rosterId);
  const team = (await getEntity(teamId, userId)).basicInfos;
  const playerUserId = await getUserIdFromPersonId(personId);

  const { name, surname } = await getPersonInfos(personId);

  const roster = await getRosterEventInfos(rosterId);
  const individualOption = await getRegistrationIndividualPaymentOptionHelper(
    roster.paymentOptionId,
  );
  const res = await addPlayerToRosterHelper({
    name: name + ' ' + surname,
    role,
    isSub,
    personId,
    rosterId,
    individualOption,
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
  const notif = {
    user_id: playerUserId,
    type: NOTIFICATION_TYPE.ADDED_TO_ROSTER,
    entity_photo: eventId || team.Id,
    metadata: { eventId, teamName: team.name },
  };

  const buttonLink = await formatLinkWithAuthToken(
    playerUserId,
    formatRoute(
      ROUTES_ENUM.entity,
      { id: eventId },
      { tab: TABS_ENUM.ROSTERS },
    ),
  );

  const emailInfos = {
    type: NOTIFICATION_TYPE.ADDED_TO_ROSTER,
    eventId,
    teamName: team.name,
    name,
    buttonLink,
  };

  sendNotification(notif, emailInfos);
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

module.exports = {
  acceptScoreSuggestion,
  acceptScoreSuggestion,
  addAlias,
  addEntity,
  addEntityRole,
  addField,
  addGame,
  addGameAttendances,
  addMember,
  addMemberManually,
  addMembership,
  addOption,
  addPersonToEvent,
  addPhase,
  addPlayerToRoster,
  addPlayersCartItems,
  addReport,
  addScoreSuggestion,
  addSpiritSubmission,
  addTeamToEvent,
  addTeamAsAdmin,
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
  deleteGame,
  deleteMembership,
  deleteOption,
  deletePlayerFromRoster,
  deleteReport,
  eventInfos,
  eventInfos,
  generateReport,
  getAlias,
  getAllTeamsAcceptedRegistered,
  getAllPlayersAcceptedRegistered,
  getAllEntities,
  getAllForYouPagePosts,
  getAllOwnedEntities,
  getAllPeopleRegisteredInfos,
  getAllRolesEntity,
  getAllTeamsRegisteredInfos,
  getAllTeamsAcceptedInfos,
  getAllTypeEntities,
  getEntitiesTypeById,
  getEntity,
  getEvent,
  getFields,
  getGameInfo,
  getGames,
  getGameSubmissionInfos,
  getGeneralInfos,
  getGraphUserCount,
  getAllTeamsPendingAndRefused,
  getAllPlayersPendingAndRefused,
  getInteractiveToolData,
  getMembers,
  getMemberships,
  getNewRosterInviteToken,
  getOptions,
  getOrganizationMembers,
  getOwnedEvents,
  getPersonInfos,
  getPhases,
  getPhasesGameAndTeams,
  getPossibleSubmissionerInfos,
  getPrimaryPerson,
  getPreranking,
  getRegistered,
  getRemainingSpots,
  getReports,
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
  getSlots,
  getTeamGames,
  getTeamsSchedule,
  hasMemberships,
  importMembers,
  isAllowed,
  setGameScore,
  unregisterTeams,
  unregisterPeople,
  updateAlias,
  updateEntity,
  updateEntityRole,
  updateEvent,
  updateGame,
  updateGamesInteractiveTool,
  updateGeneralInfos,
  updateTeamAcceptation,
  updatePlayerAcceptation,
  updateMember,
  updateOption,
  updatePersonInfos,
  updatePreRanking,
  updateRegistration,
  updateRosterRole,
  updateSuggestionStatus,
  validateEmailIsUnique,
};
