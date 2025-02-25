import Router from 'koa-router';
import * as service from '../../service/team.js';

const router = new Router();
const BASE_URL = '/api/admin/team';

router.get(BASE_URL, async ctx => {
  const data = await service.getAllTeamsWithAdmins(ctx.query);

  ctx.body = { data };
});

router.del(BASE_URL, async ctx => {
  await service.deleteTeam(ctx.query.id, ctx.query.restore);
});

export default router;
