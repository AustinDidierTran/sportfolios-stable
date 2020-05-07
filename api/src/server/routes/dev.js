const Router = require('koa-router');
const queries = require('../../db/queries/dev');

const router = new Router();
const BASE_URL = '/api/dev';

router.get(`${BASE_URL}/stripe`, async ctx => {
  try {
    const data = await queries.stripe(ctx.request.ip);
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
