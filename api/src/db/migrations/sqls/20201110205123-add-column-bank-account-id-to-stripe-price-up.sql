/* Replace with your SQL commands */
DROP TABLE entities_bank_accounts;
DROP TABLE bank_accounts;
DROP TABLE user_stripe_accounts;

CREATE TABLE stripe_accounts
(
  entity_id UUID REFERENCES entities(id),
  account_id VARCHAR(255) UNIQUE,
  PRIMARY KEY(entity_id,account_id)
);

CREATE TABLE bank_accounts
(
  account_id VARCHAR(255) REFERENCES stripe_accounts(account_id),
  bank_account_id VARCHAR(255) PRIMARY KEY,
  last4 VARCHAR(255),
  is_default BOOLEAN DEFAULT FALSE,
  deleted_at TIMESTAMP
);

CREATE RULE delete_bank_account AS ON DELETE TO bank_accounts
DO INSTEAD
(UPDATE bank_accounts SET deleted_at = now() WHERE bank_accounts.bank_account_id = old.bank_account_id;
)