const Router = require('koa-router');
const queries = require('../../../db/queries/entity');
const {
  STATUS_ENUM,
  GLOBAL_ENUM,
} = require('../../../../../common/enums');
const {
  ERROR_ENUM,
  errors,
} = require('../../../../../common/errors');
const {
  OrganizationController,
} = require('../../../../../controllers/organization');
const {
  EventController,
} = require('../../../../../controllers/event');
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

router.get(`${BASE_URL}/editRankings`, async ctx => {
  const entity = await EventController.editRankings(
    ctx.query.id,
    ctx.body.userInfo.id,
  );

  if (!entity) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }

  ctx.body = {
    status: 'success',
    data: entity,
  };
});

router.get(`${BASE_URL}/editRosters`, async ctx => {
  const entity = await EventController.editRosters(
    ctx.query.id,
    ctx.body.userInfo.id,
  );

  if (!entity) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }

  ctx.body = {
    status: 'success',
    data: entity,
  };
});

router.get(`${BASE_URL}/editSchedule`, async ctx => {
  const entity = await EventController.editSchedule(
    ctx.query.id,
    ctx.body.userInfo.id,
  );

  if (!entity) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }

  ctx.body = {
    status: 'success',
    data: entity,
  };
});

router.get(`${BASE_URL}/league`, async ctx => {
  const entity = await OrganizationController.league(
    ctx.query.id,
    ctx.body.userInfo.id,
  );

  if (!entity) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }

  ctx.body = {
    status: 'success',
    data: entity,
  };
});

router.get(`${BASE_URL}/edit`, async ctx => {
  if (!ctx.query.id) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }

  const type = await queries.getEntitiesTypeById(ctx.query.id);
  let entity;
  switch (type) {
    case GLOBAL_ENUM.ORGANIZATION:
      entity = await OrganizationController.edit(
        ctx.query.id,
        ctx.body.userInfo.id,
      );
      break;
    case GLOBAL_ENUM.EVENT:
      entity = await EventController.edit(
        ctx.query.id,
        ctx.body.userInfo.id,
      );
      break;
    default:
      entity = await queries.getEntity(
        ctx.query.id,
        ctx.body.userInfo.id,
      );
  }

  if (!entity) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }

  ctx.body = {
    status: 'success',
    data: entity,
  };
});

router.get(`${BASE_URL}/graphAmountGeneratedByEvent`, async ctx => {
  const arrayGraph = await queries.getGraphAmountGeneratedByEvent(
    ctx.query.eventPaymentId,
    ctx.query.language,
    ctx.query.date,
  );

  if (arrayGraph) {
    ctx.body = {
      status: 'success',
      data: arrayGraph,
    };
  } else {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'That record does not exist.',
    };
  }
  return;
});

router.get(`${BASE_URL}/graphUserCount`, async ctx => {
  const arrayGraph = await queries.getGraphUserCount(
    ctx.query.date,
    ctx.query.language,
  );
  if (arrayGraph) {
    ctx.body = {
      status: 'success',
      data: arrayGraph,
    };
  } else {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'That record does not exist.',
    };
  }
  return;
});

router.get(`${BASE_URL}/graphMemberCount`, async ctx => {
  const arrayGraph = await queries.getGraphMemberCount(
    ctx.query.organizationId,
    ctx.query.date,
  );
  if (arrayGraph) {
    ctx.body = {
      status: 'success',
      data: arrayGraph,
    };
  } else {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'That record does not exist.',
    };
  }
  return;
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

router.get(`${BASE_URL}/role`, async ctx => {
  const role = await queries.getRole(
    ctx.query.entityId,
    ctx.body.userInfo.id,
  );

  if (!role) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }

  ctx.body = {
    status: 'success',
    data: role,
  };
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
    '',
    ctx.query.onlyAdmin,
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

router.get(`${BASE_URL}/phaseRanking`, async ctx => {
  const phaseRankings = await PhaseRankingController.getPhaseRanking(
    ctx.query.phaseId,
  );

  if (phaseRankings) {
    ctx.status = STATUS_ENUM.SUCCESS;
    ctx.body = {
      status: 'success',
      data: phaseRankings,
    };
  } else {
    ctx.status = STATUS_ENUM.ERROR;
    ctx.body = {
      status: 'error',
      message: 'That record does not exist.',
    };
  }
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

router.get(`${BASE_URL}/recentMember`, async ctx => {
  const member = await queries.getMostRecentMember(
    ctx.query.organizationId,
    ctx.body.userInfo.id,
  );

  if (member) {
    ctx.body = {
      status: 'success',
      data: member,
    };
  } else {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'That record does not exist.',
    };
  }
});

router.get(`${BASE_URL}/playerSessionEvaluation`, async ctx => {
  const evaluation = await queries.getPlayerSessionEvaluation(
    ctx.query.exerciseId,
    ctx.query.sessionId,
    ctx.body.userInfo.id,
  );

  if (evaluation) {
    ctx.body = {
      status: 'success',
      data: evaluation,
    };
  } else {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'That record does not exist.',
    };
  }
});

router.get(`${BASE_URL}/coachSessionEvaluation`, async ctx => {
  const evaluation = await queries.getCoachSessionEvaluation(
    ctx.query.exerciseId,
    ctx.query.sessionId,
    ctx.body.userInfo.id,
  );

  if (evaluation) {
    ctx.body = {
      status: 'success',
      data: evaluation,
    };
  } else {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'That record does not exist.',
    };
  }
});

router.get(`${BASE_URL}/isTeamCoach`, async ctx => {
  const role = await queries.getIsTeamCoach(
    ctx.query.teamId,
    ctx.body.userInfo.id,
  );

  if (role || role === false) {
    ctx.body = {
      status: 'success',
      data: role,
    };
  } else {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'That record does not exist.',
    };
  }
});

router.get(`${BASE_URL}/images`, async ctx => {
  const images = await queries.getImages(ctx.query.type);

  if (images) {
    ctx.body = {
      status: 'success',
      data: images,
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
  const entity = await queries.hasMemberships(
    ctx.query.organizationId,
  );
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

router.get(`${BASE_URL}/organizationTokenPromoCode`, async ctx => {
  const entity = await queries.getOrganizationTokenPromoCode(
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
router.get(`${BASE_URL}/partners`, async ctx => {
  const partners = await queries.getPartners(ctx.query.id);

  if (partners) {
    ctx.body = {
      status: 'success',
      data: partners,
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

router.get(`${BASE_URL}/allTeamsAcceptedRegistered`, async ctx => {
  const acceptedRegistration = await queries.getAllTeamsAcceptedRegistered(
    ctx.query.eventId,
  );

  if (acceptedRegistration) {
    ctx.body = {
      status: 'success',
      data: acceptedRegistration,
    };
  } else {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'That record does not exist.',
    };
  }
});

router.get(`${BASE_URL}/allPlayersAcceptedRegistered`, async ctx => {
  const acceptedRegistration = await queries.getAllPlayersAcceptedRegistered(
    ctx.query.eventId,
  );

  if (acceptedRegistration) {
    ctx.body = {
      status: 'success',
      data: acceptedRegistration,
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

router.get(`${BASE_URL}/teamsPendingAndRefused`, async ctx => {
  const teams = await queries.getAllTeamsPendingAndRefused(
    ctx.query.eventId,
  );

  if (teams) {
    ctx.status = STATUS_ENUM.SUCCESS;
    ctx.body = {
      status: 'success',
      data: teams,
    };
  } else {
    ctx.status = STATUS_ENUM.ERROR;
    ctx.body = {
      status: 'error',
      message: 'That record does not exist.',
    };
  }
});

router.get(`${BASE_URL}/playersPendingAndRefused`, async ctx => {
  const players = await queries.getAllPlayersPendingAndRefused(
    ctx.query.eventId,
  );

  if (players) {
    ctx.status = STATUS_ENUM.SUCCESS;
    ctx.body = {
      status: 'success',
      data: players,
    };
  } else {
    ctx.status = STATUS_ENUM.ERROR;
    ctx.body = {
      status: 'error',

      message: 'That record does not exist.',
    };
  }
});

router.get(`${BASE_URL}/teamPlayersPending`, async ctx => {
  const players = await queries.getAllTeamPlayersPending(
    ctx.query.teamId,
  );

  if (players) {
    ctx.status = STATUS_ENUM.SUCCESS;
    ctx.body = {
      status: 'success',
      data: players,
    };
  } else {
    ctx.status = STATUS_ENUM.ERROR;
    ctx.body = {
      status: 'error',
      message: 'That record does not exist.',
    };
  }
});

router.get(`${BASE_URL}/myTeamPlayersRequest`, async ctx => {
  const players = await queries.getMyTeamPlayersRequest(
    ctx.query.teamId,
    ctx.body.userInfo.id,
  );

  if (players) {
    ctx.status = STATUS_ENUM.SUCCESS;
    ctx.body = {
      status: 'success',
      data: players,
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
    ctx.query.eventId,
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

router.get(`${BASE_URL}/prerankPhase`, async ctx => {
  const data = await PhaseController.getPrerankPhase(
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

router.get(`${BASE_URL}/myRosters`, async ctx => {
  const data = await queries.getMyRosterIds(
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

router.get(`${BASE_URL}/newRosterInviteToken`, async ctx => {
  const token = await queries.getNewRosterInviteToken(
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

router.put(`${BASE_URL}/practice`, async ctx => {
  const entity = await queries.updatePractice(
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

router.put(`${BASE_URL}/practiceRsvp`, async ctx => {
  const entity = await queries.updatePracticeRsvp(
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

router.put(`${BASE_URL}/gameRsvp`, async ctx => {
  const entity = await queries.updateGameRsvp(
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

router.put(`${BASE_URL}/teamAcceptation`, async ctx => {
  const team = await queries.updateTeamAcceptation(ctx.request.body);
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
      message: 'That entity does not exist.',
    };
  }
});

router.put(`${BASE_URL}/playerAcceptation`, async ctx => {
  const team = await queries.updatePlayerAcceptation(
    ctx.request.body,
  );
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
      message: 'That entity does not exist.',
    };
  }
});

router.put(`${BASE_URL}/teamPlayerAcceptation`, async ctx => {
  const player = await queries.updateTeamPlayerAcceptation(
    ctx.request.body,
  );
  if (player) {
    ctx.status = 201;
    ctx.body = {
      status: 'success',
      data: player,
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

router.put(`${BASE_URL}/updatePhase`, async ctx => {
  const entity = await PhaseController.updatePhase(
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

router.put(`${BASE_URL}/updatePhaseOrder`, async ctx => {
  const entity = await PhaseController.updatePhaseOrder(
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

router.put(`${BASE_URL}/updateTeamPhase`, async ctx => {
  const entity = await PhaseRankingController.updateTeamPhase(
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

router.put(`${BASE_URL}/teamPhase`, async ctx => {
  const res = await PhaseRankingController.deleteTeamPhase(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  if (!res) {
    throw new Error(STATUS_ENUM.ERROR_STRING);
  }
  ctx.status = STATUS_ENUM.SUCCESS;
  ctx.body = {
    status: STATUS_ENUM.SUCCESS_STRING,
  };
});

router.put(`${BASE_URL}/updateInitialPositionPhase`, async ctx => {
  const entity = await PhaseRankingController.updateInitialPositionPhase(
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

router.put(`${BASE_URL}/finalPositionPhase`, async ctx => {
  const entity = await PhaseRankingController.updateFinalPositionPhase(
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

router.put(`${BASE_URL}/originPhase`, async ctx => {
  const entity = await PhaseRankingController.updateOriginPhase(
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

router.put(`${BASE_URL}/hasSpirit`, async ctx => {
  const roster = await queries.updateHasSpirit(
    ctx.request.body.eventId,
    ctx.request.body.hasSpirit,
    ctx.body.userInfo.id,
  );
  if (roster) {
    ctx.status = STATUS_ENUM.SUCCESS;
    ctx.body = {
      status: 'success',
      data: roster,
    };
  } else {
    ctx.status = STATUS_ENUM.ERROR;
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

router.put(
  `${BASE_URL}/updateMembershipTermsAndConditions`,
  async ctx => {
    const membership = await queries.updateMembershipTermsAndConditions(
      ctx.request.body,
    );
    if (membership) {
      ctx.status = STATUS_ENUM.SUCCESS;
      ctx.body = {
        status: 'success',
        data: membership,
      };
    } else {
      ctx.status = STATUS_ENUM.ERROR;
      ctx.body = {
        status: 'error',
        message: 'That entity does not exist.',
      };
    }
  },
);

router.put(`${BASE_URL}/memberOptionalField`, async ctx => {
  const entity = await queries.updateMemberOptionalField(
    ctx.request.body,
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

router.put(`${BASE_URL}/partner`, async ctx => {
  const partner = await queries.updatePartner(ctx.request.body);
  if (partner) {
    ctx.status = STATUS_ENUM.SUCCESS;
    ctx.body = {
      status: 'success',
      data: partner,
    };
  } else {
    ctx.status = STATUS_ENUM.ERROR;
    ctx.body = {
      status: 'error',
      message: 'That entity does not exist.',
    };
  }
});

router.put(`${BASE_URL}/player`, async ctx => {
  const player = await queries.updatePlayer(ctx.request.body);
  if (player) {
    ctx.status = STATUS_ENUM.SUCCESS;
    ctx.body = {
      status: 'success',
      data: player,
    };
  } else {
    ctx.status = STATUS_ENUM.ERROR;
    ctx.body = {
      status: 'error',
      message: 'That entity does not exist.',
    };
  }
});

router.put(`${BASE_URL}/rosterPlayer`, async ctx => {
  const player = await queries.updateRosterPlayer(ctx.request.body);
  if (player) {
    ctx.status = STATUS_ENUM.SUCCESS;
    ctx.body = {
      status: 'success',
      data: player,
    };
  } else {
    ctx.status = STATUS_ENUM.ERROR;
    ctx.body = {
      status: 'error',
      message: 'That entity does not exist.',
    };
  }
});

router.put(`${BASE_URL}/roster`, async ctx => {
  const roster = await queries.updateRoster(ctx.request.body);
  if (roster) {
    ctx.status = STATUS_ENUM.SUCCESS;
    ctx.body = {
      status: 'success',
      data: roster,
    };
  } else {
    ctx.status = STATUS_ENUM.ERROR;
    ctx.body = {
      status: 'error',
      message: 'That entity does not exist.',
    };
  }
});

router.put(`${BASE_URL}/field`, async ctx => {
  const field = await queries.updateField(ctx.request.body);
  if (field) {
    ctx.status = STATUS_ENUM.SUCCESS;
    ctx.body = {
      status: 'success',
      data: field,
    };
  } else {
    ctx.status = STATUS_ENUM.ERROR;
    ctx.body = {
      status: 'error',
      message: 'That entity does not exist.',
    };
  }
});

router.put(`${BASE_URL}/timeslot`, async ctx => {
  const timeslot = await queries.updateTimeslot(ctx.request.body);
  if (timeslot) {
    ctx.status = STATUS_ENUM.SUCCESS;
    ctx.body = {
      status: 'success',
      data: timeslot,
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

router.post(`${BASE_URL}/partner`, async ctx => {
  const partner = await queries.addPartner(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (partner) {
    ctx.status = 201;
    ctx.body = {
      status: 'success',
      data: partner,
    };
  } else {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: 'Something went wrong',
    };
  }
});

router.get(`${BASE_URL}/getTeamCoachedByUser`, async ctx => {
  const teams = await queries.getTeamCoachedByUser(
    ctx.query.personId,
  );

  if (teams) {
    ctx.status = STATUS_ENUM.SUCCESS;
    ctx.body = { status: 'success', data: teams };
  } else {
    ctx.status = STATUS_ENUM.ERROR;
    ctx.body = {
      status: 'error',
      message: 'Something went wrong',
    };
  }
});

router.get(`${BASE_URL}/getAllTeamGames`, async ctx => {
  const games = await queries.getAllTeamGames(ctx.query.teamId);

  if (games) {
    ctx.status = STATUS_ENUM.SUCCESS;
    ctx.body = { status: 'success', data: games };
  } else {
    ctx.status = STATUS_ENUM.ERROR;
    ctx.body = {
      status: 'error',
      message: 'Something went wrong',
    };
  }
});

router.get(`${BASE_URL}/getAllTeamPractices`, async ctx => {
  const practices = await queries.getAllTeamPractices(
    ctx.query.teamId,
  );

  if (practices) {
    ctx.status = STATUS_ENUM.SUCCESS;
    ctx.body = { status: 'success', data: practices };
  } else {
    ctx.status = STATUS_ENUM.ERROR;
    ctx.body = {
      status: 'error',
      message: 'Something went wrong',
    };
  }
});

router.get(`${BASE_URL}/getAllExercises`, async ctx => {
  const exercises = await queries.getAllExercises();

  if (exercises) {
    ctx.status = STATUS_ENUM.SUCCESS;
    ctx.body = { status: 'success', data: exercises };
  } else {
    ctx.status = STATUS_ENUM.ERROR;
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

router.post(`${BASE_URL}/unregisterPeople`, async ctx => {
  const res = await queries.unregisterPeople(
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

router.post(`${BASE_URL}/memberDonation`, async ctx => {
  const donation = await queries.addMemberDonation(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  if (donation) {
    ctx.status = STATUS_ENUM.SUCCESS;
    ctx.body = {
      status: 'success',
      data: donation,
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

router.post(`${BASE_URL}/addAllInteractiveTool`, async ctx => {
  const res = await InteractiveToolController.addAll(
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

router.post(`${BASE_URL}/exercise`, async ctx => {
  const exercise = await queries.addExercise(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (!exercise) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }

  ctx.status = STATUS_ENUM.SUCCESS;
  ctx.body = {
    status: 'success',
    data: exercise,
  };
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

router.post(`${BASE_URL}/practice`, async ctx => {
  const game = await queries.addPractice(ctx.request.body);

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

router.post(`${BASE_URL}/phase`, async ctx => {
  const phase = await PhaseController.addPhase(
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

router.post(`${BASE_URL}/players`, async ctx => {
  const players = await queries.addPlayersToTeam(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  if (players) {
    ctx.status = 201;
    ctx.body = {
      status: 'success',
      data: players,
    };
  } else {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'Something went wrong',
    };
  }
});

router.post(`${BASE_URL}/joinTeam`, async ctx => {
  const player = await queries.sendRequestToJoinTeam(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  if (player) {
    ctx.status = 201;
    ctx.body = {
      status: 'success',
      data: player,
    };
  } else {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'Something went wrong',
    };
  }
});

router.post(`${BASE_URL}/roster`, async ctx => {
  const roster = await queries.addTeamRoster(ctx.request.body);
  if (roster) {
    ctx.status = 201;
    ctx.body = {
      status: 'success',
      data: roster,
    };
  } else {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'Something went wrong',
    };
  }
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
router.post(`${BASE_URL}/addTeamAsAdmin`, async ctx => {
  const { status, reason, rosterId } = await queries.addTeamAsAdmin(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (status === STATUS_ENUM.REFUSED) {
    ctx.status = 404;
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
      data: { status, reason },
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
  await queries.deleteEntity(ctx.query, ctx.body.userInfo.id);
  ctx.status = 201;
  ctx.body = {
    status: 'success',
  };
});

router.del(`${BASE_URL}/membership`, async ctx => {
  await queries.deleteEntityMembership(ctx.query.membershipId);
  ctx.status = 201;
  ctx.body = {
    status: 'success',
  };
});

router.del(`${BASE_URL}/partner`, async ctx => {
  await queries.deletePartner(ctx.query.partnerId);
  ctx.status = 201;
  ctx.body = {
    status: 'success',
  };
});

router.del(`${BASE_URL}/player`, async ctx => {
  await queries.deletePlayer(ctx.query.id);
  ctx.status = 201;
  ctx.body = {
    status: 'success',
  };
});

router.del(`${BASE_URL}/roster`, async ctx => {
  await queries.deleteRoster(ctx.query.id);
  ctx.status = 201;
  ctx.body = {
    status: 'success',
  };
});

router.del(`${BASE_URL}/field`, async ctx => {
  await queries.deleteField(ctx.query.id);
  ctx.status = 201;
  ctx.body = {
    status: 'success',
  };
});

router.del(`${BASE_URL}/timeslot`, async ctx => {
  await queries.deleteTimeslot(ctx.query.id);
  ctx.status = 201;
  ctx.body = {
    status: 'success',
  };
});

router.del(`${BASE_URL}/rosterPlayer`, async ctx => {
  await queries.deleteRosterPlayer(ctx.query.id);
  ctx.status = 201;
  ctx.body = {
    status: 'success',
  };
});

router.del(`${BASE_URL}/sessionExercise`, async ctx => {
  await queries.deleteSessionExercise(
    ctx.query.sessionId,
    ctx.query.exerciseId,
  );
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
  const { reason, game } = await queries.deleteGame(
    ctx.body.userInfo.id,
    ctx.query,
  );
  if (reason) {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      data: { reason },
    };
  } else if (game) {
    (ctx.status = 201),
      (ctx.body = {
        status: 'success',
        data: { game },
      });
  } else {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'That entity does not exist.',
    };
  }
});

router.del(`${BASE_URL}/practice`, async ctx => {
  const practice = await queries.deletePractice(
    ctx.body.userInfo.id,
    ctx.query,
  );
  if (practice) {
    (ctx.status = 201),
      (ctx.body = {
        status: 'success',
        data: practice,
      });
  } else {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'That entity does not exist.',
    };
  }
});

router.del(`${BASE_URL}/phase`, async ctx => {
  const phase = await PhaseController.deletePhase(
    ctx.query,
    ctx.body.userInfo.id,
  );
  if (phase) {
    ctx.status = STATUS_ENUM.SUCCESS;
    ctx.body = {
      status: 'success',
      data: phase,
    };
  } else {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'That entity does not exist.',
    };
  }
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

module.exports = router;
