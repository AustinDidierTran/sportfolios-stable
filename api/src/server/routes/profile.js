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

router.put(`${BASE_URL}/birthDate/:id`, async ctx => {
  try {
    if (ctx.body.userInfo.id !== ctx.params.id) {
      throw Error('Unauthorized operation');
    }

    const res = await queries.updateBirthDate(
      ctx.params.id,
      ctx.request.body,
    );

    if (res.code === 200) {
      ctx.status = 200;
      ctx.body = {
        status: 'success',
      };
    } else {
      ctx.status = res.code;
      ctx.body = {
        status: 'error',
      };
    }
  } catch (err) {
    console.log('inside catch');

    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: err.message || 'Sorry, an error has occured',
    };
  }
});

module.exports = router;
