const Router = require('koa-router');
const queries = require('../../../db/queries/notifications');
const {
  FEATURE_FLAGS,
  handleFlag,
} = require('../../singletons/optimizely');

const router = new Router();
const BASE_URL = '/api/notifications';

router.post(`${BASE_URL}/follow/see`, async ctx => {
  handleFlag(FEATURE_FLAGS.NOTIFICATIONS, ctx.body.userInfo.id);

  await queries.seeFollowNotification(
    ctx.body.userInfo.id,
    ctx.request.body.follower,
  );
  ctx.body = {
    status: 'success',
  };
});

router.get(`${BASE_URL}/all`, async ctx => {
  handleFlag(FEATURE_FLAGS.NOTIFICATIONS, ctx.body.userInfo.id);

  const notifications = await queries.getAllNotifications(
    ctx.body.userInfo.id,
  );
  ctx.body = {
    status: 'success',
    data: notifications,
  };
});

module.exports = router;
