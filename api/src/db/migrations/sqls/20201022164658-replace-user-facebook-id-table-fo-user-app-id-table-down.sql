CREATE TABLE user_facebook_id as (SELECT user_id, facebook_id as facebook_app_id, messenger_id as facebook_messenger_id from user_apps_id);
DROP TABLE user_apps_id;

ALTER TABLE facebook_data RENAME facebook_id TO facebook_app_id;


