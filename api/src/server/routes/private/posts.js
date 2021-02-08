const Router = require('koa-router');

const router = new Router();
const BASE_URL = '/api/posts';

const { PostsController } = require('../../../../../controllers/posts');


router.post(`${BASE_URL}/create`, async ctx => {

  const postId = await PostsController.create(
    ctx.request.body,
    ctx.request.body.entity_id
  );

  if (postId) {
    ctx.status = 201;
    ctx.body = {
      status: 'success',
      data: postId,
    };
  } else {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: 'Something went wrong',
    };
  }
});

router.post(`${BASE_URL}/images`, async ctx => {

  const result = await PostsController.addImage(
    ctx.request.body.postId,
    ctx.request.body.imageUrl
  );
  if (postId) {
    ctx.status = 201;
    ctx.body = {
      status: 'success',
      data: result,
    };
  } else {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: 'Something went wrong',
    };
  }
});
module.exports = router;
