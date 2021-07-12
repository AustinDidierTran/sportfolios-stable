const Router = require('koa-router');
const { STATUS_ENUM } = require('../../../../../common/enums');
const { ERROR_ENUM } = require('../../../../../common/errors');
const queries = require('../../../db/queries/trialist');

const router = new Router();
const BASE_URL = '/api/trialist';

router.post(`${BASE_URL}/createEvaluation`, async ctx => {
  console.log('salut');
  const res = await queries.createEvaluation(
    ctx.request.body.evaluation,
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
  const res = await queries.getAllCommentSuggestions();
  if (res) {
    ctx.status = STATUS_ENUM.SUCCESS;
    ctx.body = {
      data: res,
    };
  } else {
    ctx.status = STATUS_ENUM.ERROR;
    ctx.body = {
      status: STATUS_ENUM.ERROR_STRING,
      message: ERROR_ENUM.ERROR_OCCURED,
    };
  }
});

router.get(`${BASE_URL}/getPlayerLastEvaluation`, async ctx => {
  const res = await queries.getPlayerLastEvaluation(
    ctx.query.playerId,
  );
  if (res) {
    ctx.status = STATUS_ENUM.SUCCESS;
    ctx.body = {
      data: res,
    };
  } else {
    ctx.status = STATUS_ENUM.ERROR;
    ctx.body = {
      status: STATUS_ENUM.ERROR_STRING,
      message: ERROR_ENUM.ERROR_OCCURED,
    };
  }
});

router.get(`${BASE_URL}/getPlayerSessionsEvaluations`, async ctx => {
  const res = await queries.getPlayerSessionsEvaluations(
    ctx.query.teamId,
    ctx.query.playerId,
  );
  if (res) {
    ctx.status = STATUS_ENUM.SUCCESS;
    ctx.body = {
      data: res,
    };
  } else {
    ctx.status = STATUS_ENUM.ERROR;
    ctx.body = {
      status: STATUS_ENUM.ERROR_STRING,
      message: ERROR_ENUM.ERROR_OCCURED,
    };
  }
});

router.get(`${BASE_URL}/getCoachEvaluations`, async ctx => {
  const res = await queries.getCoachEvaluations(
    ctx.query.coachId,
    ctx.query.sessionId,
    ctx.query.exerciseId,
  );
  if (res) {
    ctx.status = STATUS_ENUM.SUCCESS;
    ctx.body = {
      data: res,
    };
  } else {
    ctx.status = STATUS_ENUM.ERROR;
    ctx.body = {
      status: STATUS_ENUM.ERROR_STRING,
      message: ERROR_ENUM.ERROR_OCCURED,
    };
  }
});

router.get(`${BASE_URL}/getEvaluationComments`, async ctx => {
  const res = await queries.getEvaluationComments(
    ctx.query.evaluationId,
  );

  if (res) {
    ctx.status = STATUS_ENUM.SUCCESS;
    ctx.body = {
      data: res,
    };
  } else {
    ctx.status = STATUS_ENUM.ERROR;
    ctx.body = {
      status: STATUS_ENUM.ERROR_STRING,
      message: ERROR_ENUM.ERROR_OCCURED,
    };
  }
});

router.post(`${BASE_URL}/createTeamExercise`, async ctx => {
  const res = await queries.createTeamExercise(
    ctx.request.body.exercise,
    ctx.request.body.teamId,
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

router.put(`${BASE_URL}/updateExercise`, async ctx => {
  const res = await queries.updateExercise(ctx.request.body.exercise);
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

router.get(`${BASE_URL}/getSessionById`, async ctx => {
  const res = await queries.getSessionById(ctx.query.sessionId);
  if (res) {
    ctx.status = STATUS_ENUM.SUCCESS;
    ctx.body = {
      data: res,
    };
  } else {
    ctx.status = STATUS_ENUM.ERROR;
    ctx.body = {
      status: STATUS_ENUM.ERROR_STRING,
      message: ERROR_ENUM.ERROR_OCCURED,
    };
  }
});

router.get(`${BASE_URL}/getExercisesByTeamId`, async ctx => {
  const res = await queries.getExercicesByTeamId(ctx.query.teamId);

  if (res) {
    ctx.status = STATUS_ENUM.SUCCESS;
    ctx.body = {
      data: res,
    };
  } else {
    ctx.status = STATUS_ENUM.ERROR;
    ctx.body = {
      status: STATUS_ENUM.ERROR_STRING,
      message: ERROR_ENUM.ERROR_OCCURED,
    };
  }
});

module.exports = router;
