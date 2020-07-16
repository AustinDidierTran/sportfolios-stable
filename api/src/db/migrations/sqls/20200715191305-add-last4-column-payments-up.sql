DELETE FROM stripe_payment_method;

ALTER TABLE stripe_payment_method
  ADD COLUMN last4 VARCHAR(255);