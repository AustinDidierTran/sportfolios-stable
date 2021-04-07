/* Replace with your SQL commands */
ALTER TABLE stripe_price
  ADD COLUMN transaction_fees INTEGER;

UPDATE stripe_price 
SET transaction_fees = amount*0.05;

ALTER TABLE stripe_price
  ALTER COLUMN transaction_fees SET NOT NULL;

ALTER TABLE store_items_paid
  ADD COLUMN transaction_fees INTEGER;

UPDATE store_items_paid 
SET transaction_fees = amount*0.05;

ALTER TABLE store_items_paid
  ALTER COLUMN transaction_fees SET NOT NULL;