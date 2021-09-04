import knex from '../../connection.js';
import {
  INVOICE_STATUS_ENUM,
} from '../../../../../common/enums';

async function getPaymentStatus(invoiceItemId) {
  const [refunded] = await knex('stripe_refund')
    .select('*')
    .where({ invoice_item_id: invoiceItemId });
  if (refunded) {
    return INVOICE_STATUS_ENUM.REFUNDED;
  }
  return INVOICE_STATUS_ENUM.PAID;
}

export {
  getPaymentStatus,
};
