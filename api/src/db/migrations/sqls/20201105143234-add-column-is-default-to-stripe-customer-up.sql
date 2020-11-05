/* Replace with your SQL commands */
ALTER TABLE stripe_customer
  ADD COLUMN is_default BOOLEAN DEFAULT FALSE;