ALTER TABLE IF EXISTS user_facebook_id RENAME COLUMN facebook_app_id TO facebook_id;
ALTER TABLE IF EXISTS user_facebook_id DROP COLUMN facebook_messenger_id;
DO $$
BEGIN
  IF EXISTS(SELECT *
    FROM information_schema.columns
    WHERE table_name='facebook_data' and column_name='facebook_app_id')
  THEN
      ALTER TABLE facebook_data RENAME COLUMN facebook_app_id TO facebook_id;
  END IF;
END $$;

