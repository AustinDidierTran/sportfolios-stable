/* Replace with your SQL commands */
UPDATE user_notification_setting 
  SET email = true,
    chatbot = false,
    in_app = true
      WHERE type = 'added to event';

UPDATE user_notification_setting 
  SET email = true,
    chatbot = false,
    in_app = true
      WHERE type = 'added to team';

UPDATE user_notification_setting 
  SET email = false,
    chatbot = false,
    in_app = true
      WHERE type = 'request to join team';

UPDATE user_notification_setting 
  SET email = false,
    chatbot = false,
    in_app = true
      WHERE type = 'other team submitted a score';

UPDATE user_notification_setting 
  SET email = false,
    chatbot = false,
    in_app = true
      WHERE type = 'score submission conflict';

UPDATE user_notification_setting 
  SET email = false,
    chatbot = false,
    in_app = true
      WHERE type = 'score submission request';

UPDATE user_notification_setting 
  SET email = true,
    chatbot = false,
    in_app = false
      WHERE type = 'person registration';

UPDATE user_notification_setting 
  SET email = true,
    chatbot = false,
    in_app = false
      WHERE type = 'team registration';
