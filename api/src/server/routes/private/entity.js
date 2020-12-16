const Router = require('koa-router');
const queries = require('../../../db/queries/entity');
const { STATUS_ENUM } = require('../../../../../common/enums');
const {
  ERROR_ENUM,
  errors,
} = require('../../../../../common/errors');

const router = new Router();
const BASE_URL = '/api/entity';

router.get(`${BASE_URL}`, async ctx => {
  const entity = await queries.getEntity(
    ctx.query.id,
    ctx.body.userInfo.id,
  );

  if (entity) {
    ctx.body = {
      status: 'success',
      data: entity,
    };
  } else {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'That record does not exist.',
    };
  }
});

router.get(`${BASE_URL}/all`, async ctx => {
  const entity = await queries.getAllEntities(ctx.query);

  if (entity) {
    ctx.body = {
      status: 'success',
      data: entity,
    };
  } else {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'That record does not exist.',
    };
  }
});

router.get(`${BASE_URL}/forYouPage`, async ctx => {
  const entity = await queries.getAllForYouPagePosts(ctx.query);

  if (entity) {
    ctx.body = {
      status: 'success',
      data: entity,
    };
  } else {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'That record does not exist.',
    };
  }
});

router.get(`${BASE_URL}/canUnregisterTeamsList`, async ctx => {
  const res = await queries.canUnregisterTeamsList(
    ctx.query.rosterIds,
    ctx.query.eventId,
  );

  if (res) {
    ctx.status = 201;
    ctx.body = {
      status: 'success',
      data: res,
    };
  } else {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'Something went wrong',
    };
  }
});

router.get(`${BASE_URL}/getPossibleSubmissionerInfos`, async ctx => {
  const res = await queries.getPossibleSubmissionerInfos(
    ctx.query.gameId,
    ctx.query.teamsIds,
    ctx.body.userInfo.id,
  );

  if (res === ERROR_ENUM.ACCESS_DENIED) {
    ctx.status = STATUS_ENUM.FORBIDDEN;
    ctx.body = {
      status: 'error',
      message: 'player not in team',
    };
  } else if (res) {
    ctx.status = STATUS_ENUM.SUCCESS;
    ctx.body = {
      status: 'success',
      data: res,
    };
  } else {
    ctx.status = STATUS_ENUM.ERROR;
    ctx.body = {
      status: 'error',
      message: 'Something went wrong',
    };
  }
});

router.get(`${BASE_URL}/scoreSuggestion`, async ctx => {
  const suggestion = await queries.getScoreSuggestion(
    ctx.query.gameId,
  );

  if (suggestion) {
    ctx.body = {
      status: 'success',
      data: suggestion,
    };
  } else {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'That record does not exist.',
    };
  }
});

router.get(`${BASE_URL}/ownedEvents`, async ctx => {
  const entity = await queries.getOwnedEvents(
    ctx.query.organizationId,
  );

  if (entity) {
    ctx.body = {
      status: 'success',
      data: entity,
    };
  } else {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'That record does not exist.',
    };
  }
});

router.get(`${BASE_URL}/allOwned`, async ctx => {
  const entity = await queries.getAllOwnedEntities(
    ctx.query.type,
    ctx.body.userInfo.id,
  );

  if (!entity) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }

  ctx.status = STATUS_ENUM.SUCCESS;
  ctx.body = {
    status: 'success',
    data: entity,
  };
});

router.get(`${BASE_URL}/roles`, async ctx => {
  const entity = await queries.getAllRolesEntity(ctx.query.id);

  if (entity) {
    ctx.body = {
      status: 'success',
      data: entity,
    };
  } else {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'That record does not exist.',
    };
  }
});

router.get(`${BASE_URL}/members`, async ctx => {
  const entity = await queries.getMembers(
    ctx.query.personId,
    ctx.query.id,
  );

  if (entity) {
    ctx.body = {
      status: 'success',
      data: entity,
    };
  } else {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'That record does not exist.',
    };
  }
});

router.get(`${BASE_URL}/reports`, async ctx => {
  const reports = await queries.getReports(ctx.query.id);

  if (reports) {
    ctx.status = STATUS_ENUM.SUCCESS;
    ctx.body = {
      status: 'success',
      data: reports,
    };
  } else {
    ctx.status = STATUS_ENUM.ERROR;
    ctx.body = {
      status: 'error',
      message: 'That record does not exist.',
    };
  }
});

router.get(`${BASE_URL}/generateReport`, async ctx => {
  const report = await queries.generateReport(ctx.query.reportId);

  if (report) {
    ctx.status = STATUS_ENUM.SUCCESS;
    ctx.body = {
      status: 'success',
      data: report,
    };
  } else {
    ctx.status = STATUS_ENUM.ERROR;
    ctx.body = {
      status: 'error',
      message: 'That record does not exist.',
    };
  }
});

router.get(`${BASE_URL}/hasMemberships`, async ctx => {
  const entity = await queries.hasMemberships(ctx.query.id);
  if (entity || entity === false) {
    ctx.status = STATUS_ENUM.SUCCESS;
    ctx.body = {
      status: 'success',
      data: entity,
    };
  } else {
    ctx.status = STATUS_ENUM.ERROR;
    ctx.body = {
      status: 'error',
      message: 'That record does not exist.',
    };
  }
});

router.get(`${BASE_URL}/organizationMembers`, async ctx => {
  const entity = await queries.getOrganizationMembers(
    ctx.query.id,
    ctx.body.userInfo.id,
  );
  if (entity) {
    ctx.body = {
      status: 'success',
      data: entity,
    };
  } else {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'That record does not exist.',
    };
  }
});

router.get(`${BASE_URL}/memberships`, async ctx => {
  const entity = await queries.getMemberships(ctx.query.id);

  if (entity) {
    ctx.body = {
      status: 'success',
      data: entity,
    };
  } else {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'That record does not exist.',
    };
  }
});

router.get(`${BASE_URL}/primaryPerson`, async ctx => {
  const entity = await queries.getPrimaryPerson(ctx.body.userInfo.id);

  if (entity) {
    ctx.body = {
      status: 'success',
      data: entity,
    };
  } else {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'That record does not exist.',
    };
  }
});

router.get(`${BASE_URL}/registered`, async ctx => {
  const entity = await queries.getRegistered(
    ctx.query.team_id,
    ctx.query.event_id,
  );

  if (entity) {
    ctx.body = {
      status: 'success',
      data: entity,
    };
  } else {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'That record does not exist.',
    };
  }
});

router.get(`${BASE_URL}/event`, async ctx => {
  const event = await queries.getEvent(ctx.query.eventId);

  if (event) {
    ctx.body = {
      status: 'success',
      data: event,
    };
  } else {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'That record does not exist.',
    };
  }
});

router.get(`${BASE_URL}/generalInfos`, async ctx => {
  const infos = await queries.getGeneralInfos(ctx.query.entityId);

  if (infos) {
    ctx.body = {
      status: 'success',
      data: infos,
    };
  } else {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'That record does not exist.',
    };
  }
});

router.get(`${BASE_URL}/uniqueEmail`, async ctx => {
  const email = await queries.validateEmailIsUnique(ctx.query.email);
  if (email) {
    ctx.status = 201;
    ctx.body = {
      status: 'success',
      data: email,
    };
  } else {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'That email does not exist.',
    };
  }
});

router.get(`${BASE_URL}/personInfos`, async ctx => {
  const infos = await queries.getPersonInfos(ctx.query.entityId);

  if (infos) {
    ctx.status = STATUS_ENUM.SUCCESS;
    ctx.body = {
      status: 'success',
      data: infos,
    };
  } else {
    ctx.status = STATUS_ENUM.ERROR;
    ctx.body = {
      status: 'error',
      message: 'That record does not exist.',
    };
  }
});

router.get(`${BASE_URL}/person`, async ctx => {
  const infos = await queries.getGeneralInfos(ctx.query.entityId);

  if (infos) {
    ctx.status = STATUS_ENUM.SUCCESS;
    ctx.body = {
      status: 'success',
      data: infos,
    };
  } else {
    ctx.status = STATUS_ENUM.ERROR;
    ctx.body = {
      status: 'error',

      message: 'That record does not exist.',
    };
  }
});

router.get(`${BASE_URL}/s3Signature`, async ctx => {
  const { code, data } = await queries.getS3Signature(
    ctx.body.userInfo.id,
    ctx.query.fileType,
  );

  if (code === 200) {
    ctx.status = 201;
    ctx.body = {
      status: 'success',
      data,
    };
  } else {
    ctx.status = code;
    ctx.body = {
      status: 'error',
    };
  }
});

router.get(`${BASE_URL}/interactiveTool`, async ctx => {
  const data = await queries.getInteractiveToolData(
    ctx.query.eventId,
    ctx.body.userInfo.id,
  );

  if (data) {
    ctx.status = STATUS_ENUM.SUCCESS;
    ctx.body = {
      status: 'success',
      data,
    };
  } else {
    ctx.status = STATUS_ENUM.ERROR;
    ctx.body = {
      status: 'error',
    };
  }
});

router.get(`${BASE_URL}/gameSubmissionInfos`, async ctx => {
  const data = await queries.getGameSubmissionInfos(
    ctx.query.gameId,
    ctx.query.rosterId,
  );

  if (data) {
    ctx.status = STATUS_ENUM.SUCCESS;
    ctx.body = {
      status: 'success',
      data,
    };
  } else {
    ctx.status = STATUS_ENUM.ERROR;
    ctx.body = {
      status: 'error',
    };
  }
});

router.put(`${BASE_URL}`, async ctx => {
  const entity = await queries.updateEntity(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  if (entity) {
    ctx.status = 201;
    ctx.body = {
      status: 'success',
      data: entity,
    };
  } else {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'That entity does not exist.',
    };
  }
});

router.put(`${BASE_URL}/updateGamesInteractiveTool`, async ctx => {
  const res = await queries.updateGamesInteractiveTool(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (!res) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }

  ctx.status = STATUS_ENUM.SUCCESS;
  ctx.body = {
    status: 'success',
    data: res,
  };
});

router.put(`${BASE_URL}/role`, async ctx => {
  const entity = await queries.updateEntityRole(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  if (entity) {
    ctx.status = 201;
    ctx.body = {
      status: 'success',
      data: entity,
    };
  } else {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'That entity does not exist.',
    };
  }
});

router.put(`${BASE_URL}/rosterRole`, async ctx => {
  const res = await queries.updateRosterRole(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (!res) {
    ctx.status = STATUS_ENUM.ERROR;
    ctx.body = {
      status: 'error',
      message: 'That entity does not exist.',
    };
  } else if (res === ERROR_ENUM.VALUE_IS_INVALID) {
    ctx.status = STATUS_ENUM.FORBIDDEN;
    ctx.body = {
      status: 'error',
      message: 'At least one team admin must be set',
    };
  } else {
    ctx.status = STATUS_ENUM.SUCCESS;
    ctx.body = {
      status: 'success',
      data: res,
    };
  }
});

router.put(`${BASE_URL}/member`, async ctx => {
  const entity = await queries.updateMember(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  if (entity) {
    ctx.status = 201;
    ctx.body = {
      status: 'success',
      data: entity,
    };
  } else {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'That entity does not exist.',
    };
  }
});

router.put(`${BASE_URL}/alias`, async ctx => {
  const entity = await queries.updateAlias(ctx.request.body);
  if (entity) {
    ctx.status = STATUS_ENUM.SUCCESS;
    ctx.body = {
      status: 'success',
      data: entity,
    };
  } else {
    ctx.status = STATUS_ENUM.ERROR;
    ctx.body = {
      status: 'error',
      message: 'That entity does not exist.',
    };
  }
});

router.put(`${BASE_URL}/game`, async ctx => {
  const entity = await queries.updateGame(ctx.request.body);
  if (entity) {
    ctx.status = 201;
    ctx.body = {
      status: 'success',
      data: entity,
    };
  } else {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'That entity does not exist.',
    };
  }
});
router.put(`${BASE_URL}/updateSuggestionStatus`, async ctx => {
  const suggestion = await queries.updateSuggestionStatus(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  if (suggestion) {
    ctx.status = STATUS_ENUM.SUCCESS;
    ctx.body = {
      status: 'success',
      data: suggestion,
    };
  } else {
    ctx.status = STATUS_ENUM.ERROR;
    ctx.body = {
      status: 'error',
      message: 'That entity does not exist.',
    };
  }
});

router.put(`${BASE_URL}/updateRegistration`, async ctx => {
  const entity = await queries.updateRegistration(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  if (entity) {
    ctx.status = 201;
    ctx.body = {
      status: 'success',
      data: entity,
    };
  } else {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'That entity does not exist.',
    };
  }
});

router.put(`${BASE_URL}/updateEvent`, async ctx => {
  const entity = await queries.updateEvent(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  if (entity) {
    ctx.status = 201;
    ctx.body = {
      status: 'success',
      data: entity,
    };
  } else {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'That entity does not exist.',
    };
  }
});

router.put(`${BASE_URL}/updatePreRanking`, async ctx => {
  const entity = await queries.updatePreRanking(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  if (entity) {
    ctx.status = 201;
    ctx.body = {
      status: 'success',
      data: entity,
    };
  } else {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'That entity does not exist.',
    };
  }
});

router.put(`${BASE_URL}/updateGeneralInfos`, async ctx => {
  const entity = await queries.updateGeneralInfos(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  if (entity) {
    ctx.status = 201;
    ctx.body = {
      status: 'success',
      data: entity,
    };
  } else {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'That entity does not exist.',
    };
  }
});

router.put(`${BASE_URL}/updatePersonInfos`, async ctx => {
  const personInfos = await queries.updatePersonInfos(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  if (personInfos) {
    ctx.status = STATUS_ENUM.SUCCESS;
    ctx.body = {
      status: 'success',
      data: personInfos,
    };
  } else {
    ctx.status = STATUS_ENUM.ERROR;
    ctx.body = {
      status: 'error',
      message: 'That entity does not exist.',
    };
  }
});

router.put(`${BASE_URL}/updateOption`, async ctx => {
  const option = await queries.updateOption(ctx.request.body);
  if (option) {
    ctx.status = STATUS_ENUM.SUCCESS;
    ctx.body = {
      status: 'success',
      data: option,
    };
  } else {
    ctx.status = STATUS_ENUM.ERROR;
    ctx.body = {
      status: 'error',
      message: 'That entity does not exist.',
    };
  }
});

router.post(BASE_URL, async ctx => {
  const entityId = await queries.addEntity(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (entityId) {
    ctx.status = 201;
    ctx.body = {
      status: 'success',
      data: entityId,
    };
  } else {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: 'Something went wrong',
    };
  }
});

router.post(`${BASE_URL}/unregisterTeams`, async ctx => {
  const res = await queries.unregisterTeams(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (res.failed) {
    ctx.status = 403;
    ctx.body = {
      status: 'error',
      data: res.data,
      message: 'Something went wrong',
    };
  } else {
    ctx.status = 201;
    ctx.body = {
      status: 'success',
      data: res.data,
    };
  }
});

router.post(`${BASE_URL}/role`, async ctx => {
  const entity = await queries.addEntityRole(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  if (entity) {
    ctx.status = 201;
    ctx.body = {
      status: 'success',
      data: entity,
    };
  } else {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'Something went wrong',
    };
  }
});

router.post(`${BASE_URL}/member`, async ctx => {
  const entity = await queries.addMember(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  if (entity) {
    ctx.status = 201;
    ctx.body = {
      status: 'success',
      data: entity,
    };
  } else {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'Something went wrong',
    };
  }
});

router.post(`${BASE_URL}/report`, async ctx => {
  const report = await queries.addReport(ctx.request.body);
  if (report) {
    ctx.status = STATUS_ENUM.SUCCESS;
    ctx.body = {
      status: 'success',
      data: report,
    };
  } else {
    ctx.status = STATUS_ENUM.ERROR;
    ctx.body = {
      status: 'error',
      message: 'Something went wrong',
    };
  }
});

router.post(`${BASE_URL}/importMembers`, async ctx => {
  const members = await queries.importMembers(ctx.request.body);
  if (members) {
    ctx.status = STATUS_ENUM.SUCCESS;
    ctx.body = {
      status: 'success',
      data: members,
    };
  } else {
    ctx.status = STATUS_ENUM.ERROR;
    ctx.body = {
      status: 'error',
      message: 'Something went wrong',
    };
  }
});

router.post(`${BASE_URL}/memberManually`, async ctx => {
  const entity = await queries.addMemberManually(ctx.request.body);
  if (entity) {
    ctx.status = STATUS_ENUM.SUCCESS;
    ctx.body = {
      status: 'success',
      data: entity,
    };
  } else {
    ctx.status = STATUS_ENUM.ERROR;
    ctx.body = {
      status: 'error',
      message: 'Something went wrong',
    };
  }
});

router.post(`${BASE_URL}/alias`, async ctx => {
  const alias = await queries.addAlias(ctx.request.body);
  if (alias) {
    ctx.status = STATUS_ENUM.SUCCESS;
    ctx.body = {
      status: 'success',
      data: alias,
    };
  } else {
    ctx.status = STATUS_ENUM.ERROR;
    ctx.body = {
      status: 'error',
      message: 'Something went wrong',
    };
  }
});

router.post(`${BASE_URL}/game`, async ctx => {
  const game = await queries.addGame(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (!game) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }

  ctx.status = STATUS_ENUM.SUCCESS;
  ctx.body = {
    status: 'success',
    data: game,
  };
});

router.post(`${BASE_URL}/gameScore`, async ctx => {
  const game = await queries.setGameScore(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  if (game) {
    ctx.status = STATUS_ENUM.SUCCESS;
    ctx.body = {
      status: 'success',
      data: game,
    };
  } else {
    ctx.status = STATUS_ENUM.ERROR;
    ctx.body = {
      status: 'error',
      message: 'Something went wrong',
    };
  }
});

router.post(`${BASE_URL}/suggestScore`, async ctx => {
  const game = await queries.addScoreSuggestion(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  if (game) {
    ctx.status = STATUS_ENUM.SUCCESS;
    ctx.body = {
      status: 'success',
      data: game,
    };
  } else {
    ctx.status = STATUS_ENUM.ERROR;
    ctx.body = {
      status: 'error',
      message: 'Something went wrong',
    };
  }
});

router.post(`${BASE_URL}/acceptScore`, async ctx => {
  const res = await queries.acceptScoreSuggestion(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  if (res) {
    ctx.status = STATUS_ENUM.SUCCESS;
    ctx.body = {
      status: 'success',
      data: res,
    };
  } else {
    ctx.status = STATUS_ENUM.ERROR;
    ctx.body = {
      status: 'error',
      message: 'Something went wrong',
    };
  }
});

router.post(`${BASE_URL}/spirit`, async ctx => {
  const res = await queries.addSpiritSubmission(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  if (res) {
    ctx.status = STATUS_ENUM.SUCCESS;
    ctx.body = {
      status: 'success',
      data: res,
    };
  } else {
    ctx.status = STATUS_ENUM.ERROR;
    ctx.body = {
      status: 'error',
      message: 'Something went wrong',
    };
  }
});

router.post(`${BASE_URL}/gameAttendances`, async ctx => {
  const res = await queries.addGameAttendances(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  if (res) {
    ctx.status = STATUS_ENUM.SUCCESS;
    ctx.body = {
      status: 'success',
      data: res,
    };
  } else {
    ctx.status = STATUS_ENUM.ERROR;
    ctx.body = {
      status: 'error',
      message: 'Something went wrong',
    };
  }
});

router.post(`${BASE_URL}/field`, async ctx => {
  const field = await queries.addField(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (!field) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }

  ctx.status = STATUS_ENUM.SUCCESS;
  ctx.body = {
    status: 'success',
    data: field,
  };
});

router.post(`${BASE_URL}/addTeamToSchedule`, async ctx => {
  const team = await queries.addTeamToSchedule(ctx.request.body);
  if (team) {
    ctx.status = 201;
    ctx.body = {
      status: 'success',
      data: team,
    };
  } else {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'Something went wrong',
    };
  }
});

router.post(`${BASE_URL}/addRegisteredToSchedule`, async ctx => {
  const teams = await queries.addRegisteredToSchedule(
    ctx.request.body,
  );
  if (teams) {
    ctx.status = 201;
    ctx.body = {
      status: 'success',
      data: teams,
    };
  } else {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'Something went wrong',
    };
  }
});

router.post(`${BASE_URL}/phase`, async ctx => {
  const phase = await queries.addPhase(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (!phase) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }

  ctx.status = STATUS_ENUM.SUCCESS;
  ctx.body = {
    status: 'success',
    data: phase,
  };
});

router.post(`${BASE_URL}/timeSlots`, async ctx => {
  const slots = await queries.addTimeSlot(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (!slots) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }

  ctx.status = STATUS_ENUM.SUCCESS;
  ctx.body = {
    status: 'success',
    data: slots,
  };
});

router.post(`${BASE_URL}/option`, async ctx => {
  const option = await queries.addOption(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  if (option) {
    ctx.status = STATUS_ENUM.SUCCESS;
    ctx.body = {
      status: 'success',
      data: option,
    };
  } else {
    ctx.status = STATUS_ENUM.ERROR;
    ctx.body = {
      status: 'error',
      message: 'Could not add this option',
    };
  }
});

router.post(`${BASE_URL}/membership`, async ctx => {
  const entity = await queries.addMembership(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  if (entity) {
    ctx.status = 201;
    ctx.body = {
      status: 'success',
      data: entity,
    };
  } else {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'Something went wrong',
    };
  }
});

router.post(`${BASE_URL}/register`, async ctx => {
  const { status, reason, rosterId } = await queries.addTeamToEvent(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  if (status === STATUS_ENUM.REFUSED) {
    ctx.status = errors[ERROR_ENUM.REGISTRATION_ERROR].code;
    ctx.body = {
      status: 'error',
      data: { status, reason },
    };
  } else if (status) {
    ctx.status = 201;
    ctx.body = {
      status: 'success',
      data: { status, rosterId },
    };
  } else {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'Something went wrong',
    };
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
    ctx.body = {
      status: 'error',
      data: { status, reason, persons },
    };
  } else {
    ctx.status = 201;
    ctx.body = {
      status: 'success',
      data: { status, persons },
    };
  }
});

router.post(`${BASE_URL}/addNewPersonToRoster`, async ctx => {
  const person = await queries.addNewPersonToRoster(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (person) {
    ctx.status = 201;
    ctx.body = {
      status: 'success',
      data: person,
    };
  } else {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'Something went wrong',
    };
  }
});

router.del(`${BASE_URL}/deletePlayerFromRoster`, async ctx => {
  const res = await queries.deletePlayerFromRoster(
    ctx.query.id,
    ctx.body.userInfo.id,
  );

  if (res === ERROR_ENUM.ACCESS_DENIED) {
    ctx.status = STATUS_ENUM.FORBIDDEN;
    ctx.body = {
      status: 'error',
      message: 'Not allowed to remove player that has paid',
    };
  } else if (res === ERROR_ENUM.VALUE_IS_INVALID) {
    ctx.status = STATUS_ENUM.METHOD_NOT_ALLOWED;
    ctx.body = {
      status: 'error',
      message:
        'Team must have at least one coach, captain or assistant captain',
    };
  } else if (res) {
    ctx.status = STATUS_ENUM.SUCCESS;
    ctx.body = {
      status: 'success',
    };
  } else {
    ctx.status = STATUS_ENUM.ERROR;
    ctx.body = {
      status: 'error',
      message: 'Something went wrong',
    };
  }
});

router.del(BASE_URL, async ctx => {
  await queries.deleteEntity(ctx.query.id, ctx.body.userInfo.id);
  ctx.status = 201;
  ctx.body = {
    status: 'success',
  };
});

router.del(`${BASE_URL}/membership`, async ctx => {
  await queries.deleteEntityMembership(ctx.query);
  ctx.status = 201;
  ctx.body = {
    status: 'success',
  };
});

router.del(`${BASE_URL}/member`, async ctx => {
  await queries.deleteMembership(ctx.query);

  ctx.status = 201;
  ctx.body = {
    status: 'success',
  };
});

router.del(`${BASE_URL}/report`, async ctx => {
  await queries.deleteReport(ctx.query);

  ctx.status = STATUS_ENUM.SUCCESS;
  ctx.body = {
    status: 'success',
  };
});

router.del(`${BASE_URL}/option`, async ctx => {
  await queries.deleteOption(ctx.query.id);
  ctx.status = STATUS_ENUM.SUCCESS;
  ctx.body = {
    status: 'success',
  };
});

router.del(`${BASE_URL}/game`, async ctx => {
  const game = await queries.deleteGame(
    ctx.body.userInfo.id,
    ctx.query,
  );
  if (game) {
    (ctx.status = 201),
      (ctx.body = {
        status: 'success',
        data: game,
      });
  } else {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'That entity does not exist.',
    };
  }
});

router.get(`${BASE_URL}/rosterInviteToken`, async ctx => {
  const token = await queries.getRosterInviteToken(
    ctx.body.userInfo.id,
    ctx.query.rosterId,
  );
  if (!token) {
    throw new Error(STATUS_ENUM.ERROR_STRING);
  }
  ctx.status = STATUS_ENUM.SUCCESS;
  ctx.body = {
    status: STATUS_ENUM.SUCCESS_STRING,
    data: token,
  };
});

router.del(`${BASE_URL}/rosterInviteToken`, async ctx => {
  const res = await queries.cancelRosterInviteToken(
    ctx.body.userInfo.id,
    ctx.query.rosterId,
  );
  if (!res) {
    throw new Error(STATUS_ENUM.ERROR_STRING);
  }
  ctx.status = STATUS_ENUM.SUCCESS;
  ctx.body = {
    status: STATUS_ENUM.SUCCESS_STRING,
  };
});

router.get(`${BASE_URL}/rosterFromInviteToken`, async ctx => {
  const roster = await queries.getRosterFromInviteToken(
    ctx.query.token,
    ctx.body.userInfo.id,
  );
  if (!roster) {
    throw new Error(STATUS_ENUM.ERROR_STRING);
  }
  ctx.status = STATUS_ENUM.SUCCESS;
  ctx.body = {
    status: STATUS_ENUM.SUCCESS_STRING,
    data: roster,
  };
});

router.post(`${BASE_URL}/addPlayerToRoster`, async ctx => {
  const player = await queries.addPlayerToRoster(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  if (!player) {
    throw new Error(STATUS_ENUM.ERROR_STRING);
  }
  ctx.status = 201;
  ctx.body = {
    status: STATUS_ENUM.SUCCESS_STRING,
    data: player,
  };
});

module.exports = router;
