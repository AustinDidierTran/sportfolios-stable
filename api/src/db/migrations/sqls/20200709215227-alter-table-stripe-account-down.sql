ALTER TABLE stripe_accounts
  DROP COLUMN bank_account_id
,
DROP COLUMN last4;

ALTER TABLE stripe_customer
  DROP COLUMN informations;