/* Replace with your SQL commands */
ALTER TABLE users
  ADD COLUMN confirmation_email_token VARCHAR(255),
  ADD COLUMN confirmed_email_at TIMESTAMP;
