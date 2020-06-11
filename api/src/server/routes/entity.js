const Router = require('koa-router');
const queries = require('../../db/queries/entity');

const router = new Router();
const BASE_URL = '/api/entity';

router.get(BASE_URL, async ctx => {
  try {
    const entity = await queries.getEntity(ctx.query.id);

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
  } catch (err) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: err.message || 'Sorry, an error has occured',
    };
  }
});

router.get(`${BASE_URL}/all`, async ctx => {
  try {
    const entity = await queries.getAllEntities();

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
  } catch (err) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: err.message || 'Sorry, an error has occured',
    };
  }
});

router.get(`${BASE_URL}/roles`, async ctx => {
  try {
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
  } catch (err) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: err.message || 'Sorry, an error has occured',
    };
  }
});

router.get(`${BASE_URL}/s3Signature`, async ctx => {
  try {
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
  } catch (err) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: err.message || 'Sorry, an error has occured',
    };
  }
});

router.put(`${BASE_URL}`, async ctx => {
  try {
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
  } catch (err) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: err.message || 'Sorry, an error has occured',
    };
  }
});

module.exports = router;
