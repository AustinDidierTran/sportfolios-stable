const Router = require('koa-router');
const { ERROR_ENUM } = require('../../../../../common/errors');
const service = require('../../service/googleAnalytics');
const router = new Router();
const BASE_URL = '/api/ga';

router.get(`${BASE_URL}/activeEvents`, async ctx => {
  const events = await service.getAllActiveEvents();
  if (!events) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: events };
});

router.get(`${BASE_URL}/activePageviews`, async ctx => {
  const pageviews = await service.getAllActivePageviews();
  if (!pageviews) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: pageviews };
});

module.exports = router;
