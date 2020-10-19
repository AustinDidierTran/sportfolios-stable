ALTER TABLE user_facebook_id RENAME COLUMN facebook_id to facebook_app_id;
ALTER TABLE user_facebook_id ADD COLUMN facebook_messenger_id BIGINT;
ALTER TABLE facebook_data RENAME COLUMN facebook_id to facebook_app_id;
