const Router = require('koa-router');
const queries = require('../../db/queries/notifications');

const router = new Router();
const BASE_URL = '/api/notifications';

router.post(`${BASE_URL}/follow/see`, async ctx => {
  try {
    await queries.seeFollowNotification(
      ctx.body.userInfo.id,
      ctx.request.body.follower,
    );
    ctx.body = {
      status: 'success',
    };
  } catch (err) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: err.message || 'Sorry, an error has occured',
    };
  }
});

router.get(`${BASE_URL}/all`, async ctx => {
  try {
    const notifications = await queries.getAllNotifications(
      ctx.body.userInfo.id,
    );
    ctx.body = {
      status: 'success',
      data: notifications,
    };
  } catch (err) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: err.message || 'Sorry, an error has occured',
    };
  }
});

module.exports = router;
