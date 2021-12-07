const BASE_URL = '/api/team';
import Router from 'koa-router';
const router = new Router();
import * as service from '../../service/team.js';
import { ERROR_ENUM } from '../../../../../common/errors/index.js';
import { getUserId } from '../../helper/userHelper.js'



router.put(`${BASE_URL}/lineup`, async ctx => {
  const userId = getUserId(ctx);
  const teams = await service.addPlayersToTeam(
    ctx.request.body.teamId,
    ctx.request.body.players,
    userId,
  );

  if (!teams) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: teams };
});

export default router;
