const Router = require('koa-router');
const { ERROR_ENUM } = require('../../../../../common/errors');
const queries = require('../../../db/queries/users');
const router = new Router();
const BASE_URL = '/api/user';

router.get(`${BASE_URL}/transferPerson`, async ctx => {
  const infos = await queries.getTransferInfos(ctx.query.token);
  if (infos) {
    ctx.body = { data: infos };
  } else {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
});
module.exports = router;
