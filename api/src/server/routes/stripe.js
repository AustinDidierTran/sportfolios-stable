const Router = require('koa-router');
const queries = require('../../db/queries/stripe');

const router = new Router();
const BASE_URL = '/api/stripe';

router.get(`${BASE_URL}/accountLink`, async ctx => {
  try {
    const data = await queries.getAccountLink(
      ctx.query.id,
      ctx.request.ip,
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

router.post(`${BASE_URL}/externalAccount`, async ctx => {
  try {
    const data = await queries.addExternalAccount(
      ctx.request.body,
      ctx.body.userInfo.id,
      ctx.request.ip,
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
