const Router = require('koa-router');
const queries = require('../../db/queries/stripe');

const router = new Router();
const BASE_URL = '/api/stripe';

router.get(`${BASE_URL}/accountLink`, async ctx => {
  try {
    const data = await queries.getAccountLink(
      ctx.query.id,
      ctx.request.ip,
    );
    ctx.body = {
      status: 'success',
      data,
    };
  } catch (err) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: err.message || 'Sorry, an error has occured',
    };
  }
});

router.post(`${BASE_URL}/externalAccount`, async ctx => {
  try {
    const { data, status, error } = await queries.addExternalAccount(
      ctx.request.body,
      ctx.body.userInfo.id,
      ctx.request.ip,
    );

    if (error) {
      ctx.status = status;
      ctx.body = {
        status: 'error',
        error: error.message,
      };
    } else {
      ctx.body = {
        status,
        data,
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

router.get(`${BASE_URL}/getStripeAccountId`, async ctx => {
  try {
    const data = await queries.getAccountLink(
      ctx.query.id,
      ctx.request.ip,
    );
    ctx.body = {
      status: 'success',
      data,
    };
  } catch (err) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: err.message || 'Sorry, an error has occured',
    };
  }
});

router.post(`${BASE_URL}/paymentIntent`, async ctx => {
  try {
    const data = await queries.addPaymentIntent(
      ctx.request.body,
      ctx.body.userInfo.id,
      ctx.request.ip,
    );
    ctx.body = {
      status: 'success',
      data,
    };
  } catch (err) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: err.message || 'Sorry, an error has occured',
    };
  }
});

router.post(`${BASE_URL}/createCustomer`, async ctx => {
  try {
    const data = await queries.addCustomer(
      ctx.request.body,
      ctx.body.userInfo.id,
    );
    ctx.body = {
      status: 'success',
      data,
    };
  } catch (err) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: err.message || 'Sorry, an error has occured',
    };
  }
});

router.post(`${BASE_URL}/createInvoiceItem`, async ctx => {
  try {
    const data = await queries.addInvoiceItem(
      ctx.request.body,
      ctx.body.userInfo.id,
    );
    ctx.body = {
      status: 'success',
      data,
    };
  } catch (err) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: err.message || 'Sorry, an error has occured',
    };
  }
});

router.post(`${BASE_URL}/payInvoice2`, async ctx => {
  try {
    const data = await queries.addInvoice(
      ctx.request.body,
      ctx.body.userInfo.id,
    );
    ctx.body = {
      status: 'success',
      data,
    };
  } catch (err) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: err.message || 'Sorry, an error has occured',
    };
  }
});

router.post(`${BASE_URL}/finalizeInvoice`, async ctx => {
  try {
    const data = await queries.finalizeInvoice(
      ctx.request.body,
      ctx.body.userInfo.id,
    );
    ctx.body = {
      status: 'success',
      data,
    };
  } catch (err) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: err.message || 'Sorry, an error has occured',
    };
  }
});

router.post(`${BASE_URL}/payInvoice`, async ctx => {
  try {
    const data = await queries.payInvoice(
      ctx.request.body,
      ctx.body.userInfo.id,
    );
    ctx.body = {
      status: 'success',
      data,
    };
  } catch (err) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: err.message || 'Sorry, an error has occured',
    };
  }
});

router.post(`${BASE_URL}/paymentMethod`, async ctx => {
  try {
    const data = await queries.paymentMethod(
      ctx.request.body,
      ctx.body.userInfo.id,
    );
    ctx.body = {
      status: 'success',
      data,
    };
  } catch (err) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: err.message || 'Sorry, an error has occured',
    };
  }
});

router.post(`${BASE_URL}/attachPaymentMethod`, async ctx => {
  try {
    const data = await queries.attachPaymentMethod(
      ctx.request.body,
      ctx.body.userInfo.id,
    );
    ctx.body = {
      status: 'success',
      data,
    };
  } catch (err) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: err.message || 'Sorry, an error has occured',
    };
  }
});

router.post(`${BASE_URL}/detachPaymentMethod`, async ctx => {
  try {
    const data = await queries.detachPaymentMethod(
      ctx.request.body,
      ctx.body.userInfo.id,
    );
    ctx.body = {
      status: 'success',
      data,
    };
  } catch (err) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: err.message || 'Sorry, an error has occured',
    };
  }
});

router.post(`${BASE_URL}/createProduct`, async ctx => {
  try {
    const data = await queries.createProduct(
      ctx.request.body,
      ctx.body.userInfo.id,
    );
    ctx.body = {
      status: 'success',
      data,
    };
  } catch (err) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: err.message || 'Sorry, an error has occured',
    };
  }
});

router.post(`${BASE_URL}/createPrice`, async ctx => {
  try {
    const data = await queries.createPrice(
      ctx.request.body,
      ctx.body.userInfo.id,
    );
    ctx.body = {
      status: 'success',
      data,
    };
  } catch (err) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: err.message || 'Sorry, an error has occured',
    };
  }
});

router.get(`${BASE_URL}/getProductFromPriceId`, async ctx => {
  try {
    const data = await queries.getProduct(
      ctx.request.body,
      ctx.body.userInfo.id,
    );
    ctx.body = {
      status: 'success',
      data,
    };
  } catch (err) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: err.message || 'Sorry, an error has occured',
    };
  }
});

module.exports = router;
