const Router = require('koa-router');
const { STATUS_ENUM } = require('../../../../../common/enums');
const { ERROR_ENUM } = require('../../../../../common/errors');
const queries = require('../../../db/queries/stripe');

const router = new Router();
const BASE_URL = '/api/stripe';

router.get(`${BASE_URL}/accountLink`, async ctx => {
  const data = await queries.getAccountLink(
    ctx.request.ip,
    ctx.query.entityId,
  );
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.get(`${BASE_URL}/bankAccounts`, async ctx => {
  const data = await queries.getBankAccounts(ctx.query.entityId);
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.get(`${BASE_URL}/hasStripeAccount`, async ctx => {
  const data = await queries.hasStripeAccount(ctx.query.entityId);
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.get(`${BASE_URL}/hasStripeBankAccount`, async ctx => {
  const data = await queries.hasStripeBankAccount(ctx.query.entityId);
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.get(`${BASE_URL}/eventHasBankAccount`, async ctx => {
  const data = await queries.eventHasBankAccount(ctx.query.id);
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});
router.get(`${BASE_URL}/eventAccounts`, async ctx => {
  const data = await queries.getEventAccounts(ctx.query.eventId);
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.post(`${BASE_URL}/externalAccount`, async ctx => {
  const { data, status, error } = await queries.addExternalAccount(
    ctx.request.body,
    ctx.request.ip,
  );

  if (error) {
    ctx.status = status;
    ctx.body = { error: error.message };
  } else {
    ctx.body = { status, data };
  }
});

router.get(`${BASE_URL}/getCustomer`, async ctx => {
  const data = await queries.getCustomer(ctx.body.userInfo.id);
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.post(`${BASE_URL}/createCustomer`, async ctx => {
  const data = await queries.addCustomer(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.post(`${BASE_URL}/createInvoiceItem`, async ctx => {
  const data = await queries.addInvoiceItem(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.post(`${BASE_URL}/createInvoice`, async ctx => {
  const data = await queries.addInvoice(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.post(`${BASE_URL}/finalizeInvoice`, async ctx => {
  const data = await queries.finalizeInvoice(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.post(`${BASE_URL}/payInvoice`, async ctx => {
  const data = await queries.payInvoice(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.get(`${BASE_URL}/paymentMethods`, async ctx => {
  const data = await queries.getPaymentMethods(ctx.body.userInfo.id);

  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.post(`${BASE_URL}/paymentMethod`, async ctx => {
  const data = await queries.createPaymentMethod(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.post(`${BASE_URL}/attachPaymentMethod`, async ctx => {
  const data = await queries.attachPaymentMethod(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.post(`${BASE_URL}/detachPaymentMethod`, async ctx => {
  const data = await queries.detachPaymentMethod(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.post(`${BASE_URL}/createProduct`, async ctx => {
  const data = await queries.createProduct(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.post(`${BASE_URL}/createPrice`, async ctx => {
  const data = await queries.createPrice(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.post(`${BASE_URL}/createItem`, async ctx => {
  const data = await queries.createItem(
    ctx.request.body.itemParams,
    ctx.body.userInfo.id,
  );
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.put(`${BASE_URL}/editItem`, async ctx => {
  const data = await queries.editItem(
    ctx.request.body.itemParams,
    ctx.body.userInfo.id,
  );
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: data };
});

router.del(`${BASE_URL}/deleteItem`, async ctx => {
  const data = await queries.deleteItem(ctx.query);
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

//TODO: Link this to a fct (getProduct doesnt exist)
router.get(`${BASE_URL}/getProductFromPriceId`, async ctx => {
  const data = await queries.getProduct(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.get(`${BASE_URL}/getReceipt`, async ctx => {
  const data = await queries.getReceipt(
    ctx.query,
    ctx.body.userInfo.id,
  );
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});
router.get(`${BASE_URL}/getTaxes`, async ctx => {
  const data = await queries.getTaxes();
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.post(`${BASE_URL}/checkout`, async ctx => {
  const data = await queries.checkout(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  if (data.reason) {
    ctx.status = STATUS_ENUM.ERROR;
    ctx.body = {
      message: data.reason,
      data,
    };
  } else if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.post(`${BASE_URL}/sendReceiptEmail`, async ctx => {
  const data = await queries.sendReceiptEmail(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.post(`${BASE_URL}/sendRegistrationEmail`, async ctx => {
  const data = await queries.sendRegistrationEmail(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.post(`${BASE_URL}/createRefund`, async ctx => {
  const data = await queries.createRefund(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.put(`${BASE_URL}/defaultCreditCard`, async ctx => {
  const card = await queries.updateDefaultCreditCard(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  if (!card) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: card };
});

router.put(`${BASE_URL}/defaultBankAccount`, async ctx => {
  const bankAccount = await queries.updateDefaultBankAccount(
    ctx.request.body,
  );
  if (!bankAccount) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: bankAccount };
});

router.del(`${BASE_URL}/creditCard`, async ctx => {
  const data = await queries.deleteCreditCard(
    ctx.query,
    ctx.body.userInfo.id,
  );
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.del(`${BASE_URL}/bankAccount`, async ctx => {
  const data = await queries.deleteBankAccount(ctx.query);
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

module.exports = router;
