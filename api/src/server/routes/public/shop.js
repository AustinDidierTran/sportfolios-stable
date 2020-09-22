const Router = require('koa-router');
const queries = require('../../../db/queries/shop');

const router = new Router();
const BASE_URL = '/api/shop';

router.get(`${BASE_URL}/getItem`, async ctx => {
  const data = await queries.getItem(ctx.query.id);
  ctx.body = {
    status: 'success',
    data,
  };
});

module.exports = router;
