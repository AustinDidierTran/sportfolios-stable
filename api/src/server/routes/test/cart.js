const Router = require('koa-router');
const helpers = require('../../../db/helpers/entity');

const router = new Router();
const BASE_URL = '/api/test';

router.get(`${BASE_URL}/removeEventCartItem`, async ctx => {
  const res = await helpers.removeEventCartItem({
    rosterId: 'e1854339-a4cb-4951-8f85-b562510c20b6',
  });

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
