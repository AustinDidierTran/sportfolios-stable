const Router = require('koa-router');
const queries = require('../../../db/queries/entity');

const router = new Router();
const BASE_URL = '/api/entity';

router.get(BASE_URL, async ctx => {
  const entity = await queries.getEntity(
    ctx.query.id,
    ctx.body.userInfo.id,
  );

  if (entity) {
    ctx.body = {
      status: 'success',
      data: entity,
    };
  } else {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'That record does not exist.',
    };
  }
});

router.get(`${BASE_URL}/all`, async ctx => {
  const entity = await queries.getAllEntities(ctx.query);

  if (entity) {
    ctx.body = {
      status: 'success',
      data: entity,
    };
  } else {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'That record does not exist.',
    };
  }
});

router.get(`${BASE_URL}/roles`, async ctx => {
  const entity = await queries.getAllRolesEntity(ctx.query.id);

  if (entity) {
    ctx.body = {
      status: 'success',
      data: entity,
    };
  } else {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'That record does not exist.',
    };
  }
});

router.get(`${BASE_URL}/members`, async ctx => {
  const entity = await queries.getMembers(
    ctx.query.personsId,
    ctx.query.id,
  );

  if (entity) {
    ctx.body = {
      status: 'success',
      data: entity,
    };
  } else {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'That record does not exist.',
    };
  }
});

router.get(`${BASE_URL}/memberships`, async ctx => {
  const entity = await queries.getMemberships(ctx.query.id);

  if (entity) {
    ctx.body = {
      status: 'success',
      data: entity,
    };
  } else {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'That record does not exist.',
    };
  }
});

router.get(`${BASE_URL}/s3Signature`, async ctx => {
  const { code, data } = await queries.getS3Signature(
    ctx.body.userInfo.id,
    ctx.query.fileType,
  );

  if (code === 200) {
    ctx.status = 200;
    ctx.body = {
      status: 'success',
      data,
    };
  } else {
    ctx.status = code;
    ctx.body = {
      status: 'error',
    };
  }
});

router.put(`${BASE_URL}`, async ctx => {
  const entity = await queries.updateEntity(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  if (entity) {
    ctx.status = 200;
    ctx.body = {
      status: 'success',
      data: entity,
    };
  } else {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'That entity does not exist.',
    };
  }
});

router.put(`${BASE_URL}/role`, async ctx => {
  const entity = await queries.updateEntityRole(ctx.request.body);
  if (entity) {
    ctx.status = 200;
    ctx.body = {
      status: 'success',
      data: entity,
    };
  } else {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'That entity does not exist.',
    };
  }
});

router.put(`${BASE_URL}/member`, async ctx => {
  const entity = await queries.updateMember(ctx.request.body);
  if (entity) {
    ctx.status = 200;
    ctx.body = {
      status: 'success',
      data: entity,
    };
  } else {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'That entity does not exist.',
    };
  }
});

router.post(BASE_URL, async ctx => {
  const entityId = await queries.addEntity(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (entityId) {
    ctx.status = 201;
    ctx.body = {
      status: 'success',
      data: entityId,
    };
  } else {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: 'Something went wrong',
    };
  }
});

router.post(`${BASE_URL}/role`, async ctx => {
  const entity = await queries.addEntityRole(ctx.request.body);
  if (entity) {
    ctx.status = 201;
    ctx.body = {
      status: 'success',
      data: entity,
    };
  } else {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'Something went wrong',
    };
  }
});

router.post(`${BASE_URL}/member`, async ctx => {
  const entity = await queries.addMember(ctx.request.body);
  if (entity) {
    ctx.status = 201;
    ctx.body = {
      status: 'success',
      data: entity,
    };
  } else {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'Something went wrong',
    };
  }
});

router.del(BASE_URL, async ctx => {
  const entity = await queries.deleteEntity(
    ctx.query.id,
    ctx.body.userInfo.id,
  );
  if (entity) {
    ctx.status = 201;
    ctx.body = {
      status: 'success',
      data: entity,
    };
  } else {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'Something went wrong',
    };
  }
});

module.exports = router;
