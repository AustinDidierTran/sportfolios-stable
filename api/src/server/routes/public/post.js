const Router = require('koa-router');

const router = new Router();
const BASE_URL = '/api/posts';
const { ERROR_ENUM } = require('../../../../../common/errors');
const service = require('../../service/post');

router.get(`${BASE_URL}`, async ctx => {
  const result = await service.getFeed(
    ctx.query.userId,
    ctx.query.locationId,
    ctx.query,
  );

  if (!result) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: result };
});

module.exports = router;
