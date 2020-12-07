/* Replace with your SQL commands */
CREATE TABLE token_promo_code(
  token_id VARCHAR(255) NOT NULL PRIMARY KEY,
  expires_at TIMESTAMP,
  metadata JSON,
  used BOOLEAN NOT NULL DEFAULT FALSE
);