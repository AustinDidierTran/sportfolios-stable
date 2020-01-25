const Router = require('koa-router');
const queries = require('../../db/queries/login');
const bcrypt = require('bcrypt');

const router = new Router();
const BASE_URL = '/api/v1';

router.post(`${BASE_URL}/signup`, async ctx => {
  try {
    const user = await queries.signup(ctx.request.body);
    ctx.body = {
      status: 'success',
    };
  } catch (err) {
    console.error(err.message);
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: err.message || 'Sorry, an error has occured',
    };
  }
});

router.post(`${BASE_URL}/login`, async ctx => {
  try {
    const token = await queries.login(ctx.request.body);

    console.log('token', token);

    ctx.status = 200;
    ctx.body = {
      status: 'success',
      data: JSON.stringify({
        token,
      }),
    };
  } catch (err) {
    console.error(err.message);
    ctx.status = 401;
    ctx.body = {
      status: 'error',
      message: err.message || 'Sorry, an error has occured',
    };
  }
});

module.exports = router;
