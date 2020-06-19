const Router = require('koa-router');
const queries = require('../../../db/queries/users');

const router = new Router();
const BASE_URL = '/api/user';

// Add email
router.post(`${BASE_URL}/addEmail`, async ctx => {
  try {
    const code = await queries.addEmail(
      ctx.body.userInfo.id,
      ctx.request.body,
    );

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
  } catch (err) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: err.message || 'Sorry, an error has occured',
    };
  }
});

// Reset password
router.post(`${BASE_URL}/changePassword`, async ctx => {
  try {
    const code = await queries.changePassword(
      ctx.body.userInfo.id,
      ctx.request.body,
    );

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
  } catch (err) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: err.message || 'Sorry, an error has occured',
    };
  }
});

// Basic User Info
router.get(`${BASE_URL}/userInfo`, async ctx => {
  try {
    const { basicUserInfo, status } = await queries.userInfo(
      ctx.body.userInfo.id,
    );

    if (status === 200) {
      ctx.status = 200;
      ctx.body = {
        status: 'success',
        data: basicUserInfo,
      };
    } else if (status === 403) {
      ctx.status = 403;
      ctx.body = {
        status: 'error',
        message: 'Token is invalid',
      };
    } else {
      ctx.status = status;
      ctx.body = {
        status: 'error',
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

// Basic User Info
router.post(`${BASE_URL}/changeBasicUserInfo`, async ctx => {
  try {
    const status = await queries.changeUserInfo(
      ctx.body.userInfo.id,
      ctx.request.body,
    );

    if (status === 200) {
      ctx.status = 200;
      ctx.body = {
        status: 'success',
      };
    } else if (status === 403) {
      ctx.status = 403;
      ctx.body = {
        status: 'error',
        message: 'Token is invalid',
      };
    } else {
      ctx.status = status;
      ctx.body = {
        status: 'error',
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

// Email Info
router.get(`${BASE_URL}/emails`, async ctx => {
  try {
    const { status, emails } = await queries.getEmails(
      ctx.body.userInfo.id,
    );

    if (status === 200) {
      ctx.status = 200;
      ctx.body = {
        status: 'success',
        data: emails,
      };
    } else if (status === 403) {
      ctx.status = 403;
      ctx.body = {
        status: 'error',
        message: 'Token is invalid',
      };
    } else {
      ctx.status = status;
      ctx.body = {
        status: 'error',
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
