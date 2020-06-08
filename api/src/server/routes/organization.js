const Router = require('koa-router');
const queries = require('../../db/queries/organization');

const router = new Router();
const BASE_URL = '/api/organization';

router.get(`${BASE_URL}s`, async ctx => {
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

router.get(`${BASE_URL}`, async ctx => {
  try {
    const organization = await queries.getSingleOrganization(
      ctx.query.id,
      ctx.body.userInfo.id,
    );

    if (organization) {
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
    const organizationId = await queries.addOrganization(
      ctx.request.body,
    );

    if (organizationId) {
      ctx.status = 201;
      ctx.body = {
        status: 'success',
        data: organizationId,
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

router.put(BASE_URL, async ctx => {
  try {
    const organization = await queries.updateOrganization(
      ctx.request.body.id,
      ctx.request.body.organization,
    );
    if (organization) {
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
