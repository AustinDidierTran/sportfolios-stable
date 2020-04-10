const Router = require('koa-router');
const queries = require('../../db/queries/profile');

const router = new Router();
const BASE_URL = '/api/profile';

router.get(`${BASE_URL}/:id`, async ctx => {
  try {
    const [userInfo] = await queries.getUserInfo(ctx.params.id);

    if (userInfo) {
      ctx.body = {
        status: 'success',
        data: userInfo,
      };
    } else {
      ctx.status = 404;
      ctx.body = {
        status: 'error',
        message: 'That record does not exist.',
      };
    }
  } catch (err) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: err.message || 'Sorry, an error has occured',
    };
  }
});

module.exports = router;
