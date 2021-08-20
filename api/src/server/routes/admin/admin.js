import Router from 'koa-router';
import { ERROR_ENUM } from '../../../../../common/errors/index.js';
import * as service from '../../service/admin.js';

const router = new Router();
const BASE_URL = '/api/admin';

router.get(`${BASE_URL}/users`, async ctx => {
  const users = await service.getAllUsersAndSecond(
    ctx.query.limitNumber,
  );
  if (!users) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: users };
});

router.get(`${BASE_URL}/newsLetterSubscriptions`, async ctx => {
  const users = await service.getAllNewsLetterSubscriptions();
  if (!users) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: users };
});

router.get(`${BASE_URL}/emailsLandingPage`, async ctx => {
  const emails = await service.getEmailsLandingPage();
  if (!emails) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: emails };
});

router.get(`${BASE_URL}/sports`, async ctx => {
  const sports = await service.getAllSports();
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
  const taxRates = await service.getAllTaxRates();
  if (!taxRates) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: taxRates };
});

router.post(`${BASE_URL}/sport`, async ctx => {
  const sport = await service.createSport(ctx.request.body);
  if (!sport.length) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: sport };
});

router.post(`${BASE_URL}/emailLandingPage`, async ctx => {
  const email = await service.addEmailLandingPage(ctx.request.body);
  if (!email) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: email };
});

router.post(`${BASE_URL}/taxRate`, async ctx => {
  const tax = await service.createTaxRate(ctx.request.body);
  if (!tax) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: tax };
});

router.put(`${BASE_URL}/sport/:id`, async ctx => {
  const [sport] = await service.updateSport(
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

router.put(`${BASE_URL}/updateActiveStatusTaxRate`, async ctx => {
  const taxRate = await service.updateActiveStatusTaxRate(
    ctx.request.body,
  );
  if (!taxRate) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: taxRate };
});
router.post(`${BASE_URL}/updateUserRole`, async ctx => {
  const newRole = await service.updateUserRole(
    ctx.request.body.userId,
    ctx.request.body.role,
  );
  if (!newRole) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: newRole };
});

router.del(`${BASE_URL}/deleteTaxRate`, async ctx => {
  const data = await service.deleteTaxRate(ctx.query);
  ctx.body = { data };
});

router.del(`${BASE_URL}/emailLandingPage`, async ctx => {
  const data = await service.deleteEmailLandingPage(ctx.query);
  ctx.body = { data };
});

router.del(`${BASE_URL}/entities`, async ctx => {
  const data = await service.deleteEntities(ctx.query);
  ctx.body = { data };
});

export default router;
