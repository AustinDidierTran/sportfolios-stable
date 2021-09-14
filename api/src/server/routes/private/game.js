import Router from 'koa-router';
import { ERROR_ENUM } from '../../../../../common/errors/index.js';
import * as service from '../../service/game.js';

const router = new Router();
const BASE_URL = '/api/game';

/**
 * Event admins who update scores
 */
router.put(`${BASE_URL}/score`, async ctx => {
  const game = await service.updateGameScore(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (!game) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }

  ctx.body = { data: game };
});

export default router;
