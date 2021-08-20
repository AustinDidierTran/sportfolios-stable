import Router from 'koa-router';
import { ERROR_ENUM } from '../../../../../common/errors/index.js';
import * as service from '../../service/googleAnalytics.js';
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

export default router;
