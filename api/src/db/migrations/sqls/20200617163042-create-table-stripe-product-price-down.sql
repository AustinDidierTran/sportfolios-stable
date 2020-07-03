ALTER TABLE stripe_invoice_item
  DROP COLUMN stripe_price_id;

DROP TABLE stripe_price;
DROP TABLE stripe_product;