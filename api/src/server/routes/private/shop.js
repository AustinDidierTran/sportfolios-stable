const Router = require('koa-router');
const { ERROR_ENUM } = require('../../../../../common/errors');
const queries = require('../../../db/queries/shop');

const router = new Router();
const BASE_URL = '/api/shop';

router.get(`${BASE_URL}/sales`, async ctx => {
  const data = await queries.getSales(
    ctx.query.id,
    ctx.body.userInfo.id,
  );
  ctx.body = { data };
});

router.get(`${BASE_URL}/sales`, async ctx => {
  const data = await queries.getSales(
    ctx.query.id,
    ctx.body.userInfo.id,
  );
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.get(`${BASE_URL}/getItems`, async ctx => {
  const data = await queries.getItems(
    ctx.query.id,
    ctx.body.userInfo.id,
  );
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});
router.get(`${BASE_URL}/getAllItems`, async ctx => {
  const data = await queries.getAllItems(ctx.query.type);
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.get(`${BASE_URL}/getItem`, async ctx => {
  const data = await queries.getItem(
    ctx.query.id,
    ctx.body.userInfo.id,
  );
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.get(`${BASE_URL}/purchases`, async ctx => {
  const data = await queries.getPurchases(ctx.body.userInfo.id);
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.get(`${BASE_URL}/cartTotal`, async ctx => {
  const data = await queries.getCartTotal(ctx.body.userInfo.id);
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.get(`${BASE_URL}/getCartItems`, async ctx => {
  const data = await queries.getCart(ctx.body.userInfo.id);
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.get(`${BASE_URL}/getCartItemsOrdered`, async ctx => {
  const data = await queries.getCartItemsOrdered(
    ctx.query.id,
    ctx.body.userInfo.id,
  );
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.post(`${BASE_URL}/addCartItem`, async ctx => {
  const data = await queries.addToCart(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.post(`${BASE_URL}/updateCartItems`, async ctx => {
  const data = await queries.updateCartItems(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.delete(`${BASE_URL}/removeAllInstancesFromCart`, async ctx => {
  const data = await queries.removeAllInstancesFromCart(
    ctx.query,
    ctx.body.userInfo.id,
  );
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.delete(`${BASE_URL}/removeCartItemInstance`, async ctx => {
  const data = await queries.removeCartItemInstance(
    ctx.query,
    ctx.body.userInfo.id,
  );
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.delete(`${BASE_URL}/deleteCartItem`, async ctx => {
  const data = await queries.deleteCartItem(ctx.query);
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.delete(`${BASE_URL}/deleteAllCartItems`, async ctx => {
  const data = await queries.deleteAllCartItems(ctx.body.userInfo.id);
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

module.exports = router;
