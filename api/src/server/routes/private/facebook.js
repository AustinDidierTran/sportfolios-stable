const Router = require('koa-router');
const { ERROR_ENUM } = require('../../../../../common/errors');
const queries = require('../../../db/queries/facebook');
const router = new Router();
const BASE_URL = '/api/user';

router.post(`${BASE_URL}/facebookData`, async ctx => {
  const data = await queries.setFacebookData(
    ctx.body.userInfo.id,
    ctx.request.body,
  );
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.post(`${BASE_URL}/facebookConnection`, async ctx => {
  const data = await queries.linkFacebook(
    ctx.body.userInfo.id,
    ctx.request.body,
  );
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.delete(`${BASE_URL}/facebookConnection`, async ctx => {
  const res = await queries.unlinkFacebook(ctx.body.userInfo.id);
  if (!res) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: res };
});

router.get(`${BASE_URL}/connectedApps`, async ctx => {
  const res = await queries.getConnectedApps(ctx.body.userInfo.id);
  if (!res) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: res };
});

router.post(`${BASE_URL}/messengerConnection`, async ctx => {
  const data = await queries.linkMessengerFromFBId(
    ctx.body.userInfo.id,
    ctx.request.body.facebook_id,
  );
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.data = { data };
});

router.delete(`${BASE_URL}/messengerConnection`, async ctx => {
  const res = await queries.unlinkMessenger(ctx.body.userInfo.id);
  if (!res) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: res };
});
