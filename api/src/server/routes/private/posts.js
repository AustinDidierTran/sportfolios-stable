const Router = require('koa-router');

const router = new Router();
const BASE_URL = '/api/posts';

const {
  PostsController,
} = require('../../../../../controllers/posts');

router.post(`${BASE_URL}/create`, async ctx => {
  const post = await PostsController.create(
    ctx.request.body,
    ctx.request.body.locationId,
    ctx.request.body.entity_id,
  );

  if (!post) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: post };
});

router.put(`${BASE_URL}`, async ctx => {
  await PostsController.edit(
    ctx.request.body.postId,
    ctx.request.body.postContent,
  );
});

router.post(`${BASE_URL}/image`, async ctx => {
  const result = await PostsController.addImage(
    ctx.request.body.postId,
    ctx.request.body.imageUrl,
  );

  if (!result) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: result };
});

router.post(`${BASE_URL}/like`, async ctx => {
  const result = await PostsController.addLike(
    ctx.request.body.entityId,
    ctx.request.body.postId,
  );

  if (!result) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: result };
});

router.post(`${BASE_URL}/unlike`, async ctx => {
  const result = await PostsController.deleteLike(
    ctx.request.body.entityId,
    ctx.request.body.postId,
  );
  if (!result) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: result };
});

router.del(`${BASE_URL}/deletePost`, async ctx => {
  await PostsController.deletePost(ctx.query.postId);
});

router.del(`${BASE_URL}/comment`, async ctx => {
  await PostsController.deleteComment(ctx.query.commentId);
});

router.post(`${BASE_URL}/comment`, async ctx => {
  const commentId = await PostsController.addComment(
    ctx.request.body.entityId,
    ctx.request.body.postId,
    ctx.request.body.content,
  );

  if (!commentId) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: commentId };
});

router.put(`${BASE_URL}/comment`, async ctx => {
  await PostsController.editComment(
    ctx.request.body.commentId,
    ctx.request.body.commentContent,
  );
});

module.exports = router;
