const Router = require('koa-router');
const queries = require('../../../db/queries/admin');

const router = new Router();
const BASE_URL = '/api/admin';

router.get(`${BASE_URL}/users`, async ctx => {
  const users = await queries.getAllUsers();
  ctx.body = {
    status: 'success',
    data: users,
  };
});

router.get(`${BASE_URL}/sports`, async ctx => {
  const sports = await queries.getAllSports();
  ctx.body = {
    status: 'success',
    data: sports.map(sport => ({
      id: sport.id,
      name: sport.name,
      scoreType: sport.score_type,
    })),
  };
});

router.post(`${BASE_URL}/sport`, async ctx => {
  const sport = await queries.createSport(ctx.request.body);
  if (sport.length) {
    ctx.status = 201;
    ctx.body = {
      status: 'success',
      data: sport,
    };
  } else {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: 'Something went wrong',
    };
  }
});

router.put(`${BASE_URL}/sport/:id`, async ctx => {
  const [sport] = await queries.updateSport(
    ctx.params.id,
    ctx.request.body,
  );
  if (sport) {
    ctx.status = 201;
    ctx.body = {
      status: 'success',
      data: {
        id: sport.id,
        name: sport.name,
        scoreType: sport.score_type,
      },
    };
  } else {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: 'Something went wrong',
    };
  }
});

module.exports = router;
