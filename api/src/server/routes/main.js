const Router = require('koa-router');
const queries = require('../../db/queries/main');

const router = new Router();
const BASE_URL = '/api/data/main';

<<<<<<< HEAD
=======

>>>>>>> 861dff54963c97f148cdd1ffd688a3bd44b9b7ac
router.get(`${BASE_URL}/all`, async ctx => {
  try {
    const followingUser = await queries.getAllMainInformations(
      ctx.body.userInfo.id,
    );

    ctx.body = {
      status: 'success',
      data: followingUser,
    };
  } catch (err) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: err.message || 'Sorry, an error has occured',
    };
  }
});

module.exports = router;
