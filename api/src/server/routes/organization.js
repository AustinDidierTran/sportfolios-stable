const Router = require('koa-router');
const queries = require('../../db/queries/organization');

const router = new Router();
const BASE_URL = '/api/organization';

router.get(BASE_URL, async ctx => {
  const { includeDeleted } = ctx.query;

  try {
    const organizations = await queries.getAllOrganizations(
      includeDeleted,
    );
    ctx.body = {
      status: 'success',
      data: organizations,
    };
  } catch (err) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: err.message || 'Sorry, an error has occured',
    };
  }
});

router.get(`${BASE_URL}/:id`, async ctx => {
  try {
    const organization = await queries.getSingleOrganization(
      ctx.params.id,
    );

    if (organization.length) {
      ctx.body = {
        status: 'success',
        data: organization,
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

router.post(BASE_URL, async ctx => {
  try {
    const organization = await queries.addOrganization(
      ctx.request.body,
    );
    if (organization.length) {
      ctx.status = 201;
      ctx.body = {
        status: 'success',
        data: organization,
      };
    } else if (false) {
      //expired token
      ctx.status = 405;
      ctx.body = {
        status: 'error',
        message: 'Expired token',
      };
    } else if (false) {
      //not a user
      ctx.status = 406;
      ctx.body = {
        status: 'error',
        message: 'No token',
      };
    } else {
      ctx.status = 400;
      ctx.body = {
        status: 'error',
        message: 'Something went wrong',
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

router.put(`${BASE_URL}/:id`, async ctx => {
  try {
    const organization = await queries.updateOrganization(
      ctx.params.id,
      ctx.request.body,
    );
    if (organization.length) {
      ctx.status = 200;
      ctx.body = {
        status: 'success',
        data: organization,
      };
    } else {
      ctx.status = 404;
      ctx.body = {
        status: 'error',
        message: 'That organization does not exist.',
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

router.delete(`${BASE_URL}/:id`, async ctx => {
  try {
    const organization = await queries.deleteOrganization(
      ctx.params.id,
    );
    if (organization.length) {
      ctx.status = 200;
      ctx.body = {
        status: 'success',
        data: organization,
      };
    } else {
      ctx.status = 404;

      ctx.body = {
        status: 'error',
        message: 'That organization does not exist.',
      };
    }
  } catch (err) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: err.message || 'Sorry, an error has occured.',
    };
  }
});

router.put(`${BASE_URL}/restore/:id`, async ctx => {
  try {
    const organization = await queries.restoreOrganization(
      ctx.params.id,
    );
    if (organization.length) {
      ctx.status = 200;
      ctx.body = {
        status: 'success',
        data: organization,
      };
    } else {
      ctx.status = 404;
      ctx.body = {
        status: 'error',
        message: 'That organization does not exist.',
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
