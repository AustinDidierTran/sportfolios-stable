const Router = require('koa-router');
const queries = require('../../db/queries/admin');

const router = new Router();
const BASE_URL = '/api/admin';

router.get(`${BASE_URL}/users`, async (ctx) => {

  try {
    const users = await queries.getAllUsers();
    console.log('users', users);

    console.log('ctx.body', ctx.body);

    ctx.body = {
      status: 'success',
      data: users,
    };
  } catch (err) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: err.message || 'Sorry, an error has occured'
    };
  }
})

module.exports = router;