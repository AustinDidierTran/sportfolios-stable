const Router = require('koa-router');
const { ERROR_ENUM } = require('../../../../../common/errors');
const queries = require('../../../db/queries/notifications');

const router = new Router();
const BASE_URL = '/api/notifications';

router.delete(`${BASE_URL}/delete`, async ctx => {
  const res = await queries.deleteNotification(
    ctx.request.body.notificationId,
  );
  if (!res) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: res };
});

router.put(`${BASE_URL}/click`, async ctx => {
  const res = await queries.clickNotification(
    ctx.request.body.notificationId,
  );
  if (!res) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: res };
});

router.put(`${BASE_URL}/see`, async ctx => {
  const res = await queries.seeNotifications(ctx.body.userInfo.id);
  if (!res) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: res };
});

router.get(`${BASE_URL}/unseenCount`, async ctx => {
  const count = await queries.countUnseenNotifications(
    ctx.body.userInfo.id,
  );
  if (!count) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: count };
});

router.get(`${BASE_URL}/all`, async ctx => {
  const notifications = await queries.getNotifications(
    ctx.body.userInfo.id,
    ctx.query,
  );
  if (!notifications) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: notifications };
});
router.get(`${BASE_URL}/settings/all`, async ctx => {
  const settings = await queries.getNotificationsSettings(
    ctx.body.userInfo.id,
  );
  if (!settings) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: settings };
});

router.put(`${BASE_URL}/settings`, async ctx => {
  const res = await queries.setNotificationsSettings(
    ctx.body.userInfo.id,
    ctx.request.body,
  );
  if (!res) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: res };
});
module.exports = router;
