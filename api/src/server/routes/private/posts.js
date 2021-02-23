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
    ctx.request.body.entity_id,
  );

  if (post) {
    ctx.status = 201;
    ctx.body = {
      status: 'success',
      data: post,
    };
  } else {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: 'Something went wrong',
    };
  }
});

router.post(`${BASE_URL}/image`, async ctx => {
  const result = await PostsController.addImage(
    ctx.request.body.postId,
    ctx.request.body.imageUrl,
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

router.get(`${BASE_URL}/organizationFeed`, async ctx => {
  const result = await PostsController.getFeedOrganization(
    ctx.query.userId,
    ctx.query.organizationId,
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

router.post(`${BASE_URL}/like`, async ctx => {
  const result = await PostsController.addLike(
    ctx.request.body.entityId,
    ctx.request.body.postId,
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

router.post(`${BASE_URL}/unlike`, async ctx => {
  const result = await PostsController.deleteLike(
    ctx.request.body.entityId,
    ctx.request.body.postId,
  );
  ctx.status = 201;
  ctx.body = {
    status: STATUS_ENUM.SUCCESS,
    data: result,
  };
});

router.del(`${BASE_URL}/deletePost`, async ctx => {
  await PostsController.deletePost(
    ctx.query.postId,
  );
  ctx.status = 201;
  ctx.body = {
    status: STATUS_ENUM.SUCCESS,
  };
});

router.del(`${BASE_URL}/comment`, async ctx => {
  await PostsController.deleteComment(ctx.query.commentId);

  ctx.status = 201;
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
    ctx.status = 201;
    ctx.body = {
      status: 'success',
      data: commentId,
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
