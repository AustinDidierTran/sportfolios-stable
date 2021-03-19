const Router = require('koa-router');

const router = new Router();
const BASE_URL = '/api/posts';
const { STATUS_ENUM } = require('../../../../../common/enums');

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
    ctx.status = 201;
    ctx.body = {
      status: STATUS_ENUM.SUCCESS,
      data: result,
    };
  } else {
    ctx.status = STATUS_ENUM.ERROR;
    ctx.body = {
      status: STATUS_ENUM.ERROR,
      message: 'Something went wrong',
    };
  }
});



module.exports = router;
