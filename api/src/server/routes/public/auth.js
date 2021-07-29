const Router = require('koa-router');
const { STATUS_ENUM } = require('../../../../../common/enums');
const { ERROR_ENUM } = require('../../../../../common/errors');
const queries = require('../../../db/queries/auth');

const router = new Router();
const BASE_URL = '/api/auth';

router.post(`${BASE_URL}/signup`, async ctx => {
  const res = await queries.signup(ctx.request.body);
  if (res.code === STATUS_ENUM.FORBIDDEN) {
    ctx.status = STATUS_ENUM.FORBIDDEN;
    ctx.body = { data: res };
  } else if (res.code === STATUS_ENUM.SUCCESS) {
    ctx.body = { data: res };
  } else {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
});

router.post(`${BASE_URL}/login`, async ctx => {
  const { token, userInfo } = await queries.login(ctx.request.body);

  if (!token) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  } else {
    ctx.body = { data: JSON.stringify({ token, userInfo }) };
  }
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
  if (res) {
    ctx.body = { data: res };
  } else {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
});

// Confirm email
router.post(`${BASE_URL}/confirmEmail`, async ctx => {
  const res = await queries.confirmEmail(ctx.request.body);
  const { status, token, userInfo } = res;

  if (status === STATUS_ENUM.SUCCESS) {
    ctx.body = { data: { token, userInfo } };
  } else {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
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
  } else if (code === STATUS_ENUM.ERROR) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  } else {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
});

// Reset password with token
router.post(`${BASE_URL}/recoverPassword`, async ctx => {
  const { code, authToken, userInfo } = await queries.recoverPassword(
    ctx.request.body,
  );

  if (code === STATUS_ENUM.SUCCESS) {
    ctx.body = { data: { authToken, userInfo } };
  } else if (code === STATUS_ENUM.FORBIDDEN) {
    throw new Error(ERROR_ENUM.TOKEN_IS_INVALID);
  } else {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
});

module.exports = router;
