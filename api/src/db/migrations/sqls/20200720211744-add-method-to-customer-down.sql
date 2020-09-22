CREATE TABLE stripe_payment_method
(
    user_id UUID REFERENCES users(id) NOT NULL,
    payment_method_id VARCHAR(255) NOT NULL PRIMARY KEY
);

ALTER TABLE stripe_customer
  DROP COLUMN payment_method_id,
  DROP COLUMN last4;
