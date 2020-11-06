/* Replace with your SQL commands */
DROP TABLE entities_bank_accounts;

DROP TABLE bank_accounts;

DROP TABLE user_stripe_accounts;

CREATE TABLE stripe_accounts
(
  entity_id UUID REFERENCES entities(id),
  account_id VARCHAR(255) NOT NULL,
  created_at timestamp DEFAULT now(),
  bank_account_id VARCHAR(255),
  last4 VARCHAR(255),
  PRIMARY KEY(entity_id,account_id)
)
