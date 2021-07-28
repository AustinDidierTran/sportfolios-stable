const Router = require('koa-router');

const { ERROR_ENUM } = require('../../../../../common/errors');
const router = new Router();
const BASE_URL = '/api/notifications';
const queries = require('../../../db/queries/notifications');

router.post(
  `${BASE_URL}/sendMessageToSportfoliosAdmin`,
  async ctx => {
    const email = await queries.sendMessageToSportfoliosAdmin(
      ctx.request.body,
    );
    if (email) {
      ctx.body = { data: email };
    } else {
      throw new Error(ERROR_ENUM.ERROR_OCCURED);
    }
  },
);

module.exports = router;
