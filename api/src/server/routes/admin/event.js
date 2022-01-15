import Router from 'koa-router';
import * as service from '../../service/event';

const router = new Router();
const BASE_URL = '/api/admin/event';

router.get(BASE_URL, async ctx => {
  const data = await service.getAllEventsWithAdmins(ctx.query);

  ctx.body = { data };
});

router.del(BASE_URL, async ctx => {
  await service.deleteEvent(ctx.query.id, ctx.query.restore);
});

export default router;
