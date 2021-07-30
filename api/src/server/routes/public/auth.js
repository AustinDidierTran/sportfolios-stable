const Router = require('koa-router');
const { STATUS_ENUM } = require('../../../../../common/enums');
const { ERROR_ENUM } = require('../../../../../common/errors');
const queries = require('../../../db/queries/auth');

const router = new Router();
const BASE_URL = '/api/auth';

router.post(`${BASE_URL}/signup`, async ctx => {
  const res = await queries.signup(ctx.request.body);

  if (res.code === STATUS_ENUM.SUCCESS) {
    ctx.body = { data: res };
  } else {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
});

router.post(`${BASE_URL}/login`, async ctx => {
  const { token, userInfo } = await queries.login(ctx.request.body);

  if (!token) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: JSON.stringify({ token, userInfo }) };
});

router.get(`${BASE_URL}/loginWithToken`, async ctx => {
  const res = await queries.loginWithToken(ctx.query.token);
  if (!res) {
    throw new Error(STATUS_ENUM.ERROR_STRING);
  }
  ctx.body = { data: res };
});

router.post(`${BASE_URL}/transferPersonSignup`, async ctx => {
  const res = await queries.transferPersonSignup(ctx.request.body);
  if (!res) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: res };
});

// Confirm email
router.post(`${BASE_URL}/confirmEmail`, async ctx => {
  const res = await queries.confirmEmail(ctx.request.body);

  if (!res) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: res };
});

// Resend confirmation email
router.post(`${BASE_URL}/sendConfirmationEmail`, async ctx => {
  const code = await queries.resendConfirmationEmail(
    ctx.request.body,
  );

  if (code === STATUS_ENUM.SUCCESS) {
    ctx.body = { data: code };
  } else {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
});

// Send password recovery email
router.post(`${BASE_URL}/recoveryEmail`, async ctx => {
  const code = await queries.recoveryEmail(ctx.request.body);

  if (code === STATUS_ENUM.SUCCESS) {
    ctx.body = { data: code };
  } else {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
});

// Reset password with token
router.post(`${BASE_URL}/recoverPassword`, async ctx => {
  const res = await queries.recoverPassword(ctx.request.body);

  if (!res) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  } else {
    ctx.body = { data: res };
  }
});

module.exports = router;
