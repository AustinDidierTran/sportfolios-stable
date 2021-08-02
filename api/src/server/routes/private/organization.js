const Router = require('koa-router');
const service = require('../../service/organization');
const { ERROR_ENUM } = require('../../../../../common/errors');
const router = new Router();
const BASE_URL = '/api/entity';

router.get(`${BASE_URL}/ownedEvents`, async ctx => {
  const entity = await service.getOwnedEvents(
    ctx.query.organizationId,
  );

  if (!entity) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: entity };
});

router.get(`${BASE_URL}/generateReport`, async ctx => {
  const report = await service.generateReport(ctx.query.reportId);

  if (!report) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: report };
});

router.get(`${BASE_URL}/organizationMembers`, async ctx => {
  const entity = await service.getOrganizationMembers(
    ctx.query.id,
    ctx.body.userInfo.id,
  );
  if (!entity) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: entity };
});
