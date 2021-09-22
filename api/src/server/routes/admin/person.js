import Router from 'koa-router';
import * as service from '../../service/person.js';

const router = new Router();
const BASE_URL = '/api/admin/person';

router.get(BASE_URL, async ctx => {
  const data = await service.getAllPeopleWithAdmins(ctx.query);
  ctx.body = { data };
});

router.del(BASE_URL, async ctx => {
  await service.deletePerson(ctx.query.id, ctx.query.restore);
});

export default router;
