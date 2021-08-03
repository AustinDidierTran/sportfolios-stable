const Router = require('koa-router');

const { ERROR_ENUM } = require('../../../../../common/errors');
const router = new Router();
const BASE_URL = '/api/notifications';
const service = require('../../service/notification');

router.post(
  `${BASE_URL}/sendMessageToSportfoliosAdmin`,
  async ctx => {
    const email = await service.sendMessageToSportfoliosAdmin(
      ctx.request.body,
    );
    if (!email) {
      throw new Error(ERROR_ENUM.ERROR_OCCURED);
    }
    ctx.body = { data: email };
  },
);

module.exports = router;
