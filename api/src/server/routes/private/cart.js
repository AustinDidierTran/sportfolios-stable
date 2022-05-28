import Router from 'koa-router';
import { ERROR_ENUM } from '../../../../../common/errors/index.js';
import * as service from '../../service/cart.ts';
import * as serviceShop from '../../service/shop.js';

const router = new Router();
const BASE_URL = '/api/cart';

router.get(`${BASE_URL}/getCartItems`, async ctx => {
  const data = await service.getCartItems(ctx.body.userInfo.id);
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.get(`${BASE_URL}/cartTotal`, async ctx => {
  const data = await serviceShop.getCartTotal(ctx.body.userInfo.id);
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.get(`${BASE_URL}/getCartItemsOrdered`, async ctx => {
  const data = await serviceShop.getCartItemsOrdered(
    ctx.query.id,
    ctx.body.userInfo.id,
  );
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.post(`${BASE_URL}/addCartItem`, async ctx => {
  const data = await serviceShop.addToCart(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.post(`${BASE_URL}/updateCartItems`, async ctx => {
  const data = await serviceShop.updateCartItems(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.put(`${BASE_URL}/selectedItems`, async ctx => {
  const data = await service.putSelectedItems(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  ctx.body = { data };
});

router.delete(`${BASE_URL}/removeAllInstancesFromCart`, async ctx => {
  const data = await serviceShop.removeAllInstancesFromCart(
    ctx.query,
    ctx.body.userInfo.id,
  );
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.delete(`${BASE_URL}/removeCartItemInstance`, async ctx => {
  const data = await serviceShop.removeCartItemInstance(
    ctx.query,
    ctx.body.userInfo.id,
  );
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.delete(`${BASE_URL}/deleteCartItem`, async ctx => {
  const data = await serviceShop.deleteCartItem(ctx.query);
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.delete(`${BASE_URL}/deleteAllCartItems`, async ctx => {
  const data = await serviceShop.deleteAllCartItems(ctx.body.userInfo.id);
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});
export default router;
