const Router = require('koa-router');
const queries = require('../../../db/queries/auth');

const router = new Router();
const BASE_URL = '/api/auth';

router.post(`${BASE_URL}/signup`, async ctx => {
  const res = await queries.signup(ctx.request.body);

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
});

router.post(`${BASE_URL}/login`, async ctx => {
  const { status, token, userInfo } = await queries.login(
    ctx.request.body,
  );

  if (!token) {
    ctx.status = status;
    ctx.body = {
      status: 'error',
    };
  } else {
    ctx.status = 200;
    ctx.body = {
      status: 'success',
      data: JSON.stringify({
        token,
        userInfo,
      }),
    };
  }
});

// Confirm email
router.post(`${BASE_URL}/confirmEmail`, async ctx => {
  const res = await queries.confirmEmail(ctx.request.body);
  const { status, token, userInfo } = res;

  if (status === 200) {
    ctx.status = 200;
    ctx.body = {
      status: 'success',
      data: { token, userInfo },
    };
  } else {
    ctx.status = status;
    ctx.body = {
      status: 'error',
    };
  }
});

// Resend confirmation email
router.post(`${BASE_URL}/sendConfirmationEmail`, async ctx => {
  const code = await queries.resendConfirmationEmail(
    ctx.request.body,
  );

  if (code === 200) {
    ctx.status = 200;
    ctx.body = {
      status: 'success',
    };
  } else {
    ctx.status = code;
    ctx.body = {
      status: 'error',
    };
  }
});

// Send password recovery email
router.post(`${BASE_URL}/recoveryEmail`, async ctx => {
  const code = await queries.recoveryEmail(ctx.request.body);

  if (code === 200) {
    ctx.status = 200;
    ctx.body = {
      status: 'success',
    };
  } else if (code === 404) {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'Email is not found',
    };
  } else {
    ctx.status = code;
    ctx.body = {
      status: 'error',
    };
  }
});

// Reset password with token
router.post(`${BASE_URL}/recoverPassword`, async ctx => {
  const code = await queries.recoverPassword(ctx.request.body);

  if (code === 200) {
    ctx.status = 200;
    ctx.body = {
      status: 'success',
    };
  } else if (code === 403) {
    ctx.status = 403;
    ctx.body = {
      status: 'error',
      message: 'Token is invalid',
    };
  } else {
    ctx.status = code;
    ctx.body = {
      status: 'error',
    };
  }
});

module.exports = router;
