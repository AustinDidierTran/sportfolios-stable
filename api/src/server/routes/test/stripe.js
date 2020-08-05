const Router = require('koa-router');
const helpers = require('../../../db/helpers/stripe');

const router = new Router();
const BASE_URL = '/api/test/stripe';

router.post(`${BASE_URL}/connectedAccount`, async ctx => {
  console.log('salut');
  console.log({ ctx: ctx.request.body });
  const res = await helpers.createStripeConnectedAccount(
    ctx.request.body,
  );

  if (res.code === 200) {
    ctx.status = 200;
    ctx.body = {
      status: 'success',
    };
  } else {
    ctx.status = res.code;
    ctx.body = {
      status: 'error',
    };
  }
});

module.exports = router;
