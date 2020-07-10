ALTER TABLE stripe_accounts
  ADD COLUMN bank_account_id VARCHAR
(255),
ADD COLUMN last4 VARCHAR
(255);

ALTER TABLE stripe_customer
  ADD COLUMN informations JSON NOT NULL;
