/* Replace with your SQL commands */
ALTER TABLE user_app_role
  ALTER COLUMN user_id TYPE VARCHAR(255) USING user_id::VARCHAR(255);

ALTER TABLE recovery_email_token
  ALTER COLUMN user_id TYPE VARCHAR(320) USING user_id::VARCHAR(320);