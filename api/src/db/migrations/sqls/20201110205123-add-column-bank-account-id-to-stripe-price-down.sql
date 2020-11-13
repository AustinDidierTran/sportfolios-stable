/* Replace with your SQL commands */
DROP RULE IF EXISTS delete_bank_account ON bank_accounts;

DROP TABLE bank_accounts;
DROP TABLE stripe_accounts;

CREATE TABLE user_stripe_accounts
(
  user_id UUID REFERENCES users(id) NOT NULL,
  account_id VARCHAR(255) NOT NULL UNIQUE,
  PRIMARY KEY(user_id,account_id)
);

CREATE TABLE bank_accounts
(
  bank_account_id VARCHAR(255) PRIMARY KEY,
  account_id VARCHAR(255) REFERENCES user_stripe_accounts(account_id),
  last4 VARCHAR(255),
  is_default BOOLEAN DEFAULT FALSE
);

CREATE TABLE entities_bank_accounts
(
  bank_account_id VARCHAR(255) REFERENCES bank_accounts(bank_account_id),
  entity_id UUID REFERENCES entities(id),
  is_default BOOLEAN DEFAULT FALSE,
  PRIMARY KEY(bank_account_id,entity_id)
);