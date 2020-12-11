const Router = require('koa-router');
const queries = require('../../../db/queries/data');

const router = new Router();
const BASE_URL = '/api/data';

router.get(`${BASE_URL}/search/global`, async ctx => {
  try {
    const previousSearchQueries = await queries.globalSearch(
      ctx.body.userInfo.id,
      ctx.query.query,
      ctx.query.type,
      ctx.query.blackList,
      ctx.query.whiteList,
    );
    ctx.body = {
      status: 'success',
      data: previousSearchQueries,
    };
  } catch (err) {
    console.log(err);
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: err.message || 'Sorry, an error has occured',
    };
  }
});

router.get(`${BASE_URL}/search/myTeamsSearch`, async ctx => {
  try {
    const previousSearchQueries = await queries.myTeamsSearch(
      ctx.body.userInfo.id,
      ctx.query.query,
      ctx.query.eventId,
    );
    ctx.body = {
      status: 'success',
      data: previousSearchQueries,
    };
  } catch (err) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: err.message || 'Sorry, an error has occured',
    };
  }
});

router.get(`${BASE_URL}/search/previous`, async ctx => {
  const previousSearchQueries = await queries.getPreviousSearchQueries(
    ctx.body.userInfo.id,
  );
  ctx.body = {
    status: 'success',
    data: previousSearchQueries,
  };
});

module.exports = router;
