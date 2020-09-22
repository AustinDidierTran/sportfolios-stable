DELETE FROM stripe_customer;

ALTER TABLE stripe_customer
  ADD COLUMN payment_method_id VARCHAR(255) NOT NULL,
  ADD COLUMN last4 VARCHAR(255),
  DROP COLUMN user_id,
  ADD COLUMN user_id UUID REFERENCES users(id) NOT NULL;

DROP TABLE stripe_payment_method;