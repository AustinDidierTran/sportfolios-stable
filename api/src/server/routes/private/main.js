const Router = require('koa-router');
const { ERROR_ENUM } = require('../../../../../common/errors');
const queries = require('../../../db/queries/main');

const router = new Router();
const BASE_URL = '/api/data/main';

router.get(`${BASE_URL}/all`, async ctx => {
  const followingUser = await queries.getAllMainInformations(
    ctx.body.userInfo.id,
  );
  if (!followingUser) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: followingUser };
});

module.exports = router;
