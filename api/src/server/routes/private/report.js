import Router from 'koa-router';
import { getUserId } from '../../helper/userHelper';

const router = new Router();
const BASE_URL = '/api/report';
import * as service from '../../service/report.ts';

router.get(`${BASE_URL}`, async ctx => {
  const userId = getUserId(ctx);
  const report = await service.getReport(ctx.query.reportId, userId);

  ctx.body = { data: report };
});

router.post(`${BASE_URL}`, async ctx => {
  const userId = getUserId(ctx);
  const reportId = await service.createReport(ctx.request.body, userId);

  ctx.body = { data: reportId };
});

export default router;
