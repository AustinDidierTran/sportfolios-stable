/* Replace with your SQL commands */
ALTER TABLE user_notification_setting
  ADD COLUMN in_app BOOLEAN NOT NULL DEFAULT TRUE;

INSERT INTO user_notification_setting (user_id, type)
(SELECT id,'added to team' FROM users);

INSERT INTO user_notification_setting (user_id, type)
(SELECT id,'person registration' FROM users);

INSERT INTO user_notification_setting (user_id, type)
(SELECT id,'team registration' FROM users);
