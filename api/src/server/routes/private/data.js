const Router = require('koa-router');
const queries = require('../../../db/queries/data');

const router = new Router();
const BASE_URL = '/api/data';

router.get(`${BASE_URL}/search/global`, async ctx => {
  const { query } = ctx.query;
  const previousSearchQueries = await queries.globalSearch(
    ctx.body.userInfo.id,
    query,
  );
  ctx.body = {
    status: 'success',
    data: previousSearchQueries,
  };
});

router.get(`${BASE_URL}/search/previous`, async ctx => {
  const previousSearchQueries = await queries.getPreviousSearchQueries(
    ctx.body.userInfo.id,
  );
  ctx.body = {
    status: 'success',
    data: previousSearchQueries,
  };
});

module.exports = router;
