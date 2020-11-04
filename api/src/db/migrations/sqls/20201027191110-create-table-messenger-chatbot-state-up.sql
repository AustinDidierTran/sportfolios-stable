CREATE TABLE messenger_user_chatbot_state (
  messenger_id BIGINT PRIMARY KEY,
  state INT NOT NULL DEFAULT 0,
  game_in_submission UUID REFERENCES games(id)
);

INSERT INTO messenger_user_chatbot_state (messenger_id) SELECT DISTINCT messenger_id FROM user_apps_id WHERE messenger_id IS NOT NULL;

ALTER TABLE user_apps_id ADD FOREIGN KEY (messenger_id) references messenger_user_chatbot_state(messenger_id);
