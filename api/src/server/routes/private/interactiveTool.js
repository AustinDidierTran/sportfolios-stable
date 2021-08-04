const Router = require('koa-router');
const service = require('../../service/interactiveTool');
const router = new Router();
const BASE_URL = '/api/entity';

router.post(`${BASE_URL}/addAllInteractiveTool`, async ctx => {
  const res = await service.addAll(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (!res) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: res };
});

module.exports = router;
