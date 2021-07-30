const Router = require('koa-router');
const queries = require('../../../db/queries/entity');
const { STATUS_ENUM } = require('../../../../../common/enums');
const {
  ERROR_ENUM,
  errors,
} = require('../../../../../common/errors');
const {
  InteractiveToolController,
} = require('../../../../../controllers/interactiveToolController');
const {
  PhaseController,
} = require('../../../../../controllers/phaseController');
const {
  PhaseRankingController,
} = require('../../../../../controllers/phaseRankingController');

const router = new Router();
const BASE_URL = '/api/entity';

router.get(`${BASE_URL}/graphAmountGeneratedByEvent`, async ctx => {
  const arrayGraph = await queries.getGraphAmountGeneratedByEvent(
    ctx.query.eventPaymentId,
    ctx.query.language,
    ctx.query.date,
  );

  if (!arrayGraph) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: arrayGraph };
});

router.get(`${BASE_URL}/graphUserCount`, async ctx => {
  const arrayGraph = await queries.getGraphUserCount(
    ctx.query.date,
    ctx.query.language,
  );

  if (!arrayGraph) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: arrayGraph };
});

router.get(`${BASE_URL}/graphMemberCount`, async ctx => {
  const arrayGraph = await queries.getGraphMemberCount(
    ctx.query.organizationId,
    ctx.query.date,
  );

  if (!arrayGraph) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: arrayGraph };
});

router.get(`${BASE_URL}/all`, async ctx => {
  const entity = await queries.getAllEntities(ctx.query);

  if (!entity) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: entity };
});

router.get(`${BASE_URL}/role`, async ctx => {
  const role = await queries.getRole(
    ctx.query.entityId,
    ctx.body.userInfo.id,
  );

  if (!role) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: role };
});

router.get(`${BASE_URL}/forYouPage`, async ctx => {
  const entity = await queries.getAllForYouPagePosts(ctx.query);

  if (!entity) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: entity };
});

router.get(`${BASE_URL}/canUnregisterTeamsList`, async ctx => {
  const res = await queries.canUnregisterTeamsList(
    ctx.query.rosterIds,
    ctx.query.eventId,
  );

  if (!res) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: res };
});

router.get(`${BASE_URL}/getPossibleSubmissionerInfos`, async ctx => {
  const res = await queries.getPossibleSubmissionerInfos(
    ctx.query.gameId,
    ctx.query.teamsIds,
    ctx.body.userInfo.id,
  );

  if (res === ERROR_ENUM.ACCESS_DENIED) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  } else if (!res) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: res };
});

router.get(`${BASE_URL}/scoreSuggestion`, async ctx => {
  const suggestion = await queries.getScoreSuggestion(
    ctx.query.gameId,
  );

  if (!suggestion) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: suggestion };
});

router.get(`${BASE_URL}/allOwned`, async ctx => {
  const entity = await queries.getAllOwnedEntities(
    ctx.query.type,
    ctx.body.userInfo.id,
    '',
    ctx.query.onlyAdmin,
  );

  if (!entity) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: entity };
});

router.get(`${BASE_URL}/phaseRanking`, async ctx => {
  const phaseRankings = await PhaseRankingController.getPhaseRanking(
    ctx.query.phaseId,
  );

  if (!phaseRankings) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: phaseRankings };
});

router.get(`${BASE_URL}/roles`, async ctx => {
  const entity = await queries.getAllRolesEntity(ctx.query.id);

  if (entity) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: entity };
});

router.get(`${BASE_URL}/members`, async ctx => {
  const entity = await queries.getMembers(
    ctx.query.personId,
    ctx.query.organizationId,
  );

  if (!entity) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: entity };
});

router.get(`${BASE_URL}/recentMember`, async ctx => {
  const member = await queries.getMostRecentMember(
    ctx.query.organizationId,
    ctx.body.userInfo.id,
  );

  if (!member) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: member };
});

router.get(`${BASE_URL}/playerSessionEvaluation`, async ctx => {
  const evaluation = await queries.getPlayerSessionEvaluation(
    ctx.query.exerciseId,
    ctx.query.sessionId,
    ctx.body.userInfo.id,
  );

  if (!evaluation) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: evaluation };
});

router.get(`${BASE_URL}/coachSessionEvaluation`, async ctx => {
  const evaluation = await queries.getCoachSessionEvaluation(
    ctx.query.exerciseId,
    ctx.query.sessionId,
    ctx.body.userInfo.id,
  );

  if (!evaluation) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: evaluation };
});

router.get(`${BASE_URL}/isTeamCoach`, async ctx => {
  const role = await queries.getIsTeamCoach(
    ctx.query.teamId,
    ctx.body.userInfo.id,
  );

  if (!role && role != false) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: role };
});

router.get(`${BASE_URL}/images`, async ctx => {
  const images = await queries.getImages(ctx.query.type);

  if (!images) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: images };
});

router.get(`${BASE_URL}/reports`, async ctx => {
  const reports = await queries.getReports(ctx.query.id);

  if (!reports) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: reports };
});

router.get(`${BASE_URL}/hasMemberships`, async ctx => {
  const entity = await queries.hasMemberships(
    ctx.query.organizationId,
  );
  if (!entity && entity != false) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: entity };
});

router.get(`${BASE_URL}/organizationTokenPromoCode`, async ctx => {
  const entity = await queries.getOrganizationTokenPromoCode(
    ctx.query.id,
    ctx.body.userInfo.id,
  );
  if (!entity) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: entity };
});

router.get(`${BASE_URL}/memberships`, async ctx => {
  const entity = await queries.getMemberships(ctx.query.id);

  if (!entity) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: entity };
});
router.get(`${BASE_URL}/partners`, async ctx => {
  const partners = await queries.getPartners(ctx.query.id);

  if (!partners) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: partners };
});

router.get(`${BASE_URL}/primaryPerson`, async ctx => {
  const entity = await queries.getPrimaryPerson(ctx.body.userInfo.id);

  if (!entity) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: entity };
});

router.get(`${BASE_URL}/registered`, async ctx => {
  const entity = await queries.getRegistered(
    ctx.query.team_id,
    ctx.query.event_id,
  );

  if (!entity) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: entity };
});

router.get(`${BASE_URL}/allTeamsAcceptedRegistered`, async ctx => {
  const acceptedRegistration = await queries.getAllTeamsAcceptedRegistered(
    ctx.query.eventId,
  );

  if (!acceptedRegistration) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: acceptedRegistration };
});

router.get(`${BASE_URL}/allPlayersAcceptedRegistered`, async ctx => {
  const acceptedRegistration = await queries.getAllPlayersAcceptedRegistered(
    ctx.query.eventId,
  );

  if (!acceptedRegistration) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: acceptedRegistration };
});

router.get(`${BASE_URL}/event`, async ctx => {
  const event = await queries.getEvent(ctx.query.eventId);

  if (!event) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: event };
});

router.get(`${BASE_URL}/generalInfos`, async ctx => {
  const infos = await queries.getGeneralInfos(ctx.query.entityId);

  if (!infos) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: infos };
});

router.get(`${BASE_URL}/uniqueEmail`, async ctx => {
  const email = await queries.validateEmailIsUnique(ctx.query.email);

  if (!email) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: email };
});

router.get(`${BASE_URL}/personInfos`, async ctx => {
  const infos = await queries.getPersonInfos(ctx.query.entityId);

  if (!infos) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: infos };
});

router.get(`${BASE_URL}/teamsPendingAndRefused`, async ctx => {
  const teams = await queries.getAllTeamsPendingAndRefused(
    ctx.query.eventId,
  );

  if (!teams) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: teams };
});

router.get(`${BASE_URL}/playersPendingAndRefused`, async ctx => {
  const players = await queries.getAllPlayersPendingAndRefused(
    ctx.query.eventId,
  );

  if (!players) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: players };
});

router.get(`${BASE_URL}/teamPlayersPending`, async ctx => {
  const players = await queries.getAllTeamPlayersPending(
    ctx.query.teamId,
  );

  if (!players) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: players };
});

router.get(`${BASE_URL}/myTeamPlayersRequest`, async ctx => {
  const players = await queries.getMyTeamPlayersRequest(
    ctx.query.teamId,
    ctx.body.userInfo.id,
  );

  if (!players) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: players };
});

router.get(`${BASE_URL}/person`, async ctx => {
  const infos = await queries.getGeneralInfos(ctx.query.entityId);

  if (!infos) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: infos };
});

router.get(`${BASE_URL}/s3Signature`, async ctx => {
  const data = await queries.getS3Signature(
    ctx.body.userInfo.id,
    ctx.query.fileType,
  );

  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.get(`${BASE_URL}/interactiveTool`, async ctx => {
  const data = await queries.getInteractiveToolData(
    ctx.query.eventId,
    ctx.body.userInfo.id,
  );

  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.get(`${BASE_URL}/gameSubmissionInfos`, async ctx => {
  const data = await queries.getGameSubmissionInfos(
    ctx.query.gameId,
    ctx.query.rosterId,
    ctx.query.eventId,
  );
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.get(`${BASE_URL}/prerankPhase`, async ctx => {
  const data = await PhaseController.getPrerankPhase(
    ctx.query.eventId,
    ctx.body.userInfo.id,
  );
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.get(`${BASE_URL}/myRosters`, async ctx => {
  const data = await queries.getMyRosterIds(
    ctx.query.eventId,
    ctx.body.userInfo.id,
  );
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.get(`${BASE_URL}/rosterFromInviteToken`, async ctx => {
  const roster = await queries.getRosterFromInviteToken(
    ctx.query.token,
    ctx.body.userInfo.id,
  );
  if (!roster) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: roster };
});

router.get(`${BASE_URL}/rosterInviteToken`, async ctx => {
  const token = await queries.getRosterInviteToken(
    ctx.body.userInfo.id,
    ctx.query.rosterId,
  );
  if (!token) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: token };
});

router.get(`${BASE_URL}/newRosterInviteToken`, async ctx => {
  const token = await queries.getNewRosterInviteToken(
    ctx.body.userInfo.id,
    ctx.query.rosterId,
  );
  if (!token) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: token };
});

router.put(`${BASE_URL}`, async ctx => {
  const entity = await queries.updateEntity(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  if (!entity) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: entity };
});

router.put(`${BASE_URL}/practice`, async ctx => {
  const entity = await queries.updatePractice(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (!entity) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: entity };
});

router.put(`${BASE_URL}/practiceRsvp`, async ctx => {
  const entity = await queries.updatePracticeRsvp(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (!entity) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: entity };
});

router.put(`${BASE_URL}/updateGamesInteractiveTool`, async ctx => {
  const res = await queries.updateGamesInteractiveTool(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (!res) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: res };
});

router.put(`${BASE_URL}/role`, async ctx => {
  const entity = await queries.updateEntityRole(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  if (!entity) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: entity };
});

router.put(`${BASE_URL}/rosterRole`, async ctx => {
  const res = await queries.updateRosterRole(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (!res) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: res };
});

router.put(`${BASE_URL}/member`, async ctx => {
  const entity = await queries.updateMember(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  if (!entity) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: entity };
});

router.put(`${BASE_URL}/teamAcceptation`, async ctx => {
  const team = await queries.updateTeamAcceptation(ctx.request.body);

  if (!team) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: team };
});

router.put(`${BASE_URL}/playerAcceptation`, async ctx => {
  const team = await queries.updatePlayerAcceptation(
    ctx.request.body,
  );

  if (!team) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: team };
});

router.put(`${BASE_URL}/teamPlayerAcceptation`, async ctx => {
  const player = await queries.updateTeamPlayerAcceptation(
    ctx.request.body,
  );

  if (!player) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: player };
});

router.put(`${BASE_URL}/alias`, async ctx => {
  const entity = await queries.updateAlias(ctx.request.body);

  if (!entity) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: entity };
});

router.put(`${BASE_URL}/game`, async ctx => {
  const entity = await queries.updateGame(ctx.request.body);

  if (!entity) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: entity };
});

router.put(`${BASE_URL}/updateSuggestionStatus`, async ctx => {
  const suggestion = await queries.updateSuggestionStatus(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (!suggestion) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: suggestion };
});

router.put(`${BASE_URL}/updateRegistration`, async ctx => {
  const entity = await queries.updateRegistration(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (!entity) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: entity };
});

router.put(`${BASE_URL}/updateEvent`, async ctx => {
  const entity = await queries.updateEvent(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (!entity) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: entity };
});

router.put(`${BASE_URL}/updatePreRanking`, async ctx => {
  const entity = await queries.updatePreRanking(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (!entity) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: entity };
});

router.put(`${BASE_URL}/updatePhase`, async ctx => {
  const entity = await PhaseController.updatePhase(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (!entity) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: entity };
});

router.put(`${BASE_URL}/updatePhaseOrder`, async ctx => {
  const entity = await PhaseController.updatePhaseOrder(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (!entity) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: entity };
});

router.put(`${BASE_URL}/updateTeamPhase`, async ctx => {
  const entity = await PhaseRankingController.updateTeamPhase(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (!entity) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: entity };
});

router.put(`${BASE_URL}/teamPhase`, async ctx => {
  const res = await PhaseRankingController.deleteTeamPhase(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (!res) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: res };
});

router.put(`${BASE_URL}/updateInitialPositionPhase`, async ctx => {
  const entity = await PhaseRankingController.updateInitialPositionPhase(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (!entity) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: entity };
});

router.put(`${BASE_URL}/finalPositionPhase`, async ctx => {
  const entity = await PhaseRankingController.updateFinalPositionPhase(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (!entity) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: entity };
});

router.put(`${BASE_URL}/originPhase`, async ctx => {
  const entity = await PhaseRankingController.updateOriginPhase(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (!entity) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: entity };
});

router.put(`${BASE_URL}/updateGeneralInfos`, async ctx => {
  const entity = await queries.updateGeneralInfos(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  if (!entity) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: entity };
});

router.put(`${BASE_URL}/hasSpirit`, async ctx => {
  const roster = await queries.updateHasSpirit(
    ctx.request.body.eventId,
    ctx.request.body.hasSpirit,
    ctx.body.userInfo.id,
  );

  if (!roster) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: roster };
});

router.put(`${BASE_URL}/updatePersonInfos`, async ctx => {
  const personInfos = await queries.updatePersonInfos(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (!personInfos) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: personInfos };
});

router.put(`${BASE_URL}/updateOption`, async ctx => {
  const option = await queries.updateOption(ctx.request.body);

  if (!option) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: option };
});

router.put(
  `${BASE_URL}/updateMembershipTermsAndConditions`,
  async ctx => {
    const membership = await queries.updateMembershipTermsAndConditions(
      ctx.request.body,
    );

    if (!membership) {
      throw new Error(ERROR_ENUM.ERROR_OCCURED);
    }
    ctx.body = { data: membership };
  },
);

router.put(`${BASE_URL}/memberOptionalField`, async ctx => {
  const entity = await queries.updateMemberOptionalField(
    ctx.request.body,
  );

  if (!entity) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: entity };
});

router.put(`${BASE_URL}/partner`, async ctx => {
  const partner = await queries.updatePartner(ctx.request.body);

  if (!partner) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: partner };
});

router.put(`${BASE_URL}/player`, async ctx => {
  const player = await queries.updatePlayer(ctx.request.body);

  if (!player) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: player };
});

router.put(`${BASE_URL}/rosterPlayer`, async ctx => {
  const player = await queries.updateRosterPlayer(ctx.request.body);

  if (!player) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: player };
});

router.put(`${BASE_URL}/roster`, async ctx => {
  const roster = await queries.updateRoster(ctx.request.body);

  if (!roster) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: roster };
});

router.put(`${BASE_URL}/field`, async ctx => {
  const field = await queries.updateField(ctx.request.body);
  if (!field) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: field };
});

router.put(`${BASE_URL}/timeslot`, async ctx => {
  const timeslot = await queries.updateTimeslot(ctx.request.body);
  if (!timeslot) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: timeslot };
});

router.post(BASE_URL, async ctx => {
  const entityId = await queries.addEntity(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (!entityId) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: entityId };
});

router.post(`${BASE_URL}/partner`, async ctx => {
  const partner = await queries.addPartner(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (!partner) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: partner };
});

router.get(`${BASE_URL}/getTeamCoachedByUser`, async ctx => {
  const teams = await queries.getTeamCoachedByUser(
    ctx.query.personId,
  );

  if (!teams) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: teams };
});

router.get(`${BASE_URL}/getAllTeamGames`, async ctx => {
  const games = await queries.getAllTeamGames(ctx.query.teamId);

  if (!games) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: games };
});

router.get(`${BASE_URL}/getAllTeamPractices`, async ctx => {
  const practices = await queries.getAllTeamPractices(
    ctx.query.teamId,
  );

  if (!practices) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: practices };
});

router.get(`${BASE_URL}/getAllExercises`, async ctx => {
  const exercises = await queries.getAllExercises();

  if (!exercises) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: exercises };
});

router.post(`${BASE_URL}/unregisterTeams`, async ctx => {
  const res = await queries.unregisterTeams(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (!res) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: res };
});

router.post(`${BASE_URL}/unregisterPeople`, async ctx => {
  const res = await queries.unregisterPeople(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (!res) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: res };
});

router.post(`${BASE_URL}/role`, async ctx => {
  const entity = await queries.addEntityRole(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (!entity) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: entity };
});

router.post(`${BASE_URL}/member`, async ctx => {
  const entity = await queries.addMember(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (!entity) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: entity };
});

router.post(`${BASE_URL}/report`, async ctx => {
  const report = await queries.addReport(ctx.request.body);

  if (!report) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: report };
});

router.post(`${BASE_URL}/importMembers`, async ctx => {
  const members = await queries.importMembers(ctx.request.body);

  if (!members) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: members };
});

router.post(`${BASE_URL}/memberDonation`, async ctx => {
  const donation = await queries.addMemberDonation(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (!donation) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: donation };
});

router.post(`${BASE_URL}/memberManually`, async ctx => {
  const entity = await queries.addMemberManually(ctx.request.body);

  if (!entity) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: entity };
});

router.post(`${BASE_URL}/addAllInteractiveTool`, async ctx => {
  const res = await InteractiveToolController.addAll(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (res) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: res };
});

router.post(`${BASE_URL}/exercise`, async ctx => {
  const exercise = await queries.addExercise(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (!exercise) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: exercise };
});

router.post(`${BASE_URL}/game`, async ctx => {
  const game = await queries.addGame(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (!game) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: game };
});

router.post(`${BASE_URL}/practice`, async ctx => {
  const game = await queries.addPractice(ctx.request.body);

  if (!game) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: game };
});

router.post(`${BASE_URL}/gameScore`, async ctx => {
  const game = await queries.setGameScore(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (!game) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: game };
});

router.post(`${BASE_URL}/suggestScore`, async ctx => {
  const game = await queries.addScoreSuggestion(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  if (!game) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: game };
});

router.post(`${BASE_URL}/acceptScore`, async ctx => {
  const res = await queries.acceptScoreSuggestion(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  if (!res) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: res };
});

router.post(`${BASE_URL}/spirit`, async ctx => {
  const res = await queries.addSpiritSubmission(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  if (!res) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: res };
});

router.post(`${BASE_URL}/gameAttendances`, async ctx => {
  const res = await queries.addGameAttendances(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  if (!res) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: res };
});

router.post(`${BASE_URL}/field`, async ctx => {
  const field = await queries.addField(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (!field) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: field };
});

router.post(`${BASE_URL}/phase`, async ctx => {
  const phase = await PhaseController.addPhase(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (!phase) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: phase };
});

router.post(`${BASE_URL}/timeSlots`, async ctx => {
  const slots = await queries.addTimeSlot(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (!slots) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: slots };
});

router.post(`${BASE_URL}/option`, async ctx => {
  const option = await queries.addOption(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (!option) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: option };
});

router.post(`${BASE_URL}/membership`, async ctx => {
  const entity = await queries.addMembership(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (!entity) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: entity };
});

router.post(`${BASE_URL}/players`, async ctx => {
  const players = await queries.addPlayersToTeam(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (!players) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: players };
});

router.post(`${BASE_URL}/joinTeam`, async ctx => {
  const player = await queries.sendRequestToJoinTeam(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (!player) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: player };
});

router.post(`${BASE_URL}/roster`, async ctx => {
  const roster = await queries.addTeamRoster(ctx.request.body);

  if (!roster) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: roster };
});

router.post(`${BASE_URL}/addPlayerToRoster`, async ctx => {
  const player = await queries.addPlayerToRoster(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (!player) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: player };
});

router.post(`${BASE_URL}/register`, async ctx => {
  const { status, reason, rosterId } = await queries.addTeamToEvent(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  if (status === STATUS_ENUM.REFUSED) {
    ctx.status = errors[ERROR_ENUM.REGISTRATION_ERROR].code;
    ctx.body = { data: { status, reason } };
  } else if (!status) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: { status, rosterId } };
});

router.post(`${BASE_URL}/addTeamAsAdmin`, async ctx => {
  const { status, reason, rosterId } = await queries.addTeamAsAdmin(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (status === STATUS_ENUM.REFUSED) {
    ctx.status = STATUS_ENUM.ERROR;
    ctx.body = { data: { status, reason } };
  } else if (status) {
    ctx.body = { data: { status, rosterId } };
  } else {
    ctx.status = STATUS_ENUM.ERROR;
    ctx.body = { data: { status, reason } };
  }
});

router.post(`${BASE_URL}/registerIndividual`, async ctx => {
  const { status, reason, persons } = await queries.addPersonToEvent(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (!status) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }

  if (status === STATUS_ENUM.REFUSED) {
    ctx.status = errors[ERROR_ENUM.REGISTRATION_ERROR].code;
    ctx.body = { data: { status, reason, persons } };
  } else {
    ctx.body = { data: { status, persons } };
  }
});

router.del(`${BASE_URL}/deletePlayerFromRoster`, async ctx => {
  const res = await queries.deletePlayerFromRoster(
    ctx.query.id,
    ctx.body.userInfo.id,
  );

  if (!res) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: res };
});

router.del(BASE_URL, async ctx => {
  await queries.deleteEntity(ctx.query, ctx.body.userInfo.id);
});

router.del(`${BASE_URL}/membership`, async ctx => {
  await queries.deleteEntityMembership(ctx.query.membershipId);
});

router.del(`${BASE_URL}/partner`, async ctx => {
  await queries.deletePartner(ctx.query.partnerId);
});

router.del(`${BASE_URL}/player`, async ctx => {
  await queries.deletePlayer(ctx.query.id);
});

router.del(`${BASE_URL}/roster`, async ctx => {
  await queries.deleteRoster(ctx.query.id);
});

router.del(`${BASE_URL}/field`, async ctx => {
  await queries.deleteField(ctx.query.id);
});

router.del(`${BASE_URL}/timeslot`, async ctx => {
  await queries.deleteTimeslot(ctx.query.id);
});

router.del(`${BASE_URL}/rosterPlayer`, async ctx => {
  await queries.deleteRosterPlayer(ctx.query.id);
});

router.del(`${BASE_URL}/sessionExercise`, async ctx => {
  await queries.deleteSessionExercise(
    ctx.query.sessionId,
    ctx.query.exerciseId,
  );
});

router.del(`${BASE_URL}/member`, async ctx => {
  await queries.deleteMembership(ctx.query);
});

router.del(`${BASE_URL}/report`, async ctx => {
  await queries.deleteReport(ctx.query);
});

router.del(`${BASE_URL}/option`, async ctx => {
  await queries.deleteOption(ctx.query.id);
});

router.del(`${BASE_URL}/game`, async ctx => {
  const { reason, game } = await queries.deleteGame(
    ctx.body.userInfo.id,
    ctx.query,
  );
  if (reason) {
    ctx.status = STATUS_ENUM.ERROR;
    ctx.body = { data: { reason } };
  } else if (!game) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: { game } };
});

router.del(`${BASE_URL}/practice`, async ctx => {
  const practice = await queries.deletePractice(
    ctx.body.userInfo.id,
    ctx.query,
  );
  if (!practice) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: practice };
});

router.del(`${BASE_URL}/phase`, async ctx => {
  const phase = await PhaseController.deletePhase(
    ctx.query,
    ctx.body.userInfo.id,
  );
  if (!phase) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: phase };
});

router.del(`${BASE_URL}/rosterInviteToken`, async ctx => {
  const res = await queries.cancelRosterInviteToken(
    ctx.body.userInfo.id,
    ctx.query.rosterId,
  );
  if (!res) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: res };
});

module.exports = router;
