const Router = require('koa-router');
const queries = require('../../db/queries/auth');

const router = new Router();
const BASE_URL = '/api/auth';

router.post(`${BASE_URL}/signup`, async ctx => {
  try {
    await queries.signup(ctx.request.body);

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

router.post(`${BASE_URL}/login`, async ctx => {
  try {
    const token = await queries.login(ctx.request.body);

    if (!token) {
      ctx.status = 401;
      ctx.body = {
        status: 'error',
        message: 'Login failed',
      };
    } else {
      ctx.status = 200;
      ctx.body = {
        status: 'success',
        data: JSON.stringify({
          token,
        }),
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

// Confirm email
router.post(`${BASE_URL}/confirmEmail`, async ctx => {
  console.log('heyyy')
  console.log(ctx.request.body);
  try {
    queries.confirmEmail(ctx.request.body);

    ctx.status = 200;
    ctx.body = {
      status: 'success'
    }
  } catch (err) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: err.message || 'Sorry, an error has occured',
    };
  }
})

// Resend confirmation email

// Send forgotten password email

// Reset password

module.exports = router;
