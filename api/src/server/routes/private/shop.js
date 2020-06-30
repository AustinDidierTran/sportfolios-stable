const Router = require('koa-router');
const queries = require('../../../db/queries/shop');

const router = new Router();
const BASE_URL = '/api/shop';

router.get(`${BASE_URL}/getItems`, async ctx => {
  const data = await queries.getItems(
    ctx.query.id,
    ctx.body.userInfo.id,
  );
  ctx.body = {
    status: 'success',
    data,
  };
});

router.get(`${BASE_URL}/getCartItems`, async ctx => {
  const data = await queries.getCart(
    ctx.query.id,
    ctx.body.userInfo.id,
  );
  ctx.body = {
    status: 'success',
    data,
  };
});

router.post(`${BASE_URL}/addCartItem`, async ctx => {
  const data = await queries.addToCart(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  ctx.body = {
    status: 'success',
    data,
  };
});

router.delete(`${BASE_URL}/removeCartItem`, async ctx => {
  const data = await queries.deleteCartItem(
    ctx.query,
    ctx.body.userInfo.id,
  );
  ctx.body = {
    status: 'success',
    data,
  };
});

router.delete(`${BASE_URL}/removeCartItems`, async ctx => {
  const data = await queries.deleteCartItems(
    ctx.query,
    ctx.body.userInfo.id,
  );
  ctx.body = {
    status: 'success',
    data,
  };
});

module.exports = router;
