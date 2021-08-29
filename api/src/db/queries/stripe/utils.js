const knex = require('../../connection');
const {
  INVOICE_STATUS_ENUM,
} = require('../../../../../common/enums');

async function getPaymentStatus(invoiceItemId) {
  const [refunded] = await knex('stripe_refund')
    .select('*')
    .where({ invoice_item_id: invoiceItemId });
  if (refunded) {
    return INVOICE_STATUS_ENUM.REFUNDED;
  }
  return INVOICE_STATUS_ENUM.PAID;
}

module.exports = {
  getPaymentStatus,
};
