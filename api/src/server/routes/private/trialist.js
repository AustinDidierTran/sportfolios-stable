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

module.exports = router;
