const Router = require('koa-router');

const router = new Router();
const BASE_URL = '/api/posts';
const { STATUS_ENUM } = require('../../../../../common/enums');

const {
  PostsController,
} = require('../../../../../controllers/posts');

router.post(`${BASE_URL}/create`, async ctx => {
  const post = await PostsController.create(
    ctx.request.body,
    ctx.request.body.locationId,
    ctx.request.body.entity_id,
  );

  if (post) {
    ctx.body = {
      data: post,
    };
  } else {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
});

router.put(`${BASE_URL}`, async ctx => {
  await PostsController.edit(
    ctx.request.body.postId,
    ctx.request.body.postContent,
  );

  ctx.body = {
    status: 'success',
  };
});

router.post(`${BASE_URL}/image`, async ctx => {
  const result = await PostsController.addImage(
    ctx.request.body.postId,
    ctx.request.body.imageUrl,
  );

  if (result) {
    ctx.body = {
      data: result,
    };
  } else {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
});

router.post(`${BASE_URL}/like`, async ctx => {
  const result = await PostsController.addLike(
    ctx.request.body.entityId,
    ctx.request.body.postId,
  );

  if (result) {
    ctx.body = {
      data: result,
    };
  } else {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
});

router.post(`${BASE_URL}/unlike`, async ctx => {
  const result = await PostsController.deleteLike(
    ctx.request.body.entityId,
    ctx.request.body.postId,
  );
  ctx.body = {
    data: result,
  };
});

router.del(`${BASE_URL}/deletePost`, async ctx => {
  await PostsController.deletePost(ctx.query.postId);
  ctx.body = {
    status: STATUS_ENUM.SUCCESS,
  };
});

router.del(`${BASE_URL}/comment`, async ctx => {
  await PostsController.deleteComment(ctx.query.commentId);
  ctx.body = {
    status: STATUS_ENUM.SUCCESS,
  };
});

router.post(`${BASE_URL}/comment`, async ctx => {
  const commentId = await PostsController.addComment(
    ctx.request.body.entityId,
    ctx.request.body.postId,
    ctx.request.body.content,
  );

  if (commentId) {
    ctx.body = {
      data: commentId,
    };
  } else {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
});

router.put(`${BASE_URL}/comment`, async ctx => {
  await PostsController.editComment(
    ctx.request.body.commentId,
    ctx.request.body.commentContent,
  );
  ctx.body = {
    status: 'success',
  };
});

module.exports = router;
