const Router = require('koa-router');
const { STATUS_ENUM } = require('../../../../../common/enums');
const { ERROR_ENUM } = require('../../../../../common/errors');
const service = require('../../service/stripe');

const router = new Router();
const BASE_URL = '/api/stripe';

router.get(`${BASE_URL}/accountLink`, async ctx => {
  const data = await service.getAccountLink(
    ctx.request.ip,
    ctx.query.entityId,
  );
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.get(`${BASE_URL}/bankAccounts`, async ctx => {
  const data = await service.getBankAccounts(ctx.query.entityId);
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.get(`${BASE_URL}/hasStripeAccount`, async ctx => {
  const res = await service.hasStripeAccount(ctx.query.entityId);
  if (!res && res != false) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: res };
});

router.get(`${BASE_URL}/hasStripeBankAccount`, async ctx => {
  const data = await service.hasStripeBankAccount(ctx.query.entityId);
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.get(`${BASE_URL}/eventHasBankAccount`, async ctx => {
  const data = await service.eventHasBankAccount(ctx.query.id);
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});
router.get(`${BASE_URL}/eventAccounts`, async ctx => {
  const data = await service.getEventAccounts(ctx.query.eventId);
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.post(`${BASE_URL}/externalAccount`, async ctx => {
  const bankAccount = await service.addExternalAccount(
    ctx.request.body,
    ctx.request.ip,
  );

  if (!bankAccount) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: bankAccount };
});

router.get(`${BASE_URL}/getCustomer`, async ctx => {
  const data = await service.getCustomer(ctx.body.userInfo.id);
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.post(`${BASE_URL}/createCustomer`, async ctx => {
  const data = await service.addCustomer(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.post(`${BASE_URL}/createInvoiceItem`, async ctx => {
  const data = await service.addInvoiceItem(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.post(`${BASE_URL}/createInvoice`, async ctx => {
  const data = await service.addInvoice(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.post(`${BASE_URL}/finalizeInvoice`, async ctx => {
  const data = await service.finalizeInvoice(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.post(`${BASE_URL}/payInvoice`, async ctx => {
  const data = await service.payInvoice(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.get(`${BASE_URL}/paymentMethods`, async ctx => {
  const data = await service.getPaymentMethods(ctx.body.userInfo.id);

  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.post(`${BASE_URL}/paymentMethod`, async ctx => {
  const data = await service.createPaymentMethod(
    ctx.request.body,
    ctx.body.userInfo.id,
  );

  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.post(`${BASE_URL}/attachPaymentMethod`, async ctx => {
  const data = await service.attachPaymentMethod(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.post(`${BASE_URL}/detachPaymentMethod`, async ctx => {
  const data = await service.detachPaymentMethod(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.post(`${BASE_URL}/createProduct`, async ctx => {
  const data = await service.createProduct(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.post(`${BASE_URL}/createPrice`, async ctx => {
  const data = await service.createPrice(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.post(`${BASE_URL}/createItem`, async ctx => {
  const data = await service.createItem(
    ctx.request.body.itemParams,
    ctx.body.userInfo.id,
  );
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.put(`${BASE_URL}/editItem`, async ctx => {
  const data = await service.editItem(
    ctx.request.body.itemParams,
    ctx.body.userInfo.id,
  );
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: data };
});

router.del(`${BASE_URL}/deleteItem`, async ctx => {
  const data = await service.deleteItem(ctx.query);
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

//TODO: Link this to a fct (getProduct doesnt exist)
router.get(`${BASE_URL}/getProductFromPriceId`, async ctx => {
  const data = await service.getProduct(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.get(`${BASE_URL}/getReceipt`, async ctx => {
  const data = await service.getReceipt(
    ctx.query,
    ctx.body.userInfo.id,
  );
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});
router.get(`${BASE_URL}/getTaxes`, async ctx => {
  const data = await service.getTaxes();
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.post(`${BASE_URL}/checkout`, async ctx => {
  const data = await service.checkout(
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
  const data = await service.sendReceiptEmail(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.post(`${BASE_URL}/sendRegistrationEmail`, async ctx => {
  const data = await service.sendRegistrationEmail(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.post(`${BASE_URL}/createRefund`, async ctx => {
  const data = await service.createRefund(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.put(`${BASE_URL}/defaultCreditCard`, async ctx => {
  const card = await service.updateDefaultCreditCard(
    ctx.request.body,
    ctx.body.userInfo.id,
  );
  if (!card) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: card };
});

router.put(`${BASE_URL}/defaultBankAccount`, async ctx => {
  const bankAccount = await service.updateDefaultBankAccount(
    ctx.request.body,
  );
  if (!bankAccount) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data: bankAccount };
});

router.del(`${BASE_URL}/creditCard`, async ctx => {
  const data = await service.deleteCreditCard(
    ctx.query,
    ctx.body.userInfo.id,
  );
  if (!data) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

router.del(`${BASE_URL}/bankAccount`, async ctx => {
  const data = await service.deleteBankAccount(ctx.query);
  if (!data && data !== 0) {
    throw new Error(ERROR_ENUM.ERROR_OCCURED);
  }
  ctx.body = { data };
});

module.exports = router;
