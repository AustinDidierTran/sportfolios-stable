import Router from 'koa-router';
import { ERROR_ENUM } from '../../../../../common/errors/index.js';
import * as service from '../../service/trialist.js';

const router = new Router();
const BASE_URL = '/api/trialist';

router.post(`${BASE_URL}/createEvaluation`, async ctx => {
  const res = await service.createEvaluation(
    ctx.request.body.evaluation,
  );
  if (!res) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: res };
});

router.post(`${BASE_URL}/createComment`, async ctx => {
  const res = await service.createComment(
    ctx.request.body.content,
    ctx.request.body.personId,
    ctx.request.body.exerciseId,
  );
  if (!res) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: res };
});

router.get(`${BASE_URL}/comments`, async ctx => {
  const res = await service.getAllCommentSuggestions(
    ctx.query.personId,
    ctx.query.exerciseId,
  );

  if (!res) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: res };
});

router.get(`${BASE_URL}/getPlayerLastEvaluation`, async ctx => {
  const res = await service.getPlayerLastEvaluation(
    ctx.query.playerId,
  );
  if (!res) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: res };
});

router.get(`${BASE_URL}/getPlayerSessionsEvaluations`, async ctx => {
  const res = await service.getPlayerSessionsEvaluations(
    ctx.query.teamId,
    ctx.query.playerId,
  );
  if (!res) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: res };
});

router.get(`${BASE_URL}/getCoachEvaluations`, async ctx => {
  const res = await service.getCoachEvaluations(
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
  const res = await service.getEvaluationComments(
    ctx.query.evaluationId,
  );

  if (!res) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: res };
});

router.get(`${BASE_URL}/getExerciseById`, async ctx => {
  const res = await service.getExerciseById(ctx.query.exerciseId);

  if (!res) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: res };
});

router.post(`${BASE_URL}/createTeamExercise`, async ctx => {
  const res = await service.createTeamExercise(
    ctx.request.body.exercise,
    ctx.request.body.teamId,
  );

  if (!res) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: res };
});

router.put(`${BASE_URL}/updateExercise`, async ctx => {
  const res = await service.updateExercise(ctx.request.body.exercise);
  if (!res) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { body: res };
});

router.put(`${BASE_URL}/updateSession`, async ctx => {
  const res = await service.updateSession(ctx.request.body.session);
  if (!res) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { body: res };
});

router.post(`${BASE_URL}/addExerciseToSessions`, async ctx => {
  const res = await service.addExerciseToSessions(
    ctx.request.body.exerciseId,
    ctx.request.body.sessionsId,
  );
  if (!res) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { body: res };
});

router.post(`${BASE_URL}/addExercisesToSession`, async ctx => {
  const res = await service.addExercisesToSession(
    ctx.request.body.sessionId,
    ctx.request.body.exercisesId,
  );
  if (!res) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { body: res };
});

router.get(`${BASE_URL}/getSessionById`, async ctx => {
  const res = await service.getSessionById(ctx.query.sessionId);
  if (!res) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: res };
});

router.get(`${BASE_URL}/getSessionsByExerciseId`, async ctx => {
  const res = await service.getSessionsByExerciseId(
    ctx.query.exerciseId,
  );
  if (!res) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: res };
});

export default router;
