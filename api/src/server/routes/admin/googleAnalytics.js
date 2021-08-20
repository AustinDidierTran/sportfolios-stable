import Router from 'koa-router';
import { ERROR_ENUM } from '../../../../../common/errors/index.js';
import * as service from '../../service/googleAnalytics.js';

const router = new Router();
const BASE_URL = '/api/admin';

router.get(`${BASE_URL}/gaEvents`, async ctx => {
  const events = await service.getAllEvents();
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
  const pageviews = await service.getAllPageviews();
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

router.post(`${BASE_URL}/gaPageview`, async ctx => {
  const pageView = await service.addPageview(
    ctx.request.body.pathname,
    ctx.request.body.enabled,
  );
  if (!pageView.length) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: pageView };
});

router.put(`${BASE_URL}/gaEvents/:id`, async ctx => {
  const [event] = await service.updateEvent(
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

router.put(`${BASE_URL}/gaPageviews/:id`, async ctx => {
  const [pageview] = await service.updatePageview(
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

export default router;
