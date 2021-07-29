const Router = require('koa-router');
const { ERROR_ENUM } = require('../../../../../common/errors');
const queries = require('../../../db/queries/admin');
const gaQueries = require('../../../db/queries/googleAnalytics');

const router = new Router();
const BASE_URL = '/api/admin';

router.get(`${BASE_URL}/users`, async ctx => {
  const users = await queries.getAllUsersAndSecond();
  if (!users) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: users };
});

router.get(`${BASE_URL}/newsLetterSubscriptions`, async ctx => {
  const users = await queries.getAllNewsLetterSubscriptions();
  if (!users) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: users };
});

router.get(`${BASE_URL}/emailsLandingPage`, async ctx => {
  const emails = await queries.getEmailsLandingPage();
  if (!emails) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: emails };
});

router.get(`${BASE_URL}/sports`, async ctx => {
  const sports = await queries.getAllSports();
  if (!sports) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = {
    data: sports.map(sport => ({
      id: sport.id,
      name: sport.name,
      scoreType: sport.score_type,
    })),
  };
});

router.get(`${BASE_URL}/taxRates`, async ctx => {
  const taxRates = await queries.getAllTaxRates();
  if (!taxRates) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: taxRates };
});

router.get(`${BASE_URL}/gaEvents`, async ctx => {
  const events = await gaQueries.getAllEvents();
  if (!events) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = {
    data: events.map(event => ({
      id: event.id,
      category: event.category,
      enabled: event.enabled,
    })),
  };
});

router.get(`${BASE_URL}/gaPageviews`, async ctx => {
  const pageviews = await gaQueries.getAllPageviews();
  if (!pageviews) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = {
    data: pageviews.map(pageview => ({
      id: pageview.id,
      pathname: pageview.pathname,
      enabled: pageview.enabled,
    })),
  };
});

router.post(`${BASE_URL}/sport`, async ctx => {
  const sport = await queries.createSport(ctx.request.body);
  if (!sport.length) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: sport };
});

router.post(`${BASE_URL}/emailLandingPage`, async ctx => {
  const email = await queries.addEmailLandingPage(ctx.request.body);
  if (!email) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: email };
});

router.post(`${BASE_URL}/taxRate`, async ctx => {
  const tax = await queries.createTaxRate(ctx.request.body);
  if (!tax) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: tax };
});

router.post(`${BASE_URL}/gaPageview`, async ctx => {
  const pageView = await gaQueries.addPageview(
    ctx.request.body.pathname,
    ctx.request.body.enabled,
  );
  if (!pageView.length) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: pageView };
});

router.put(`${BASE_URL}/sport/:id`, async ctx => {
  const [sport] = await queries.updateSport(
    ctx.params.id,
    ctx.request.body,
  );
  if (!sport) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = {
    data: {
      id: sport.id,
      name: sport.name,
      scoreType: sport.score_type,
    },
  };
});

router.put(`${BASE_URL}/gaEvents/:id`, async ctx => {
  const [event] = await gaQueries.updateEvent(
    ctx.params.id,
    ctx.request.body.enabled,
  );
  if (!event) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = {
    data: {
      id: event.id,
      category: event.category,
      enabled: event.enabled,
    },
  };
});

router.put(`${BASE_URL}/updateActiveStatusTaxRate`, async ctx => {
  const taxRate = await queries.updateActiveStatusTaxRate(
    ctx.request.body,
  );
  if (!taxRate) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: taxRate };
});

router.put(`${BASE_URL}/gaPageviews/:id`, async ctx => {
  const [pageview] = await gaQueries.updatePageview(
    ctx.params.id,
    ctx.request.body.enabled,
  );
  if (!pageview) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = {
    data: {
      id: pageview.id,
      pathname: pageview.pathname,
      enabled: pageview.enabled,
    },
  };
});

router.del(`${BASE_URL}/deleteTaxRate`, async ctx => {
  const data = await queries.deleteTaxRate(ctx.query);
  ctx.body = { data };
});

router.del(`${BASE_URL}/emailLandingPage`, async ctx => {
  const data = await queries.deleteEmailLandingPage(ctx.query);
  ctx.body = { data };
});

router.del(`${BASE_URL}/entities`, async ctx => {
  const data = await queries.deleteEntities(ctx.query);
  ctx.body = { data };
});

module.exports = router;
