const Router = require('koa-router');
const { ERROR_ENUM } = require('../../../../../common/errors');
const service = require('../../service/shop');

const router = new Router();
const BASE_URL = '/api/shop';

router.get(`${BASE_URL}/getItem`, async ctx => {
  const data = await service.getItem(ctx.query.id);
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

module.exports = router;
