import Router from 'koa-router';
import { STATUS_ENUM } from '../../../../../common/enums/index.js';
import { ERROR_ENUM } from '../../../../../common/errors/index.js';
import * as service from '../../service/stripe.js';
const router = new Router();
const BASE_URL = '/api/test/stripe';

router.post(`${BASE_URL}/connectedAccount`, async ctx => {
  const account = await service.createStripeConnectedAccount(
    ctx.request.body,
  );

  const accountLink = await service.createAccountLink2(account.id);

  if (res.code === STATUS_ENUM.SUCCESS) {
    ctx.body = { data: { accountId: account.id, accountLink } };
  } else {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
});

export default router;
