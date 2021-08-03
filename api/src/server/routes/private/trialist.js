const Router = require('koa-router');
const { ERROR_ENUM } = require('../../../../../common/errors');
const queries = require('../../../db/queries/trialist');

const router = new Router();
const BASE_URL = '/api/trialist';

router.post(`${BASE_URL}/createEvaluation`, async ctx => {
  const res = await queries.createEvaluation(
    ctx.request.body.evaluation,
  );
  if (!res) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: res };
});

router.post(`${BASE_URL}/createComment`, async ctx => {
  const res = await queries.createComment(
    ctx.request.body.content,
    ctx.request.body.personId,
    ctx.request.body.exerciseId,
  );
  if (!res) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: res };
});

router.post(`${BASE_URL}/createComment`, async ctx => {
  const res = await queries.createComment(
    ctx.request.body.content,
    ctx.request.body.personId,
    ctx.request.body.exerciseId,
  );
  if (res) {
    ctx.status = STATUS_ENUM.SUCCESS;
    ctx.body = {
      status: STATUS_ENUM.SUCCESS_STRING,
    };
  } else {
    ctx.status = STATUS_ENUM.ERROR;
    ctx.body = {
      status: STATUS_ENUM.ERROR_STRING,
      message: ERROR_ENUM.ERROR_OCCURED,
    };
  }
});

router.get(`${BASE_URL}/comments`, async ctx => {
  const res = await queries.getAllCommentSuggestions(
    ctx.query.personId,
    ctx.query.exerciseId,
  );

  if (!res) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: res };
});

router.get(`${BASE_URL}/getPlayerLastEvaluation`, async ctx => {
  const res = await queries.getPlayerLastEvaluation(
    ctx.query.playerId,
  );
  if (!res) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: res };
});

router.get(`${BASE_URL}/getPlayerSessionsEvaluations`, async ctx => {
  const res = await queries.getPlayerSessionsEvaluations(
    ctx.query.teamId,
    ctx.query.playerId,
  );
  if (!res) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: res };
});

router.get(`${BASE_URL}/getCoachEvaluations`, async ctx => {
  const res = await queries.getCoachEvaluations(
    ctx.query.coachId,
    ctx.query.sessionId,
    ctx.query.exerciseId,
  );
  if (!res) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: res };
});

router.get(`${BASE_URL}/getEvaluationComments`, async ctx => {
  const res = await queries.getEvaluationComments(
    ctx.query.evaluationId,
  );

  if (!res) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: res };
});

router.get(`${BASE_URL}/getExerciseById`, async ctx => {
  const res = await queries.getExerciseById(ctx.query.exerciseId);

  if (!res) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: res };
});

router.post(`${BASE_URL}/createTeamExercise`, async ctx => {
  const res = await queries.createTeamExercise(
    ctx.request.body.exercise,
    ctx.request.body.teamId,
  );

  if (!res) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: res };
});

router.put(`${BASE_URL}/updateExercise`, async ctx => {
  const res = await queries.updateExercise(ctx.request.body.exercise);
  if (!res) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { body: res };
});

router.put(`${BASE_URL}/updateSession`, async ctx => {
  const res = await queries.updateSession(ctx.request.body.session);
  if (!res) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { body: res };
});

router.post(`${BASE_URL}/addExerciseToSessions`, async ctx => {
  const res = await queries.addExerciseToSessions(
    ctx.request.body.exerciseId,
    ctx.request.body.sessionsId,
  );
  if (!res) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { body: res };
});

router.post(`${BASE_URL}/addExercisesToSession`, async ctx => {
  const res = await queries.addExercisesToSession(
    ctx.request.body.sessionId,
    ctx.request.body.exercisesId,
  );
  if (!res) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { body: res };
});

router.get(`${BASE_URL}/getSessionById`, async ctx => {
  const res = await queries.getSessionById(ctx.query.sessionId);
  if (!res) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: res };
});

router.get(`${BASE_URL}/getSessionsByExerciseId`, async ctx => {
  const res = await queries.getSessionsByExerciseId(
    ctx.query.exerciseId,
  );
  if (!res) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: res };
});

module.exports = router;
