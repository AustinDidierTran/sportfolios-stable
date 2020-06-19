const Router = require('koa-router');
const queries = require('../../../db/queries/shop');

const router = new Router();
const BASE_URL = '/api/shop';

router.get(`${BASE_URL}/getItems`, async ctx => {
  try {
    const data = await queries.getItems(
      ctx.query.id,
      ctx.body.userInfo.id,
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
