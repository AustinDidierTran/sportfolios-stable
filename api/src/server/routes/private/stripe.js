const Router = require('koa-router');
const queries = require('../../../db/queries/stripe');

const router = new Router();
const BASE_URL = '/api/stripe';

router.get(`${BASE_URL}/accountLink`, async ctx => {
  const data = await queries.getAccountLink(
    ctx.query.id,
    ctx.request.ip,
  );
  ctx.body = {
    status: 'success',
    data,
  };
});

router.get(`${BASE_URL}/getStripeAccount`, async ctx => {
  const data = await queries.getStripeAccount(ctx.query.id);
  ctx.body = {
    status: 'success',
    data,
  };
});

router.get(`${BASE_URL}/hasStripeAccount`, async ctx => {
  const data = await queries.hasStripeAccount(ctx.query.id);
  ctx.body = {
    status: 'success',
    data,
  };
});
router.get(`${BASE_URL}/hasStripeBankAccount`, async ctx => {
  const data = await queries.hasStripeBankAccount(ctx.query.id);
  ctx.body = {
    status: 'success',
    data,
  };
});

router.get(`${BASE_URL}/eventHasBankAccount`, async ctx => {
  const data = await queries.eventHasBankAccount(
    ctx.query.id,
    ctx.body.userInfo.id,
  );
  ctx.body = {
    status: 'success',
    data,
  };
});

router.post(`${BASE_URL}/externalAccount`, async ctx => {
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
});

router.get(`${BASE_URL}/getCustomerId`, async ctx => {
  const data = await queries.getCustomerId(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  ctx.body = {
    status: 'success',
    data,
  };
});

router.get(`${BASE_URL}/getCustomer`, async ctx => {
  const data = await queries.getCustomer(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  ctx.body = {
    status: 'success',
    data,
  };
});

router.post(`${BASE_URL}/createCustomer`, async ctx => {
  const data = await queries.addCustomer(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  ctx.body = {
    status: 'success',
    data,
  };
});

router.post(`${BASE_URL}/createInvoiceItem`, async ctx => {
  const data = await queries.addInvoiceItem(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  ctx.body = {
    status: 'success',
    data,
  };
});

router.post(`${BASE_URL}/createInvoice`, async ctx => {
  const data = await queries.addInvoice(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  ctx.body = {
    status: 'success',
    data,
  };
});

router.post(`${BASE_URL}/finalizeInvoice`, async ctx => {
  const data = await queries.finalizeInvoice(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  ctx.body = {
    status: 'success',
    data,
  };
});

router.post(`${BASE_URL}/payInvoice`, async ctx => {
  const data = await queries.payInvoice(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  ctx.body = {
    status: 'success',
    data,
  };
});

router.get(`${BASE_URL}/paymentMethods`, async ctx => {
  const data = await queries.getPaymentMethods(ctx.body.userInfo.id);

  ctx.body = {
    status: 'success',
    data,
  };
});

router.post(`${BASE_URL}/paymentMethod`, async ctx => {
  const data = await queries.createPaymentMethod(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  ctx.body = {
    status: 'success',
    data,
  };
});

router.post(`${BASE_URL}/attachPaymentMethod`, async ctx => {
  const data = await queries.attachPaymentMethod(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  ctx.body = {
    status: 'success',
    data,
  };
});

router.post(`${BASE_URL}/detachPaymentMethod`, async ctx => {
  const data = await queries.detachPaymentMethod(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  ctx.body = {
    status: 'success',
    data,
  };
});

router.post(`${BASE_URL}/createProduct`, async ctx => {
  const data = await queries.createProduct(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  ctx.body = {
    status: 'success',
    data,
  };
});

router.post(`${BASE_URL}/createPrice`, async ctx => {
  const data = await queries.createPrice(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  ctx.body = {
    status: 'success',
    data,
  };
});

router.post(`${BASE_URL}/createItem`, async ctx => {
  const data = await queries.createItem(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  ctx.body = {
    status: 'success',
    data,
  };
});

router.post(`${BASE_URL}/editItem`, async ctx => {
  const data = await queries.editItem(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  ctx.body = {
    status: 'success',
    data,
  };
});

router.del(`${BASE_URL}/deleteItem`, async ctx => {
  const data = await queries.deleteItem(ctx.query);
  ctx.body = {
    status: 'success',
    data,
  };
});

//TODO: Link this to a fct (getProduct doesnt exist)
router.get(`${BASE_URL}/getProductFromPriceId`, async ctx => {
  const data = await queries.getProduct(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  ctx.body = {
    status: 'success',
    data,
  };
});

router.get(`${BASE_URL}/getReceipt`, async ctx => {
  const data = await queries.getReceipt(
    ctx.query,
    ctx.body.userInfo.id,
  );
  ctx.body = {
    status: 'success',
    data,
  };
});

router.post(`${BASE_URL}/checkout`, async ctx => {
  const data = await queries.checkout(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  ctx.body = {
    status: 'success',
    data,
  };
});

router.post(`${BASE_URL}/sendReceiptEmail`, async ctx => {
  const data = await queries.sendReceiptEmail(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  ctx.body = {
    status: 'success',
    data,
  };
});

router.post(`${BASE_URL}/sendRegistrationEmail`, async ctx => {
  const data = await queries.sendRegistrationEmail(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  ctx.body = {
    status: 'success',
    data,
  };
});

router.post(`${BASE_URL}/createRefund`, async ctx => {
  const data = await queries.createRefund(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  ctx.body = {
    status: 'success',
    data,
  };
});

router.put(`${BASE_URL}/defaultCreditCard`, async ctx => {
  const card = await queries.updateDefaultCreditCard(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  if (card) {
    ctx.status = 201;
    ctx.body = {
      status: 'success',
      data: card,
    };
  } else {
    ctx.status = 404;
    ctx.body = {
      status: 'error',
      message: 'That entity does not exist.',
    };
  }
});

router.del(`${BASE_URL}/creditCard`, async ctx => {
  const data = await queries.deleteCreditCard(
    ctx.query,
    ctx.body.userInfo.id,
  );
  ctx.body = {
    status: 'success',
    data,
  };
});

module.exports = router;
