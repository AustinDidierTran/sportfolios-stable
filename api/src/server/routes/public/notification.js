import Router from 'koa-router';
import { ERROR_ENUM } from '../../../../../common/errors/index.js';
const router = new Router();
const BASE_URL = '/api/notifications';
import * as service from '../../service/notification.js';

router.post(
  `${BASE_URL}/sendMessageToSportfoliosAdmin`,
  async ctx => {
    const email = await service.sendMessageToSportfoliosAdmin(
      ctx.request.body,
    );
    if (!email) {
      throw new Error(ERROR_ENUM.ERROR_OCCURED);
    }
    ctx.body = { data: email };
  },
);

export default router;
