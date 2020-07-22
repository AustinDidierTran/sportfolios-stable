ALTER TABLE stripe_refund
  DROP COLUMN invoice_id,
  ADD COLUMN invoice_item_id VARCHAR(255);