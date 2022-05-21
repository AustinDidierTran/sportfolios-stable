import { reports } from '../models/report.js';
import { storeItemsPaid } from '../models/storeItemsPaid.js';
import { INVOICE_STATUS_ENUM } from './stripe/enums.js';

export const createReport = async reportData => {
  return reports.query().insertGraph(reportData);
};

export const getReport = async reportId => {
  const [report] = await reports.query().where({ report_id: reportId });

  return report;
};

export const getActiveSales = async (sellerEntityId /* date */) => {
  const sales = await storeItemsPaid
    .query()
    .where({ seller_entity_id: sellerEntityId });

  return sales.map(sale => ({
    amount: sale.amount,
    id: sale.id,
    buyerUserId: sale.buyer_user_id,
    createdAt: sale.created_at,
    invoiceItemId: sale.invoice_item_id,
    metadata: sale.metadata,
    quantity: sale.quantity,
    receiptId: sale.receipt_id,
    sellerEntityId: sale.seller_entity_id,
    status: INVOICE_STATUS_ENUM.PAID,
    stripePriceId: sale.stripe_price_id,
    transactionFees: sale.transaction_fees,
    unitAmount: sale.unit_amount,
  }));
};
