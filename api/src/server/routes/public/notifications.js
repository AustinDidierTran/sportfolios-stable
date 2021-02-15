const Router = require('koa-router');

const { STATUS_ENUM } = require('../../../../../common/enums');
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
      ctx.status = STATUS_ENUM.SUCCESS;
      ctx.body = {
        status: STATUS_ENUM.SUCCESS_STRING,
        data: email,
      };
    } else {
      ctx.status = STATUS_ENUM.ERROR;
      ctx.body = {
        status: STATUS_ENUM.ERROR_STRING,
        message: ERROR_ENUM.ERROR_OCCURED,
      };
    }
  },
);

module.exports = router;
