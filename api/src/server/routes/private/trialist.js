const Router = require('koa-router');
const { STATUS_ENUM } = require('../../../../../common/enums');
const { ERROR_ENUM } = require('../../../../../common/errors');
const queries = require('../../../db/queries/trialist');

const router = new Router();
const BASE_URL = '/api/trialist';

router.post(`${BASE_URL}/createEvaluation`, async ctx => {
  const res = await queries.createEvaluation(
    ctx.request.body.evaluation,
  );
  if (res) {
    ctx.body = {
      status: STATUS_ENUM.SUCCESS_STRING,
    };
  } else {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
});

router.post(`${BASE_URL}/createComment`, async ctx => {
  const res = await queries.createComment(
    ctx.request.body.content,
    ctx.request.body.personId,
    ctx.request.body.exerciseId,
  );
  if (res) {
    ctx.body = {
      data: res,
    };
  } else {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
});

router.get(`${BASE_URL}/comments`, async ctx => {
  const res = await queries.getAllCommentSuggestions(
    ctx.query.personId,
    ctx.query.exerciseId,
  );

  if (res) {
    ctx.body = {
      data: res,
    };
  } else {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
});

router.get(`${BASE_URL}/getPlayerLastEvaluation`, async ctx => {
  const res = await queries.getPlayerLastEvaluation(
    ctx.query.playerId,
  );
  if (res) {
    ctx.body = {
      data: res,
    };
  } else {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
});

router.get(`${BASE_URL}/getPlayerSessionsEvaluations`, async ctx => {
  const res = await queries.getPlayerSessionsEvaluations(
    ctx.query.teamId,
    ctx.query.playerId,
  );
  if (res) {
    ctx.body = {
      data: res,
    };
  } else {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
});

router.get(`${BASE_URL}/getCoachEvaluations`, async ctx => {
  const res = await queries.getCoachEvaluations(
    ctx.query.coachId,
    ctx.query.sessionId,
    ctx.query.exerciseId,
  );
  if (res) {
    ctx.body = {
      data: res,
    };
  } else {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
});

router.get(`${BASE_URL}/getEvaluationComments`, async ctx => {
  const res = await queries.getEvaluationComments(
    ctx.query.evaluationId,
  );

  if (res) {
    ctx.body = {
      data: res,
    };
  } else {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
});

router.get(`${BASE_URL}/getExerciseById`, async ctx => {
  const res = await queries.getExerciseById(ctx.query.exerciseId);

  if (res) {
    ctx.body = {
      data: res,
    };
  } else {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
});

router.post(`${BASE_URL}/createTeamExercise`, async ctx => {
  const res = await queries.createTeamExercise(
    ctx.request.body.exercise,
    ctx.request.body.teamId,
  );

  if (res) {
    ctx.body = {
      status: STATUS_ENUM.SUCCESS_STRING,
    };
  } else {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
});

router.put(`${BASE_URL}/updateExercise`, async ctx => {
  const res = await queries.updateExercise(ctx.request.body.exercise);
  if (res) {
    ctx.body = {
      status: STATUS_ENUM.SUCCESS_STRING,
      body: res,
    };
  } else {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
});

router.put(`${BASE_URL}/updateSession`, async ctx => {
  const res = await queries.updateSession(ctx.request.body.session);
  if (res) {
    ctx.body = {
      status: STATUS_ENUM.SUCCESS_STRING,
      body: res,
    };
  } else {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
});

router.post(`${BASE_URL}/addExerciseToSessions`, async ctx => {
  const res = await queries.addExerciseToSessions(
    ctx.request.body.exerciseId,
    ctx.request.body.sessionsId,
  );
  if (res) {
    ctx.body = {
      status: STATUS_ENUM.SUCCESS_STRING,
      body: res,
    };
  } else {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
});

router.post(`${BASE_URL}/addExercisesToSession`, async ctx => {
  const res = await queries.addExercisesToSession(
    ctx.request.body.sessionId,
    ctx.request.body.exercisesId,
  );
  if (res) {
    ctx.body = {
      status: STATUS_ENUM.SUCCESS_STRING,
      body: res,
    };
  } else {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
});

router.get(`${BASE_URL}/getSessionById`, async ctx => {
  const res = await queries.getSessionById(ctx.query.sessionId);
  if (res) {
    ctx.body = {
      data: res,
    };
  } else {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
});

router.get(`${BASE_URL}/getSessionsByExerciseId`, async ctx => {
  const res = await queries.getSessionsByExerciseId(
    ctx.query.exerciseId,
  );
  if (res) {
    ctx.body = {
      data: res,
    };
  } else {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
});

module.exports = router;
