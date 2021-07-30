const knex = require('../connection');

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
