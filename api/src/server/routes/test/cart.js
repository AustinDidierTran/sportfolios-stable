const Router = require('koa-router');
const { STATUS_ENUM } = require('../../../../../common/enums');
const { ERROR_ENUM } = require('../../../../../common/errors');
const helpers = require('../../../db/helpers/entity');

const router = new Router();
const BASE_URL = '/api/test/cart';

router.get(`${BASE_URL}/removeEventCartItem`, async ctx => {
  const res = await helpers.removeEventCartItem({
    rosterId: ctx.body.rosterId,
  });

  if (res.code === STATUS_ENUM.SUCCESS) {
    ctx.body = { status: 'success' };
  } else {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
});

module.exports = router;
