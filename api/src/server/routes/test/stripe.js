const Router = require('koa-router');
const { STATUS_ENUM } = require('../../../../../common/enums');
const { ERROR_ENUM } = require('../../../../../common/errors');
const service = require('../../service/stripe');
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

module.exports = router;
