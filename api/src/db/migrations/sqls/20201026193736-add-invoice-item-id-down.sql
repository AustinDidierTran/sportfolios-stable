/* Replace with your SQL commands */
ALTER TABLE memberships
  DROP COLUMN status,
  DROP COLUMN invoice_item_id;

ALTER TABLE store_items_paid
  DROP COLUMN receipt_id;

DROP TABLE receipts;