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

router.get(`${BASE_URL}/scoreSuggestion`, async ctx => {
  const suggestion = await queries.getScoreSuggestion(ctx.query);

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
router.get(`${BASE_URL}/sameSuggestions`, async ctx => {
  const suggestion = await queries.getSameSuggestions(ctx.query);

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
    ctx.query.personsId,
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
  );
  if (suggestion) {
    ctx.status = 201;
    ctx.body = {
      status: 'success',
      data: suggestion,
    };
  } else {
    ctx.status = 404;
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
  const entity = await queries.addMember(ctx.request.body);
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

router.post(`${BASE_URL}/alias`, async ctx => {
  const alias = await queries.addAlias(ctx.request.body);
  if (alias) {
    ctx.status = 201;
    ctx.body = {
      status: 'success',
      data: alias,
    };
  } else {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'Something went wrong',
    };
  }
});

router.post(`${BASE_URL}/game`, async ctx => {
  const game = await queries.addGame(ctx.request.body);
  if (game) {
    ctx.status = 201;
    ctx.body = {
      status: 'success',
      data: game,
    };
  } else {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'Something went wrong',
    };
  }
});

router.post(`${BASE_URL}/scoreAndSpirit`, async ctx => {
  const game = await queries.addScoreAndSpirit(ctx.request.body);
  if (game) {
    ctx.status = 201;
    ctx.body = {
      status: 'success',
      data: game,
    };
  } else {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'Something went wrong',
    };
  }
});

router.post(`${BASE_URL}/field`, async ctx => {
  const field = await queries.addField(ctx.request.body);
  if (field) {
    ctx.status = 201;
    ctx.body = {
      status: 'success',
      data: field,
    };
  } else {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'Something went wrong',
    };
  }
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
  const phase = await queries.addPhase(ctx.request.body);
  if (phase) {
    ctx.status = 201;
    ctx.body = {
      status: 'success',
      data: phase,
    };
  } else {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'Something went wrong',
    };
  }
});

router.post(`${BASE_URL}/timeSlots`, async ctx => {
  const slots = await queries.addTimeSlot(ctx.request.body);
  if (slots) {
    ctx.status = 201;
    ctx.body = {
      status: 'success',
      data: slots,
    };
  } else {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'Something went wrong',
    };
  }
});

router.post(`${BASE_URL}/option`, async ctx => {
  const option = await queries.addOption(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  if (option) {
    ctx.status = 201;
    ctx.body = {
      status: 'success',
      data: option,
    };
  } else {
    ctx.status = 404;
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

router.post(`${BASE_URL}/roster`, async ctx => {
  const entity = await queries.addRoster(ctx.request.body);
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
  await queries.deletePlayerFromRoster(
    ctx.query.id,
    ctx.body.userInfo.id,
  );
  ctx.status = 201;
  ctx.body = {
    status: 'success',
  };
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

router.del(`${BASE_URL}/option`, async ctx => {
  await queries.deleteOption(ctx.query.id);

  ctx.status = 201;
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

module.exports = router;
