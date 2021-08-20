import Router from 'koa-router';
import { ERROR_ENUM } from '../../../../../common/errors/index.js';
import * as service from '../../service/user.js';
const router = new Router();
const BASE_URL = '/api/user';

router.get(`${BASE_URL}/transferPerson`, async ctx => {
  const infos = await service.getTransferInfos(ctx.query.token);
  if (infos) {
    ctx.body = { data: infos };
  } else {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
});
export default router;
