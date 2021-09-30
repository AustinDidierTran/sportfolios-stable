import Router from 'koa-router';
import * as service from '../../service/organization.js';

const router = new Router();
const BASE_URL = '/api/admin/organization';

router.get(BASE_URL, async ctx => {
  const data = await service.getAllOrganizationsWithAdmins(ctx.query);

  ctx.body = { data };
});

router.put(`${BASE_URL}/verify`, async ctx => {
  const verified = await service.verifyOrganization(
    ctx.query,
    ctx.body.userInfo.id,
  );

  ctx.body = { verified };
});

router.del(BASE_URL, async ctx => {
  await service.deleteOrganization(ctx.query.id, ctx.query.restore);
});

export default router;
