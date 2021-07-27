const Router = require('koa-router');
const { STATUS_ENUM } = require('../../../../../common/enums');
const { ERROR_ENUM } = require('../../../../../common/errors');
const queries = require('../../../db/queries/users');
const router = new Router();
const BASE_URL = '/api/user';

// Add email
router.post(`${BASE_URL}/addEmail`, async ctx => {
  const code = await queries.addEmail(
    ctx.body.userInfo.id,
    ctx.request.body,
  );

  if (code === STATUS_ENUM.SUCCESS) {
    ctx.body = {
      status: 'success',
    };
  } else if (code === 403) {
    throw new Error(ERROR_ENUM.TOKEN_IS_INVALID);
  } else {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
});

// Reset password
router.post(`${BASE_URL}/changePassword`, async ctx => {
  const code = await queries.changePassword(
    ctx.body.userInfo.id,
    ctx.request.body,
  );

  if (code === STATUS_ENUM.SUCCESS) {
    ctx.body = {
      status: 'success',
    };
  } else if (code === 403) {
    throw new Error(ERROR_ENUM.TOKEN_IS_INVALID);
  } else {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
});

// Basic User Info
router.get(`${BASE_URL}/userInfo`, async ctx => {
  const { basicUserInfo, status } = await queries.userInfo(
    ctx.body.userInfo.id,
  );
  if (status === 200) {
    ctx.body = {
      data: basicUserInfo,
    };
  } else if (status === 403) {
    throw new Error(ERROR_ENUM.TOKEN_IS_INVALID);
  } else {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
});

// Basic User Info
router.post(`${BASE_URL}/changeBasicUserInfo`, async ctx => {
  const status = await queries.changeUserInfo(
    ctx.body.userInfo.id,
    ctx.request.body,
  );

  if (status === 200) {
    ctx.body = {
      status: 'success',
    };
  } else if (status === 403) {
    throw new Error(ERROR_ENUM.TOKEN_IS_INVALID);
  } else {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
});

// Email Info
router.get(`${BASE_URL}/emails`, async ctx => {
  const { status, emails } = await queries.getEmails(
    ctx.body.userInfo.id,
  );

  if (status === 200) {
    ctx.body = {
      data: emails,
    };
  } else if (status === 403) {
    throw new Error(ERROR_ENUM.TOKEN_IS_INVALID);
  } else {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
});

router.get(`${BASE_URL}/getTokenPromoCode`, async ctx => {
  const token = await queries.getTokenPromoCode(ctx.query);
  if (token) {
    ctx.body = {
      data: token,
    };
  } else {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
});

//Owned persons
router.get(`${BASE_URL}/ownedPersons`, async ctx => {
  const persons = await queries.getOwnedAndTransferedPersons(
    ctx.body.userInfo.id,
  );
  if (persons) {
    ctx.body = {
      data: persons,
    };
  } else {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
});

router.get(`${BASE_URL}/ownedPersonsRegistration`, async ctx => {
  const persons = await queries.getOwnedPersonsRegistration(
    ctx.query.eventId,
    ctx.body.userInfo.id,
  );
  if (!persons) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = {
    data: persons,
  };
});

router.put(`${BASE_URL}/primaryPerson`, async ctx => {
  const success = await queries.updatePrimaryPerson(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  if (success) {
    ctx.body = {
      status: 'success',
    };
  } else {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
});

router.put(`${BASE_URL}/useToken`, async ctx => {
  const token = await queries.useToken(ctx.request.body);
  if (token) {
    ctx.body = {
      data: token,
    };
  } else {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
});

router.post(`${BASE_URL}/transferPerson`, async ctx => {
  let person;
  person = await queries.sendTransferPersonEmail(
    ctx.body.userInfo.id,
    ctx.request.body,
  );
  if (person) {
    ctx.body = {
      data: person,
    };
  } else {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
});

router.delete(`${BASE_URL}/transferPerson`, async ctx => {
  const person = await queries.cancelPersonTransfer(
    ctx.body.userInfo.id,
    ctx.query.id,
  );
  if (person) {
    ctx.body = {
      data: person,
    };
  } else {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
});

router.get(`${BASE_URL}/transferedPeople`, async ctx => {
  const people = await queries.getPeopleTransferedToUser(
    ctx.body.userInfo.id,
  );
  if (people) {
    ctx.body = {
      data: people,
    };
  } else {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
});

router.get(`${BASE_URL}/acceptPersonTransfer`, async ctx => {
  const personId = await queries.transferPerson(
    ctx.query.id,
    ctx.body.userInfo.id,
  );
  if (personId) {
    ctx.body = {
      data: previousOwnerId,
    };
  } else {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
});

router.get(`${BASE_URL}/declinePersonTransfer`, async ctx => {
  const id = await queries.declinePersonTransfer(ctx.query.id);
  if (id) {
    ctx.body = {
      data: id,
    };
  } else {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
});

router.post(`${BASE_URL}/facebookData`, async ctx => {
  const data = await queries.setFacebookData(
    ctx.body.userInfo.id,
    ctx.request.body,
  );
  if (data) {
    ctx.body = {
      data: data,
    };
  } else {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
});

router.post(`${BASE_URL}/facebookConnection`, async ctx => {
  const data = await queries.linkFacebook(
    ctx.body.userInfo.id,
    ctx.request.body,
  );
  if (data) {
    ctx.body = {
      data: data,
    };
  } else {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
});

router.delete(`${BASE_URL}/facebookConnection`, async ctx => {
  const res = await queries.unlinkFacebook(ctx.body.userInfo.id);
  if (res) {
    ctx.body = {
      data: res,
    };
  } else {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
});

router.get(`${BASE_URL}/connectedApps`, async ctx => {
  const res = await queries.getConnectedApps(ctx.body.userInfo.id);
  if (res) {
    ctx.body = {
      data: res,
    };
  } else {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
});

router.post(`${BASE_URL}/messengerConnection`, async ctx => {
  const data = await queries.linkMessengerFromFBId(
    ctx.body.userInfo.id,
    ctx.request.body.facebook_id,
  );
  if (data) {
    ctx.data = data;
  } else {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
});

router.delete(`${BASE_URL}/messengerConnection`, async ctx => {
  const res = await queries.unlinkMessenger(ctx.body.userInfo.id);
  if (res) {
    ctx.body = {
      data: res,
    };
  } else {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
});

router.put(`${BASE_URL}/changeSubscription`, async ctx => {
  const data = await queries.updateNewsLetterSubscription(
    ctx.body.userInfo.id,
    ctx.request.body,
  );
  if (data) {
    ctx.body = {
      data: data,
    };
  } else {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
});

module.exports = router;
