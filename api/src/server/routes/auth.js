const Router = require('koa-router');
const queries = require('../../db/queries/auth');

const router = new Router();
const BASE_URL = '/api/auth';

router.post(`${BASE_URL}/signup`, async ctx => {
  try {
    const res = await queries.signup(ctx.request.body);

    if (res.code === 403) {
      ctx.status = 403;
      ctx.body = {
        status: 'error',
        message: 'Email is already in use.'
      }
    } else {
      ctx.status = 200;
      ctx.body = {
        status: 'success',
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

router.post(`${BASE_URL}/login`, async ctx => {
  try {
    const { status, token, userInfo } = await queries.login(ctx.request.body);

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
          userInfo
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
  try {
    const code = await queries.confirmEmail(ctx.request.body);

    if (code === 200) {
      ctx.status = 200;
      ctx.body = {
        status: 'success',
      }
    } else {
      ctx.status = code;
      ctx.body = {
        status: 'error',
      }
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
router.post(`${BASE_URL}/sendConfirmationEmail`, async ctx => {
  try {
    const code = await queries.sendConfirmationEmail(ctx.request.body);

    if (code === 200) {
      ctx.status = 200;
      ctx.body = {
        status: 'success',
      }
    } else if (code === 404) {
      ctx.status = 404;
      ctx.body = {
        status: 'error',
        message: 'Email is not found'
      }
    } else {
      ctx.status = code;
      ctx.body = {
        status: 'error',
      }
    }
  }
  catch (err) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: err.message || 'Sorry, an error has occured',
    };
  }
})


// Send password recovery email
router.post(`${BASE_URL}/recoveryEmail`, async ctx => {
  try {
    const code = await queries.recoveryEmail(ctx.request.body);

    if (code === 200) {
      ctx.status = 200;
      ctx.body = {
        status: 'success',
      }
    } else if (code === 404) {
      ctx.status = 404;
      ctx.body = {
        status: 'error',
        message: 'Email is not found'
      }
    } else {
      ctx.status = code;
      ctx.body = {
        status: 'error',
      }
    }
  } catch (err) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: err.message || 'Sorry, an error has occured',
    };
  }
})

// Reset password with token
router.post(`${BASE_URL}/recoverPassword`, async ctx => {
  try {
    const code = await queries.recoverPassword(ctx.request.body);

    if (code === 200) {
      ctx.status = 200;
      ctx.body = {
        status: 'success',
      }
    } else if (code === 403) {
      ctx.status = 403;
      ctx.body = {
        status: 'error',
        message: 'Token is invalid'
      }
    } else {
      ctx.status = code;
      ctx.body = {
        status: 'error',
      }
    }
  } catch (err) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: err.message || 'Sorry, an error has occured',
    };
  }
})



// Reset password
router.post(`${BASE_URL}/changePassword`, async ctx => {
  try {
    const code = await queries.changePassword(ctx.request.body);

    if (code === 200) {
      ctx.status = 200;
      ctx.body = {
        status: 'success',
      }
    } else if (code === 403) {
      ctx.status = 403;
      ctx.body = {
        status: 'error',
        message: 'Token is invalid'
      }
    } else {
      ctx.status = code;
      ctx.body = {
        status: 'error',
      }
    }
  } catch (err) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: err.message || 'Sorry, an error has occured',
    };
  }
})

// Basic User Info
router.get(`${BASE_URL}/userInfo`, async ctx => {
  try {
    const { basicUserInfo, status } = await queries.userInfo(ctx.request.query);

    if (status === 200) {
      ctx.status = 200;
      ctx.body = {
        status: 'success',
        data: basicUserInfo
      }
    } else if (status === 403) {
      ctx.status = 403;
      ctx.body = {
        status: 'error',
        message: 'Token is invalid'
      }
    } else {
      ctx.status = status;
      ctx.body = {
        status: 'error',
      }
    }
  } catch (err) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: err.message || 'Sorry, an error has occured',
    };
  }
})
// Basic User Info
router.post(`${BASE_URL}/changeBasicUserInfo`, async ctx => {
  try {
    const status = await queries.changeUserInfo(ctx.request.body);

    if (status === 200) {
      ctx.status = 200;
      ctx.body = {
        status: 'success',
      }
    } else if (status === 403) {
      ctx.status = 403;
      ctx.body = {
        status: 'error',
        message: 'Token is invalid'
      }
    } else {
      ctx.status = status;
      ctx.body = {
        status: 'error',
      }
    }
  } catch (err) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: err.message || 'Sorry, an error has occured',
    };
  }
})

module.exports = router;
