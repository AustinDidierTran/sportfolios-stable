/* Replace with your SQL commands */
UPDATE notifications SET type='added to roster' 
WHERE type = 'added to event';

ALTER TABLE user_notification_setting
  DROP COLUMN in_app;

DELETE FROM user_notification_setting WHERE type='added to team';
DELETE FROM user_notification_setting WHERE type='person registration';
DELETE FROM user_notification_setting WHERE type='team registration';

UPDATE user_notification_setting SET chatbot=true, email= true;