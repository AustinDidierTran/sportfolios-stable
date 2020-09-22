const Router = require('koa-router');
const helpers = require('../../../db/helpers/stripe');

const router = new Router();
const BASE_URL = '/api/test/stripe';

router.post(`${BASE_URL}/connectedAccount`, async ctx => {
  const account = await helpers.createStripeConnectedAccount(
    ctx.request.body,
  );

  const accountLink = await helpers.createAccountLink2(account.id);

  if (res.code === 200) {
    ctx.status = 200;
    ctx.body = {
      status: 'success',
      data: { accountId: account.id, accountLink },
    };
  } else {
    ctx.status = res.code;
    ctx.body = {
      status: 'error',
    };
  }
});

module.exports = router;
