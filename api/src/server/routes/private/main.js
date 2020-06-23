const Router = require('koa-router');
const queries = require('../../../db/queries/main');

const router = new Router();
const BASE_URL = '/api/data/main';

router.get(`${BASE_URL}/all`, async ctx => {
  const followingUser = await queries.getAllMainInformations(
    ctx.body.userInfo.id,
  );

  ctx.body = {
    status: 'success',
    data: followingUser,
  };
});

module.exports = router;
