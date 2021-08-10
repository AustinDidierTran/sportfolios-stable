const Router = require('koa-router');
const service = require('../../service/entity');
const { STATUS_ENUM } = require('../../../../../common/enums');
const {
  ERROR_ENUM,
  errors,
} = require('../../../../../common/errors');

const router = new Router();
const BASE_URL = '/api/entity';

router.get(`${BASE_URL}/graphAmountGeneratedByEvent`, async ctx => {
  const arrayGraph = await service.getGraphAmountGeneratedByEvent(
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
  const arrayGraph = await service.getGraphUserCount(
    ctx.query.date,
    ctx.query.language,
  );

  if (!arrayGraph) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: arrayGraph };
});

router.get(`${BASE_URL}/graphMemberCount`, async ctx => {
  const arrayGraph = await service.getGraphMemberCount(
    ctx.query.organizationId,
    ctx.query.date,
  );

  if (!arrayGraph) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: arrayGraph };
});

router.get(`${BASE_URL}/all`, async ctx => {
  const entity = await service.getAllEntities(ctx.query);

  if (!entity) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: entity };
});

router.get(`${BASE_URL}/role`, async ctx => {
  const role = await service.getRole(
    ctx.query.entityId,
    ctx.body.userInfo.id,
  );

  if (!role) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: role };
});

router.get(`${BASE_URL}/playerTeamRole`, async ctx => {
  const role = await service.getPlayerTeamRole(
    ctx.query.teamId,
    ctx.body.userInfo.id,
  );

  if (!role) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: role };
});

router.get(`${BASE_URL}/forYouPage`, async ctx => {
  const entity = await service.getAllForYouPagePosts(ctx.query);

  if (!entity) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: entity };
});

router.get(`${BASE_URL}/canUnregisterTeamsList`, async ctx => {
  const res = await service.canUnregisterTeamsList(
    ctx.query.rosterIds,
    ctx.query.eventId,
  );

  if (!res) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: res };
});

router.get(`${BASE_URL}/getPossibleSubmissionerInfos`, async ctx => {
  const res = await service.getPossibleSubmissionerInfos(
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
  const suggestion = await service.getScoreSuggestion(
    ctx.query.gameId,
  );

  if (!suggestion) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: suggestion };
});

router.get(`${BASE_URL}/allOwned`, async ctx => {
  const entity = await service.getAllOwnedEntities(
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

router.get(`${BASE_URL}/roles`, async ctx => {
  const entity = await service.getAllRolesEntity(ctx.query.id);

  if (!entity) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: entity };
});

router.get(`${BASE_URL}/members`, async ctx => {
  const entity = await service.getMembers(
    ctx.query.personId,
    ctx.query.organizationId,
  );

  if (!entity) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: entity };
});

router.get(`${BASE_URL}/recentMember`, async ctx => {
  const member = await service.getMostRecentMember(
    ctx.query.organizationId,
    ctx.body.userInfo.id,
  );
  ctx.body = { data: member };
});

router.get(`${BASE_URL}/playerSessionEvaluation`, async ctx => {
  const evaluation = await service.getPlayerSessionEvaluation(
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
  const evaluation = await service.getCoachSessionEvaluation(
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
  const role = await service.getIsTeamCoach(
    ctx.query.teamId,
    ctx.body.userInfo.id,
  );

  if (!role && role != false) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: role };
});

router.get(`${BASE_URL}/images`, async ctx => {
  const images = await service.getImages(ctx.query.type);

  if (!images) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: images };
});

router.get(`${BASE_URL}/reports`, async ctx => {
  const reports = await service.getReports(ctx.query.id);

  if (!reports) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: reports };
});

router.get(`${BASE_URL}/hasMemberships`, async ctx => {
  const entity = await service.hasMemberships(
    ctx.query.organizationId,
  );
  if (!entity && entity != false) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: entity };
});

router.get(`${BASE_URL}/organizationTokenPromoCode`, async ctx => {
  const entity = await service.getOrganizationTokenPromoCode(
    ctx.query.id,
    ctx.body.userInfo.id,
  );
  if (!entity) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: entity };
});

router.get(`${BASE_URL}/memberships`, async ctx => {
  const memberships = await service.getMemberships(ctx.query.id);

  if (!memberships) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: memberships };
});

router.get(`${BASE_URL}/membership`, async ctx => {
  const membership = await service.getMembershipWithoutId(
    ctx.query.organizationId,
    ctx.query.membershipType,
  );

  if (!membership) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: membership };
});

router.get(`${BASE_URL}/partners`, async ctx => {
  const partners = await service.getPartners(ctx.query.id);

  if (!partners) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: partners };
});

router.get(`${BASE_URL}/primaryPerson`, async ctx => {
  const entity = await service.getPrimaryPerson(ctx.body.userInfo.id);

  if (!entity) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: entity };
});

router.get(`${BASE_URL}/registered`, async ctx => {
  const entity = await service.getRegistered(
    ctx.query.team_id,
    ctx.query.event_id,
  );

  if (!entity) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: entity };
});

router.get(`${BASE_URL}/allTeamsAcceptedRegistered`, async ctx => {
  const acceptedRegistration = await service.getAllTeamsAcceptedRegistered(
    ctx.query.eventId,
  );

  if (!acceptedRegistration) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: acceptedRegistration };
});

router.get(`${BASE_URL}/allPlayersAcceptedRegistered`, async ctx => {
  const acceptedRegistration = await service.getAllPlayersAcceptedRegistered(
    ctx.query.eventId,
  );

  if (!acceptedRegistration) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: acceptedRegistration };
});

router.get(`${BASE_URL}/event`, async ctx => {
  const event = await service.getEvent(ctx.query.eventId);

  if (!event) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: event };
});

router.get(`${BASE_URL}/generalInfos`, async ctx => {
  const infos = await service.getGeneralInfos(ctx.query.entityId);

  if (!infos) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: infos };
});

router.get(`${BASE_URL}/uniqueEmail`, async ctx => {
  const email = await service.validateEmailIsUnique(ctx.query.email);

  if (!email) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: email };
});

router.get(`${BASE_URL}/personInfos`, async ctx => {
  const infos = await service.getPersonInfos(ctx.query.entityId);

  if (!infos) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: infos };
});

router.get(`${BASE_URL}/teamsPendingAndRefused`, async ctx => {
  const teams = await service.getAllTeamsPendingAndRefused(
    ctx.query.eventId,
  );

  if (!teams) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: teams };
});

router.get(`${BASE_URL}/playersPendingAndRefused`, async ctx => {
  const players = await service.getAllPlayersPendingAndRefused(
    ctx.query.eventId,
  );

  if (!players) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: players };
});

router.get(`${BASE_URL}/teamPlayersPending`, async ctx => {
  const players = await service.getAllTeamPlayersPending(
    ctx.query.teamId,
  );

  if (!players) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: players };
});

router.get(`${BASE_URL}/myTeamPlayersRequest`, async ctx => {
  const players = await service.getMyTeamPlayersRequest(
    ctx.query.teamId,
    ctx.body.userInfo.id,
  );

  if (!players) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: players };
});

router.get(`${BASE_URL}/person`, async ctx => {
  const infos = await service.getGeneralInfos(ctx.query.entityId);

  if (!infos) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: infos };
});

router.get(`${BASE_URL}/s3Signature`, async ctx => {
  const data = await service.getS3Signature(
    ctx.body.userInfo.id,
    ctx.query.fileType,
  );

  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.get(`${BASE_URL}/interactiveTool`, async ctx => {
  const data = await service.getInteractiveToolData(
    ctx.query.eventId,
    ctx.body.userInfo.id,
  );

  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.get(`${BASE_URL}/gameSubmissionInfos`, async ctx => {
  const data = await service.getGameSubmissionInfos(
    ctx.query.gameId,
    ctx.query.rosterId,
    ctx.query.eventId,
  );
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.get(`${BASE_URL}/myRosters`, async ctx => {
  const data = await service.getMyRosterIds(
    ctx.query.eventId,
    ctx.body.userInfo.id,
  );
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.get(`${BASE_URL}/rosterFromInviteToken`, async ctx => {
  const roster = await service.getRosterFromInviteToken(
    ctx.query.token,
    ctx.body.userInfo.id,
  );
  if (!roster) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: roster };
});

router.get(`${BASE_URL}/rosterInviteToken`, async ctx => {
  const token = await service.getRosterInviteToken(
    ctx.body.userInfo.id,
    ctx.query.rosterId,
  );
  if (!token) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: token };
});

router.get(`${BASE_URL}/newRosterInviteToken`, async ctx => {
  const token = await service.getNewRosterInviteToken(
    ctx.body.userInfo.id,
    ctx.query.rosterId,
  );
  if (!token) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: token };
});

router.put(`${BASE_URL}`, async ctx => {
  const entity = await service.updateEntity(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  if (!entity) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: entity };
});

router.put(`${BASE_URL}/practice`, async ctx => {
  const entity = await service.updatePractice(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (!entity) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: entity };
});

router.put(`${BASE_URL}/practiceRsvp`, async ctx => {
  const entity = await service.updatePracticeRsvp(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (!entity) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: entity };
});

router.put(`${BASE_URL}/gameRsvp`, async ctx => {
  const entity = await service.updateGameRsvp(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (!entity) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: entity };
});

router.put(`${BASE_URL}/updateGamesInteractiveTool`, async ctx => {
  const res = await service.updateGamesInteractiveTool(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (!res) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: res };
});

router.put(`${BASE_URL}/role`, async ctx => {
  const entity = await service.updateEntityRole(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  if (!entity) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: entity };
});

router.put(`${BASE_URL}/rosterRole`, async ctx => {
  const res = await service.updateRosterRole(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (!res) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: res };
});

router.put(`${BASE_URL}/member`, async ctx => {
  const entity = await service.updateMember(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  if (!entity) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: entity };
});

router.put(`${BASE_URL}/teamAcceptation`, async ctx => {
  const team = await service.updateTeamAcceptation(ctx.request.body);

  if (!team) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: team };
});

router.put(`${BASE_URL}/playerAcceptation`, async ctx => {
  const team = await service.updatePlayerAcceptation(
    ctx.request.body,
  );

  if (!team) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: team };
});

router.put(`${BASE_URL}/teamPlayerAcceptation`, async ctx => {
  const player = await service.updateTeamPlayerAcceptation(
    ctx.request.body,
  );

  if (!player) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: player };
});

router.put(`${BASE_URL}/alias`, async ctx => {
  const entity = await service.updateAlias(ctx.request.body);

  if (!entity) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: entity };
});

router.put(`${BASE_URL}/game`, async ctx => {
  const entity = await service.updateGame(ctx.request.body);

  if (!entity) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: entity };
});

router.put(`${BASE_URL}/updateSuggestionStatus`, async ctx => {
  const suggestion = await service.updateSuggestionStatus(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (!suggestion) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: suggestion };
});

router.put(`${BASE_URL}/updateRegistration`, async ctx => {
  const entity = await service.updateRegistration(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (!entity) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: entity };
});

router.put(`${BASE_URL}/updateEvent`, async ctx => {
  const entity = await service.updateEvent(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (!entity) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: entity };
});

router.put(`${BASE_URL}/updatePreRanking`, async ctx => {
  const entity = await service.updatePreRanking(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (!entity) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: entity };
});

router.put(`${BASE_URL}/updateGeneralInfos`, async ctx => {
  const entity = await service.updateGeneralInfos(ctx.request.body);
  if (!entity) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: entity };
});

router.put(`${BASE_URL}/hasSpirit`, async ctx => {
  const roster = await service.updateHasSpirit(
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
  const personInfos = await service.updatePersonInfos(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (!personInfos) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: personInfos };
});

router.put(`${BASE_URL}/updateOption`, async ctx => {
  const option = await service.updateOption(ctx.request.body);

  if (!option) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: option };
});

router.put(
  `${BASE_URL}/updateMembershipTermsAndConditions`,
  async ctx => {
    const membership = await service.updateMembershipTermsAndConditions(
      ctx.request.body,
    );

    if (!membership) {
      throw new Error(ERROR_ENUM.ERROR_OCCURED);
    }
    ctx.body = { data: membership };
  },
);

router.put(`${BASE_URL}/memberOptionalField`, async ctx => {
  const entity = await service.updateMemberOptionalField(
    ctx.request.body,
  );

  if (!entity) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: entity };
});

router.put(`${BASE_URL}/partner`, async ctx => {
  const partner = await service.updatePartner(ctx.request.body);

  if (!partner) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: partner };
});

router.put(`${BASE_URL}/player`, async ctx => {
  const player = await service.updatePlayer(ctx.request.body);

  if (!player) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: player };
});

router.put(`${BASE_URL}/rosterPlayer`, async ctx => {
  const player = await service.updateRosterPlayer(ctx.request.body);

  if (!player) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: player };
});

router.put(`${BASE_URL}/roster`, async ctx => {
  const roster = await service.updateRoster(ctx.request.body);

  if (!roster) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: roster };
});

router.put(`${BASE_URL}/field`, async ctx => {
  const field = await service.updateField(ctx.request.body);
  if (!field) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: field };
});

router.put(`${BASE_URL}/timeslot`, async ctx => {
  const timeslot = await service.updateTimeslot(ctx.request.body);
  if (!timeslot) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: timeslot };
});

router.post(BASE_URL, async ctx => {
  const entityId = await service.addEntity(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (!entityId) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: entityId };
});

router.post(`${BASE_URL}/partner`, async ctx => {
  const partner = await service.addPartner(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (!partner) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: partner };
});

router.get(`${BASE_URL}/getTeamCoachedByUser`, async ctx => {
  const teams = await service.getTeamCoachedByUser(
    ctx.query.personId,
  );

  if (!teams) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: teams };
});

router.get(`${BASE_URL}/getAllTeamGames`, async ctx => {
  const games = await service.getAllTeamGames(ctx.query.teamId);

  if (!games) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: games };
});

router.get(`${BASE_URL}/getAllTeamPractices`, async ctx => {
  const practices = await service.getAllTeamPractices(
    ctx.query.teamId,
  );

  if (!practices) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: practices };
});

router.get(`${BASE_URL}/getAllExercises`, async ctx => {
  const exercises = await service.getAllExercises();

  if (!exercises) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: exercises };
});

router.post(`${BASE_URL}/unregisterTeams`, async ctx => {
  const teams = await service.unregisterTeams(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (!teams) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: teams };
});

router.post(`${BASE_URL}/unregisterPeople`, async ctx => {
  const people = await service.unregisterPeople(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (!people) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: people };
});

router.post(`${BASE_URL}/role`, async ctx => {
  const entity = await service.addEntityRole(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (!entity) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: entity };
});

router.post(`${BASE_URL}/member`, async ctx => {
  const member = await service.addMember(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  if (!member) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: member };
});

router.post(`${BASE_URL}/memberWithCoupon`, async ctx => {
  const member = await service.addMemberWithCoupon(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  if (!member) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: member };
});

router.post(`${BASE_URL}/report`, async ctx => {
  const report = await service.addReport(ctx.request.body);

  if (!report) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: report };
});

router.post(`${BASE_URL}/importMembers`, async ctx => {
  const members = await service.importMembers(ctx.request.body);

  if (!members) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: members };
});

router.post(`${BASE_URL}/memberDonation`, async ctx => {
  const donation = await service.addMemberDonation(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (!donation) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: donation };
});

router.post(`${BASE_URL}/memberManually`, async ctx => {
  const member = await service.addMemberManually(ctx.request.body);

  if (!member) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: member };
});

router.post(`${BASE_URL}/exercise`, async ctx => {
  const exercise = await service.addExercise(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (!exercise) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: exercise };
});

router.post(`${BASE_URL}/game`, async ctx => {
  const game = await service.addGame(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (!game) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: game };
});

router.post(`${BASE_URL}/practice`, async ctx => {
  const game = await service.addPractice(ctx.request.body);

  if (!game) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: game };
});

router.post(`${BASE_URL}/gameScore`, async ctx => {
  const game = await service.setGameScore(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (!game) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: game };
});

router.post(`${BASE_URL}/suggestScore`, async ctx => {
  const game = await service.addScoreSuggestion(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  if (!game) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: game };
});

router.post(`${BASE_URL}/acceptScore`, async ctx => {
  const res = await service.acceptScoreSuggestion(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  if (!res) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: res };
});

router.post(`${BASE_URL}/spirit`, async ctx => {
  const res = await service.addSpiritSubmission(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  if (!res) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: res };
});

router.post(`${BASE_URL}/gameAttendances`, async ctx => {
  const res = await service.addGameAttendances(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  if (!res) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: res };
});

router.post(`${BASE_URL}/field`, async ctx => {
  const field = await service.addField(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (!field) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: field };
});

router.post(`${BASE_URL}/timeSlots`, async ctx => {
  const slots = await service.addTimeSlot(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (!slots) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: slots };
});

router.post(`${BASE_URL}/option`, async ctx => {
  const option = await service.addOption(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (!option) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: option };
});

router.post(`${BASE_URL}/membership`, async ctx => {
  const entity = await service.addMembership(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (!entity) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: entity };
});

router.post(`${BASE_URL}/players`, async ctx => {
  const players = await service.addPlayersToTeam(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (!players) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: players };
});

router.post(`${BASE_URL}/joinTeam`, async ctx => {
  const player = await service.sendRequestToJoinTeam(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (!player) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: player };
});

router.post(`${BASE_URL}/roster`, async ctx => {
  const roster = await service.addTeamRoster(ctx.request.body);

  if (!roster) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: roster };
});

router.post(`${BASE_URL}/addPlayerToRoster`, async ctx => {
  const player = await service.addPlayerToRoster(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (!player) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: player };
});

router.post(`${BASE_URL}/register`, async ctx => {
  const { status, reason, rosterId } = await service.addTeamToEvent(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  if (status === STATUS_ENUM.REFUSED) {
    ctx.status = errors[ERROR_ENUM.REGISTRATION_ERROR].code;
    ctx.body = { data: { status, reason } };
  } else if (!status) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  } else {
    ctx.body = { data: { status, rosterId } };
  }
});

router.post(`${BASE_URL}/addTeamAsAdmin`, async ctx => {
  const { status, reason, rosterId } = await service.addTeamAsAdmin(
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
  const { status, reason, persons } = await service.addPersonToEvent(
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
  const res = await service.deletePlayerFromRoster(
    ctx.query.id,
    ctx.body.userInfo.id,
  );

  if (!res) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: res };
});

router.del(BASE_URL, async ctx => {
  await service.deleteEntity(ctx.query, ctx.body.userInfo.id);
});

router.del(`${BASE_URL}/membership`, async ctx => {
  await service.deleteEntityMembership(ctx.query.membershipId);
});

router.del(`${BASE_URL}/partner`, async ctx => {
  await service.deletePartner(ctx.query.partnerId);
});

router.del(`${BASE_URL}/player`, async ctx => {
  await service.deletePlayer(ctx.query.id);
});

router.del(`${BASE_URL}/roster`, async ctx => {
  await service.deleteRoster(ctx.query.id);
});

router.del(`${BASE_URL}/field`, async ctx => {
  await service.deleteField(ctx.query.id);
});

router.del(`${BASE_URL}/timeslot`, async ctx => {
  await service.deleteTimeslot(ctx.query.id);
});

router.del(`${BASE_URL}/rosterPlayer`, async ctx => {
  await service.deleteRosterPlayer(ctx.query.id);
});

router.del(`${BASE_URL}/sessionExercise`, async ctx => {
  await service.deleteSessionExercise(
    ctx.query.sessionId,
    ctx.query.exerciseId,
  );
});

router.del(`${BASE_URL}/member`, async ctx => {
  await service.deleteMembership(ctx.query);
});

router.del(`${BASE_URL}/report`, async ctx => {
  await service.deleteReport(ctx.query);
});

router.del(`${BASE_URL}/option`, async ctx => {
  await service.deleteOption(ctx.query.id);
});

router.del(`${BASE_URL}/game`, async ctx => {
  const { reason, game } = await service.deleteGame(
    ctx.body.userInfo.id,
    ctx.query,
  );
  if (reason) {
    ctx.body = { data: { reason } };
  } else if (!game) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  } else {
    ctx.body = { data: { game } };
  }
});

router.del(`${BASE_URL}/practice`, async ctx => {
  const practice = await service.deletePractice(ctx.query);
  if (!practice) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: practice };
});

router.del(`${BASE_URL}/rosterInviteToken`, async ctx => {
  const res = await service.cancelRosterInviteToken(
    ctx.body.userInfo.id,
    ctx.query.rosterId,
  );
  if (!res) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: res };
});

module.exports = router;
