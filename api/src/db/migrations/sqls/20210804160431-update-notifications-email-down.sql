/* Replace with your SQL commands */
UPDATE user_notification_setting 
  SET email = false,
    chatbot = false,
    in_app = true
      WHERE type = 'other team submitted a score';