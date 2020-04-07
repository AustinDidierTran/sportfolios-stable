const Router = require('koa-router');
const queries = require('../../db/queries/admin');

const router = new Router();
const BASE_URL = '/api/admin';

router.get(`${BASE_URL}/users`, async (ctx) => {
  try {
    const users = await queries.getAllUsers();
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

router.get(`${BASE_URL}/sports`, async (ctx) => {
  try {
    const sports = await queries.getAllSports();
    ctx.body = {
      status: 'success',
      data: sports.map((sport) => ({
        name: sport.name,
        scoreType: sport.score_type
      })),
    };
  } catch (err) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: err.message || 'Sorry, an error has occured'
    };
  }
})

router.post(`${BASE_URL}/sport`, async (ctx) => {
  try {
    const sport = await queries.createSport(ctx.request.body);
    if (sport.length) {
      ctx.status = 201;
      ctx.body = {
        status: 'success',
        data: sport
      };
    } else {
      ctx.status = 400;
      ctx.body = {
        status: 'error',
        message: 'Something went wrong',
      }
    }
  } catch (err) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: err.message || 'Sorry, an error has occured'
    };
  }
})

module.exports = router;