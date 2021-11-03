import Router from 'koa-router';
import { ERROR_ENUM } from '../../../../../common/errors/index.js';
import * as service from '../../service/user.js';

const router = new Router();
const BASE_URL = '/api/user';

// Reset password
router.post(`${BASE_URL}/changePassword`, async ctx => {
  const status = await service.changePassword(
    ctx.body.userInfo.id,
    ctx.request.body,
  );
  if (!status) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: status };
});

// Basic User Info
router.get(`${BASE_URL}/userInfo`, async ctx => {
  const basicUserInfo = await service.userInfo(ctx.body.userInfo.id);

  if (!basicUserInfo) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: basicUserInfo };
});

// Basic User Info
router.post(`${BASE_URL}/changeBasicUserInfo`, async ctx => {
  const status = await service.changeUserInfo(
    ctx.body.userInfo.id,
    ctx.request.body,
  );
  if (!status) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: status };
});

// Email Info
router.get(`${BASE_URL}/emails`, async ctx => {
  const emails = await service.getEmails(ctx.body.userInfo.id);

  if (!emails) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: emails };
});

router.get(`${BASE_URL}/getTokenPromoCode`, async ctx => {
  const token = await service.getTokenPromoCode(ctx.query);
  if (!token) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: token };
});

//Owned persons
router.get(`${BASE_URL}/ownedPersons`, async ctx => {
  const persons = await service.getOwnedAndTransferedPersons(
    ctx.body.userInfo.id,
  );
  if (!persons) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: persons };
});

router.get(`${BASE_URL}/ownedPersonsRegistration`, async ctx => {
  const persons = await service.getOwnedPersonsRegistration(
    ctx.query.eventId,
    ctx.body.userInfo.id,
  );
  if (!persons) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: persons };
});

router.put(`${BASE_URL}/primaryPerson`, async ctx => {
  const success = await service.updatePrimaryPerson(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  if (!success) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
});

router.put(`${BASE_URL}/useToken`, async ctx => {
  const token = await service.useToken(ctx.request.body);
  if (!token) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: token };
});

router.post(`${BASE_URL}/transferPerson`, async ctx => {
  const person = await service.sendTransferPersonEmail(
    ctx.body.userInfo.id,
    ctx.request.body,
  );
  if (!person) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: person };
});

router.delete(`${BASE_URL}/transferPerson`, async ctx => {
  const person = await service.cancelPersonTransfer(
    ctx.body.userInfo.id,
    ctx.query.id,
  );
  if (!person) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: person };
});

router.get(`${BASE_URL}/transferedPeople`, async ctx => {
  const people = await service.getPeopleTransferedToUser(
    ctx.body.userInfo.id,
  );
  if (!people) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: people };
});

router.get(`${BASE_URL}/acceptPersonTransfer`, async ctx => {
  const personId = await service.transferPerson(
    ctx.query.id,
    ctx.body.userInfo.id,
  );
  if (!personId) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: personId };
});

router.get(`${BASE_URL}/declinePersonTransfer`, async ctx => {
  const id = await service.declinePersonTransfer(ctx.query.id);
  if (!id) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: id };
});

router.put(`${BASE_URL}/changeSubscription`, async ctx => {
  const data = await service.updateNewsLetterSubscription(
    ctx.body.userInfo.id,
    ctx.request.body,
  );
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.post(`${BASE_URL}/addEmail`, async ctx => {
  const res = await service.addEmail(
    ctx.request.body.id,
    ctx.request.body.email,
  );

  if (!res) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }

  ctx.body = { data: res };
});
export default router;
