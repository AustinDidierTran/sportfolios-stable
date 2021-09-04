import Router from 'koa-router';

const router = new Router();
const BASE_URL = '/api/posts';
import { ERROR_ENUM } from '../../../../../common/errors/index.js';
import * as service from '../../service/post.js';

router.get(`${BASE_URL}`, async ctx => {
  const result = await service.getFeed(
    ctx.query.userId,
    ctx.query.locationId,
    ctx.query,
  );

  if (!result) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: result };
});

export default router;
