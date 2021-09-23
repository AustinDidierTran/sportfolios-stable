import Router from 'koa-router';
import * as service from '../../service/organization.js';

const router = new Router();
const BASE_URL = '/api/admin/organization';

router.get(BASE_URL, async ctx => {
  const data = await service.getAllOrganizationsWithAdmins(ctx.query);

  ctx.body = { data };
});

router.del(BASE_URL, async ctx => {
  await service.deleteOrganization(ctx.query.id, ctx.query.restore);
});

export default router;
