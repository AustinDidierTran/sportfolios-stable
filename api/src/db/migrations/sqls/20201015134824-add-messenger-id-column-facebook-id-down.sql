ALTER TABLE user_facebook_id RENAME COLUMN facebook_app_id TO facebook_id;
ALTER TABLE user_facebook_id DROP COLUMN facebook_messenger_id;
ALTER TABLE facebook_data RENAME COLUMN facebook_app_id TO facebook_id;
