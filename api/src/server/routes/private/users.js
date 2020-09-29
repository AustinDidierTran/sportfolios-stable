const Router = require('koa-router');
const queries = require('../../../db/queries/users');

const router = new Router();
const BASE_URL = '/api/user';

// Add email
router.post(`${BASE_URL}/addEmail`, async ctx => {
  const code = await queries.addEmail(
    ctx.body.userInfo.id,
    ctx.request.body,
  );

  if (code === 200) {
    ctx.status = 200;
    ctx.body = {
      status: 'success',
    };
  } else if (code === 403) {
    ctx.status = 403;
    ctx.body = {
      status: 'error',
      message: 'Token is invalid',
    };
  } else {
    ctx.status = code;
    ctx.body = {
      status: 'error',
    };
  }
});

// Reset password
router.post(`${BASE_URL}/changePassword`, async ctx => {
  const code = await queries.changePassword(
    ctx.body.userInfo.id,
    ctx.request.body,
  );

  if (code === 200) {
    ctx.status = 200;
    ctx.body = {
      status: 'success',
    };
  } else if (code === 403) {
    ctx.status = 403;
    ctx.body = {
      status: 'error',
      message: 'Token is invalid',
    };
  } else {
    ctx.status = code;
    ctx.body = {
      status: 'error',
    };
  }
});

// Basic User Info
router.get(`${BASE_URL}/userInfo`, async ctx => {
  const { basicUserInfo, status } = await queries.userInfo(
    ctx.body.userInfo.id,
  );

  if (status === 200) {
    ctx.status = 200;
    ctx.body = {
      status: 'success',
      data: basicUserInfo,
    };
  } else if (status === 403) {
    ctx.status = 403;
    ctx.body = {
      status: 'error',
      message: 'Token is invalid',
    };
  } else {
    ctx.status = status;
    ctx.body = {
      status: 'error',
    };
  }
});

// Basic User Info
router.post(`${BASE_URL}/changeBasicUserInfo`, async ctx => {
  const status = await queries.changeUserInfo(
    ctx.body.userInfo.id,
    ctx.request.body,
  );

  if (status === 200) {
    ctx.status = 200;
    ctx.body = {
      status: 'success',
    };
  } else if (status === 403) {
    ctx.status = 403;
    ctx.body = {
      status: 'error',
      message: 'Token is invalid',
    };
  } else {
    ctx.status = status;
    ctx.body = {
      status: 'error',
    };
  }
});

// Email Info
router.get(`${BASE_URL}/emails`, async ctx => {
  const { status, emails } = await queries.getEmails(
    ctx.body.userInfo.id,
  );

  if (status === 200) {
    ctx.status = 200;
    ctx.body = {
      status: 'success',
      data: emails,
    };
  } else if (status === 403) {
    ctx.status = 403;
    ctx.body = {
      status: 'error',
      message: 'Token is invalid',
    };
  } else {
    ctx.status = status;
    ctx.body = {
      status: 'error',
    };
  }
});

//Owned persons
router.get(`${BASE_URL}/ownedPersons`, async ctx => {
  const persons = await queries.getOwnedPersons(ctx.body.userInfo.id);
  if (persons) {
    ctx.status = 200;
    ctx.body = {
      status: 'success',
      data: persons,
    };
  } else {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'Something went wrong',
    };
  }
});

router.put(`${BASE_URL}/primaryPerson`, async ctx => {
  const success = await queries.updatePrimaryPerson(
    ctx.body.userInfo.id,
    ctx.request.body,
  );
  if (success) {
    ctx.status = 200;
    ctx.body = {
      status: 'success',
    };
  } else {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'That person does not exist.',
    };
  }
});

router.post(`${BASE_URL}/transferPerson`, async ctx => {
  const person = await queries.sendTransferPersonEmail(
    ctx.body.userInfo.id,
    ctx.request.body,
  );
  if (person) {
    ctx.status = 201;
    ctx.body = {
      status: 'success',
      data: person,
    };
  } else {
    ctx.status = STATUS_ENUM.ERROR;
    ctx.body = {
      status: 'error',
      message: 'Something went wrong',
    };
  }
});

router.delete(`${BASE_URL}/transferPerson`, async ctx => {
  const person = await queries.cancelPersonTransfer(
    ctx.body.userInfo.id,
    ctx.query.id,
  );
  if (person) {
    ctx.status = 200;
    ctx.body = {
      status: 'success',
      data: person,
    };
  } else {
    ctx.status = STATUS_ENUM.ERROR;
    ctx.body = {
      status: 'error',
      message: 'Something went wrong',
    };
  }
});

module.exports = router;
