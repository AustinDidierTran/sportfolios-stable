const Router = require('koa-router');
const { STATUS_ENUM } = require('../../../../../common/enums');
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
  const persons = await queries.getOwnedAndTransferedPersons(
    ctx.body.userInfo.id,
  );
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
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  if (success) {
    ctx.status = 200;
    ctx.body = {
      status: 'success',
    };
  } else {
    ctx.status = STATUS_ENUM.ERROR;
    ctx.body = {
      status: 'error',
      message: 'That person does not exist.',
    };
  }
});

router.post(`${BASE_URL}/transferPerson`, async ctx => {
  let person;
  try {
    person = await queries.sendTransferPersonEmail(
      ctx.body.userInfo.id,
      ctx.request.body,
    );
    if (person) {
      ctx.status = STATUS_ENUM.SUCCESS;
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
  } catch (e) {
    throw e;
  }
});

router.delete(`${BASE_URL}/transferPerson`, async ctx => {
  const person = await queries.cancelPersonTransfer(
    ctx.body.userInfo.id,
    ctx.query.id,
  );
  if (person) {
    ctx.status = STATUS_ENUM.SUCCESS;
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

router.get(`${BASE_URL}/transferedPeople`, async ctx => {
  const people = await queries.getPeopleTransferedToUser(
    ctx.body.userInfo.id,
  );
  if (people) {
    ctx.status = 200;
    ctx.body = {
      status: 'success',
      data: people,
    };
  } else {
    ctx.status = STATUS_ENUM.ERROR;
    ctx.body = {
      status: 'error',
      message: 'Something went wrong',
    };
  }
});

router.get(`${BASE_URL}/acceptPersonTransfer`, async ctx => {
  const personId = await queries.transferPerson(
    ctx.query.id,
    ctx.body.userInfo.id,
  );
  if (personId) {
    ctx.status = STATUS_ENUM.SUCCESS;
    ctx.body = {
      status: 'success',
      data: previousOwnerId,
    };
  } else {
    ctx.status = STATUS_ENUM.ERROR;
    ctx.body = {
      status: 'error',
      message: 'Something went wrong',
    };
  }
});

router.get(`${BASE_URL}/declinePersonTransfer`, async ctx => {
  const id = await queries.declinePersonTransfer(ctx.query.id);
  if (id) {
    ctx.status = STATUS_ENUM.SUCCESS;
    ctx.body = {
      status: 'success',
      data: id,
    };
  } else {
    ctx.status = STATUS_ENUM.ERROR;
    ctx.body = {
      status: 'error',
      message: 'Something went wrong',
    };
  }
});

router.post(`${BASE_URL}/facebookData`, async ctx => {
  const data = await queries.setFacebookData(
    ctx.body.userInfo.id,
    ctx.request.body,
  );
  if (data) {
    ctx.body = {
      status: STATUS_ENUM.SUCCESS,
      data: data,
    };
  } else {
    ctx.body = {
      status: STATUS_ENUM.ERROR,
      message: 'Something went wrong',
    };
  }
});

router.post(`${BASE_URL}/facebookConnection`, async ctx => {
  const data = await queries.linkFacebook(
    ctx.body.userInfo.id,
    ctx.request.body,
  );
  if (data) {
    ctx.status = STATUS_ENUM.SUCCESS;
    ctx.body = {
      data: data,
    };
  } else {
    ctx.status = STATUS_ENUM.ERROR;
    ctx.body = {
      message: 'Something went wrong',
    };
  }
});

router.delete(`${BASE_URL}/facebookConnection`, async ctx => {
  try {
    const res = await queries.unlinkFacebook(ctx.body.userInfo.id);
    if (res) {
      ctx.status = 200;
      ctx.body = {
        status: 'success',
        data: res,
      };
    } else {
      ctx.body = {
        status: STATUS_ENUM.ERROR,
        message: 'Something went wrong',
      };
    }
  } catch (e) {
    throw e;
  }
});

router.get(`${BASE_URL}/connectedApps`, async ctx => {
  const res = await queries.getConnectedApps(ctx.body.userInfo.id);
  if (res) {
    ctx.body = {
      status: STATUS_ENUM.SUCCESS,
      data: res,
    };
  } else {
    ctx.status = STATUS_ENUM.ERROR;
    ctx.body = {
      status: 'error',
      message: 'Something went wrong',
    };
  }
});

router.post(`${BASE_URL}/messengerConnection`, async ctx => {
  const data = await queries.linkMessengerFromFBId(
    ctx.body.userInfo.id,
    ctx.request.body.facebook_id,
  );
  if (data) {
    ctx.status = STATUS_ENUM.SUCCESS;
    ctx.data = data;
  } else {
    ctx.status = STATUS_ENUM.ERROR;
    ctx.body = {
      message: 'Something went wrong',
    };
  }
});

module.exports = router;
