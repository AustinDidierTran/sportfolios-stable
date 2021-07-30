const Router = require('koa-router');

const router = new Router();
const BASE_URL = '/api/posts';
const { ERROR_ENUM } = require('../../../../../common/errors');

const {
  PostsController,
} = require('../../../../../controllers/posts');

router.get(`${BASE_URL}`, async ctx => {
  const result = await PostsController.getFeed(
    ctx.query.userId,
    ctx.query.locationId,
    ctx.query,
  );

  if (result) {
    ctx.body = { data: result };
  } else {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
});

module.exports = router;
