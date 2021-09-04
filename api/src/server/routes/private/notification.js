import Router from 'koa-router';
import { ERROR_ENUM } from '../../../../../common/errors/index.js';
import * as service from '../../service/notification.js';
const router = new Router();
const BASE_URL = '/api/notifications';

router.delete(`${BASE_URL}/delete`, async ctx => {
  const res = await service.deleteNotification(
    ctx.request.body.notificationId,
  );
  if (!res) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: res };
});

router.put(`${BASE_URL}/click`, async ctx => {
  const res = await service.clickNotification(
    ctx.request.body.notificationId,
  );
  if (!res) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: res };
});

router.put(`${BASE_URL}/see`, async ctx => {
  const res = await service.seeNotifications(ctx.body.userInfo.id);
  if (!res) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: res };
});

router.get(`${BASE_URL}/unseenCount`, async ctx => {
  const count = await service.countUnseenNotifications(
    ctx.body.userInfo.id,
  );
  if (!count) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: count };
});

router.get(`${BASE_URL}/all`, async ctx => {
  const notifications = await service.getNotifications(
    ctx.body.userInfo.id,
    ctx.query,
  );
  if (!notifications) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: notifications };
});
router.get(`${BASE_URL}/settings/all`, async ctx => {
  const settings = await service.getNotificationsSettings(
    ctx.body.userInfo.id,
  );
  if (!settings) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: settings };
});

router.put(`${BASE_URL}/settings`, async ctx => {
  const res = await service.setNotificationsSettings(
    ctx.body.userInfo.id,
    ctx.request.body,
  );
  if (!res) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: res };
});
export default router;
