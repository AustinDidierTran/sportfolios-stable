CREATE TABLE recovery_email_token (
  user_id VARCHAR(320) NOT NULL,
  token VARCHAR(255) NOT NULL PRIMARY KEY,
  expires_at TIMESTAMP,
  used_at TIMESTAMP
);