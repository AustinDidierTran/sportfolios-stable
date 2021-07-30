const Router = require('koa-router');
const { ERROR_ENUM } = require('../../../../../common/errors');
const queries = require('../../../db/queries/dev');

const router = new Router();
const BASE_URL = '/api/dev';

router.get(`${BASE_URL}/stripe`, async ctx => {
  const data = await queries.stripe(ctx.request.ip);
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

module.exports = router;
