const Router = require('koa-router');
const { STATUS_ENUM } = require('../../../../../common/enums');
const queries = require('../../../db/queries/admin');
const gaQueries = require('../../../db/queries/googleAnalytics');

const router = new Router();
const BASE_URL = '/api/admin';

router.get(`${BASE_URL}/users`, async ctx => {
  const users = await queries.getAllUsersAndSecond();

  ctx.body = {
    status: 'success',
    data: users,
  };
});

router.get(`${BASE_URL}/newsLetterSubscriptions`, async ctx => {
  const users = await queries.getAllNewsLetterSubscriptions();

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

router.get(`${BASE_URL}/taxRates`, async ctx => {
  const taxRates = await queries.getAllTaxRates();
  ctx.body = {
    status: 'success',
    data: taxRates,
  };
});

router.get(`${BASE_URL}/gaEvents`, async ctx => {
  const events = await gaQueries.getAllEvents();
  ctx.body = {
    status: 'success',
    data: events.map(event => ({
      id: event.id,
      category: event.category,
      enabled: event.enabled,
    })),
  };
});

router.get(`${BASE_URL}/gaPageviews`, async ctx => {
  const pageviews = await gaQueries.getAllPageviews();
  ctx.body = {
    status: 'success',
    data: pageviews.map(pageview => ({
      id: pageview.id,
      pathname: pageview.pathname,
      enabled: pageview.enabled,
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
router.post(`${BASE_URL}/taxRate`, async ctx => {
  const tax = await queries.createTaxRate(ctx.request.body);
  if (tax) {
    ctx.status = STATUS_ENUM.SUCCESS;
    ctx.body = {
      status: 'success',
      data: tax,
    };
  } else {
    ctx.status = STATUS_ENUM.ERROR;
    ctx.body = {
      status: 'error',
      message: 'Something went wrong',
    };
  }
});

router.post(`${BASE_URL}/gaPageview`, async ctx => {
  const pageView = await gaQueries.addPageview(
    ctx.request.body.pathname,
    ctx.request.body.enabled,
  );
  if (pageView.length) {
    ctx.status = 201;
    ctx.body = {
      status: 'success',
      data: pageView,
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

router.put(`${BASE_URL}/gaEvents/:id`, async ctx => {
  const [event] = await gaQueries.updateEvent(
    ctx.params.id,
    ctx.request.body.enabled,
  );
  if (event) {
    ctx.status = 201;
    ctx.body = {
      status: 'success',
      data: {
        id: event.id,
        category: event.category,
        enabled: event.enabled,
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

router.put(`${BASE_URL}/updateActiveStatusTaxRate`, async ctx => {
  const taxRate = await queries.updateActiveStatusTaxRate(
    ctx.request.body,
  );
  if (taxRate) {
    ctx.status = STATUS_ENUM.SUCCESS;
    ctx.body = {
      status: 'success',
      data: taxRate,
    };
  } else {
    ctx.status = STATUS_ENUM.ERROR;
    ctx.body = {
      status: 'error',
      message: 'That entity does not exist.',
    };
  }
});

router.put(`${BASE_URL}/gaPageviews/:id`, async ctx => {
  const [pageview] = await gaQueries.updatePageview(
    ctx.params.id,
    ctx.request.body.enabled,
  );
  if (pageview) {
    ctx.status = 201;
    ctx.body = {
      status: 'success',
      data: {
        id: pageview.id,
        pathname: pageview.pathname,
        enabled: pageview.enabled,
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

router.del(`${BASE_URL}/deleteTaxRate`, async ctx => {
  const data = await queries.deleteTaxRate(ctx.query);
  ctx.body = {
    status: 'success',
    data,
  };
});

router.del(`${BASE_URL}/entities`, async ctx => {
  const data = await queries.deleteEntities(ctx.query);
  ctx.body = {
    status: 'success',
    data,
  };
});

module.exports = router;
