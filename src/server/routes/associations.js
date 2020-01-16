const Router = require('koa-router');
const queries = require('../db/queries/associations');

const router = new Router();
const BASE_URL = `/api/v1/associations`;

router.get(BASE_URL, async (ctx) => {
  try {
    const associations = await queries.getAllAssociations();
    ctx.body = {
      status: 'success',
      data: associations,
    };
  } catch (err) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: err.message || 'Sorry, an error has occured'
    };
  }
})

router.get(`${BASE_URL}/:id`, async (ctx) => {
  try {
    const association = await queries.getSingleAssociation(ctx.params.id);

    if (association.length) {
      ctx.body = {
        status: 'success',
        data: association,
      }

    } else {
      ctx.status = 404;
      ctx.body = {
        status: 'error',
        message: 'That record does not exist.',
      }
    }
  } catch (err) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: err.message || 'Sorry, an error has occured'
    };
  }
})

router.post(BASE_URL, async (ctx) => {
  try {
    const association = await queries.addAssociation(ctx.request.body);
    if (association.length) {
      ctx.status = 201;
      ctx.body = {
        status: 'success',
        data: association
      };
    } else {
      ctx.status = 400;
      ctx.body = {
        status: 'error',
        message: 'Something went wrong',
      }
    }
  } catch (err) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: err.message || 'Sorry, an error has occured'
    };
  }
})

router.put(`${BASE_URL}/:id`, async (ctx) => {
  try {
    const association = await queries.updateAssociation(ctx.params.id, ctx.request.body);
    if (association.length) {
      ctx.status = 200;
      ctx.body = {
        status: 'success',
        data: association,
      };
    } else {
      ctx.status = 404;
      ctx.body = {
        status: 'error',
        message: 'That association does not exist.'
      };
    }
  } catch (err) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: err.message || 'Sorry, an error has occured'
    };
  }
})

router.delete(`${BASE_URL}/:id`, async (ctx) => {
  try {
    const association = await queries.deleteAssociation(ctx.params.id);
    if (association.length) {
      ctx.status = 200;
      ctx.body = {
        status: 'success',
        data: association
      }
    } else {
      ctx.status = 404;
      ctx.body = {
        status: 'error',
        message: 'That association does not exist.'
      }
    }
  } catch (err) {
    ctx.status = 400;
    ctx.body = { status: 'error', message: err.message || 'Sorry, an error has occured.' }
  }
})

module.exports = router;
