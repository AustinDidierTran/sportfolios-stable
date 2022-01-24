import Router from 'koa-router';
import * as service from '../../service/organization.ts';
import { ERROR_ENUM } from '../../../../../common/errors/index.js';
const router = new Router();
const BASE_URL = '/api/organization';

router.get(`${BASE_URL}/members`, async ctx => {
  const members = await service.getMembers(ctx.query, ctx.body.userInfo.id);

  if (!members) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }

  ctx.body = { data: members };
});

router.get(`${BASE_URL}/generateReport`, async ctx => {
  const report = await service.generateReportV2(
    ctx.query.reportId,
    ctx.body.userInfo.id,
  );

  if (!report) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: report };
});

router.get(`${BASE_URL}/reports`, async ctx => {
  const reports = await service.getReports(ctx.query.id);

  if (!reports) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: reports };
});

export default router;
