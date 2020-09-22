ALTER TABLE stripe_refund
  DROP COLUMN invoice_item_id,
  ADD COLUMN invoice_id VARCHAR(255);