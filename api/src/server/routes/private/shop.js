import Router from 'koa-router';
import { ERROR_ENUM } from '../../../../../common/errors/index.js';
import * as service from '../../service/shop.js';

const router = new Router();
const BASE_URL = '/api/shop';

router.get(`${BASE_URL}/sales`, async ctx => {
  const data = await service.getSales(
    ctx.query.id,
    ctx.body.userInfo.id,
  );
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.get(`${BASE_URL}/sales`, async ctx => {
  const data = await service.getSales(
    ctx.query.id,
    ctx.body.userInfo.id,
  );
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.get(`${BASE_URL}/getAllItems`, async ctx => {
  const data = await service.getAllItems(ctx.query.type);
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.get(`${BASE_URL}/getItem`, async ctx => {
  const data = await service.getItem(
    ctx.query.id,
    ctx.body.userInfo.id,
  );
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.get(`${BASE_URL}/purchases`, async ctx => {
  const data = await service.getPurchases(ctx.body.userInfo.id);
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.get(`${BASE_URL}/cartTotal`, async ctx => {
  const data = await service.getCartTotal(ctx.body.userInfo.id);
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.get(`${BASE_URL}/getCartItems`, async ctx => {
  const data = await service.getCart(ctx.body.userInfo.id);
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.get(`${BASE_URL}/getCartItemsOrdered`, async ctx => {
  const data = await service.getCartItemsOrdered(
    ctx.query.id,
    ctx.body.userInfo.id,
  );
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.post(`${BASE_URL}/addCartItem`, async ctx => {
  const data = await service.addToCart(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.post(`${BASE_URL}/updateCartItems`, async ctx => {
  const data = await service.updateCartItems(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.delete(`${BASE_URL}/removeAllInstancesFromCart`, async ctx => {
  const data = await service.removeAllInstancesFromCart(
    ctx.query,
    ctx.body.userInfo.id,
  );
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.delete(`${BASE_URL}/removeCartItemInstance`, async ctx => {
  const data = await service.removeCartItemInstance(
    ctx.query,
    ctx.body.userInfo.id,
  );
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.delete(`${BASE_URL}/deleteCartItem`, async ctx => {
  const data = await service.deleteCartItem(ctx.query);
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.delete(`${BASE_URL}/deleteAllCartItems`, async ctx => {
  const data = await service.deleteAllCartItems(ctx.body.userInfo.id);
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

export default router;
