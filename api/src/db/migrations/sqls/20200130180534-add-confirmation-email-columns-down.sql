/* Replace with your SQL commands */
ALTER TABLE users
  DROP COLUMN confirmation_email_token,
  DROP COLUMN confirmed_email_at;
