const Router = require('koa-router');
const queries = require('../../../db/queries/users');

const router = new Router();
const BASE_URL = '/api/user';

router.get(`${BASE_URL}/transferPerson`, async ctx => {
  const infos = await queries.getTransferInfos(ctx.query.token);
  if (infos) {
    ctx.body = {
      status: 200,
      data: infos,
    };
  } else {
    ctx.body = {
      status: 404,
      message: 'Something went wrong',
    };
  }
});
module.exports = router;
