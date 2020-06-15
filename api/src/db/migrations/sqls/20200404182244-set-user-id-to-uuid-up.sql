ALTER TABLE user_app_role
  ALTER COLUMN user_id TYPE uuid USING user_id::uuid;

ALTER TABLE recovery_email_token
  ALTER COLUMN user_id TYPE uuid USING user_id::uuid;