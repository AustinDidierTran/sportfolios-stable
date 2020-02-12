const Router = require('koa-router');
const queries = require('../../db/queries/login');
const mail = require('../utils/nodeMailer');
const bcrypt = require('bcrypt');

const router = new Router();
const BASE_URL = '/api/v1';

router.get(`${BASE_URL}/token/:id`, async ctx => {
  const association = await queries.getSingleAssociation(
    ctx.params.id,
  );
});

// router.get(`${BASE_URL}/resend_mail`, async ctx => {
//   await mail.sendMail();
// });

router.post(`${BASE_URL}/signup`, async ctx => {
  console.log('before try');

  try {
    console.log('inside try');

    const token = await queries.signup(ctx.request.body);
    console.log('after queries');

    ctx.body = {
      status: 'success',
      data: JSON.stringify({ token }),
    };
  } catch (err) {
    console.log('err', err);

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
    console.error(err.message);
    ctx.status = 401;
    ctx.body = {
      status: 'error',
      message: err.message || 'Sorry, an error has occured',
    };
  }
});

module.exports = router;
