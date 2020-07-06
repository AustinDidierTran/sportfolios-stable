ALTER TABLE stripe_invoice_item
DROP COLUMN metadata;

DROP TABLE stripe_transfer
DROP COLUMN user_id,
DROP COLUMN transfer_id,
DROP COLUMN status;