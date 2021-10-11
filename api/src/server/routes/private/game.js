import Router from 'koa-router';
import { ERROR_ENUM } from '../../../../../common/errors/index.js';
import { getUserId } from '../../helper/userHelper.js';
import * as service from '../../service/game.js';

const router = new Router();
const BASE_URL = '/api/game';

/** POST */

router.post(`${BASE_URL}/spirit`, async ctx => {
  const res = await service.submitSpiritScore(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  ctx.body = { data: res };
});

router.post(`${BASE_URL}/ticketOption`, async ctx => {
  const data = await service.postTicketOption(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  ctx.body = { data };
});

router.post(`${BASE_URL}/tickets`, async ctx => {
  const data = await service.addTicketsToCart(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  ctx.body = { data };
});

/** PUT */

router.put(BASE_URL, async ctx => {
  const gameInfo = await service.updateGameInfo(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  ctx.body = {
    data: gameInfo,
  };
});

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

router.get(`${BASE_URL}/purchasedTickets`, async ctx => {
  const userId = getUserId(ctx);

  const purchasedTickets = await service.getPurchasedTickets(
    ctx.query.gameId,
    ctx.query.returnAllTickets,
    userId,
  );

  ctx.body = { data: purchasedTickets };
});

export default router;
