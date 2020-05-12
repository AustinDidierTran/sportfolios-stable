const Router = require('koa-router');
const queries = require('../../db/queries/stripe');

const router = new Router();
const BASE_URL = '/api/stripe';

router.post(`${BASE_URL}/createAccount`, async ctx => {
  try {
    const data = await queries.createAccount(
      ctx.request.ip,
      ctx.request.body,
    );
    ctx.body = {
      status: 'success',
      data,
    };
  } catch (err) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: err.message || 'Sorry, an error has occured',
    };
  }
});

module.exports = router;
