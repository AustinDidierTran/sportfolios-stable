const Router = require('koa-router');
const queries = require('../../../db/queries/googleAnalytics');

const router = new Router();
const BASE_URL = '/api/ga';

router.get(`${BASE_URL}/activeEvents`, async ctx => {
  const events = await queries.getAllActiveEvents();
  ctx.body = {
    status: 'success',
    data: events,
  };
});

router.get(`${BASE_URL}/activePageviews`, async ctx => {
  const pageviews = await queries.getAllActivePageviews();
  ctx.body = {
    status: 'success',
    data: pageviews,
  };
});

module.exports = router;
