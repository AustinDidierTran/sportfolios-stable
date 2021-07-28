const Router = require('koa-router');
const queries = require('../../../db/queries/dev');

const router = new Router();
const BASE_URL = '/api/dev';

router.get(`${BASE_URL}/stripe`, async ctx => {
  const data = await queries.stripe(ctx.request.ip);
  ctx.body = {
    data,
  };
});

module.exports = router;
