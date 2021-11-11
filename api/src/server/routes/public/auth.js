import Router from 'koa-router';
import { STATUS_ENUM } from '../../../../../common/enums/index.js';
import { ERROR_ENUM } from '../../../../../common/errors/index.js';
import * as service from '../../service/auth.js';

const router = new Router();
const BASE_URL = '/api/auth';

router.post(`${BASE_URL}/signup`, async ctx => {
  const res = await service.signup(ctx.request.body);

  if (!res) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  } else {
    ctx.body = { data: res };
  }
});

router.post(`${BASE_URL}/signupWithCognito`, async ctx => {
  const res = await service.signupCognito(ctx.request.body);

  if (!res) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  } else {
    ctx.body = { data: res };
  }
});

router.post(`${BASE_URL}/signupGoogleToken`, async ctx => {
  const res = await service.signupGoogleToken(ctx.request.body);

  if (!res) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  } else {
    ctx.body = { data: res };
  }
});

router.post(`${BASE_URL}/login`, async ctx => {
  const { token, userInfo } = await service.login(ctx.request.body);

  if (!token) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: JSON.stringify({ token, userInfo }) };
});

router.post(`${BASE_URL}/loginWithCognito`, async ctx => {
  const { userInfo } = await service.loginCognito(ctx.request.body);

  if (!userInfo) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: JSON.stringify({ userInfo }) };
});

router.post(`${BASE_URL}/loginWithCognitoToken`, async ctx => {
  const { userInfo } = await service.loginWithCognitoToken(ctx.request.body);

  if (!userInfo) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: JSON.stringify({ userInfo }) };
});

router.get(`${BASE_URL}/loginWithToken`, async ctx => {
  const res = await service.loginWithToken(ctx.query.token);
  if (!res) {
    throw new Error(STATUS_ENUM.ERROR_STRING);
  }
  ctx.body = { data: res };
});

router.post(`${BASE_URL}/transferPersonSignup`, async ctx => {
  const res = await service.transferPersonSignup(ctx.request.body);
  if (!res) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: res };
});

// Confirm email
router.post(`${BASE_URL}/confirmEmail`, async ctx => {
  const res = await service.confirmEmail(ctx.request.body);

  if (!res) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: res };
});

// Migrate account to cognito
router.post(`${BASE_URL}/migrate`, async ctx => {
  const code = await service.migrateToCognito(ctx.request.body);

  if (code !== STATUS_ENUM.SUCCESS) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }

  ctx.body = { data: code };
});

// Resend confirmation email
router.post(`${BASE_URL}/sendConfirmationEmail`, async ctx => {
  const res = await service.resendConfirmationEmail(ctx.request.body);

  if (!res) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: res };
});

// Send password recovery email
router.post(`${BASE_URL}/recoveryEmail`, async ctx => {
  const code = await service.recoveryEmail(ctx.request.body);

  if (code === STATUS_ENUM.SUCCESS) {
    ctx.body = { data: code };
  } else {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
});

// Reset password with token
router.post(`${BASE_URL}/recoverPassword`, async ctx => {
  const res = await service.recoverPassword(ctx.request.body);

  if (!res) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  } else {
    ctx.body = { data: res };
  }
});

// Reset password with token
router.post(`${BASE_URL}/validEmail`, async ctx => {
  const res = await service.validEmail(ctx.request.body);

  ctx.body = { data: res };
});

export default router;
