const Router = require('koa-router');
const { ERROR_ENUM } = require('../../../../../common/errors');
const service = require('../../service/facebook');
const router = new Router();
const BASE_URL = '/api/user';

router.post(`${BASE_URL}/facebookData`, async ctx => {
  const data = await service.setFacebookData(
    ctx.body.userInfo.id,
    ctx.request.body,
  );
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.post(`${BASE_URL}/facebookConnection`, async ctx => {
  const data = await service.linkFacebook(
    ctx.body.userInfo.id,
    ctx.request.body,
  );
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.delete(`${BASE_URL}/facebookConnection`, async ctx => {
  const res = await service.unlinkFacebook(ctx.body.userInfo.id);
  if (!res) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: res };
});

router.get(`${BASE_URL}/connectedApps`, async ctx => {
  const res = await service.getConnectedApps(ctx.body.userInfo.id);
  if (!res) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: res };
});

router.post(`${BASE_URL}/messengerConnection`, async ctx => {
  const data = await service.linkMessengerFromFBId(
    ctx.body.userInfo.id,
    ctx.request.body.facebook_id,
  );
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.data = { data };
});

router.delete(`${BASE_URL}/messengerConnection`, async ctx => {
  const res = await service.unlinkMessenger(ctx.body.userInfo.id);
  if (!res) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: res };
});
