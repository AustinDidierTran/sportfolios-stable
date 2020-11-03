create table logs_chatbot
  (id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY, messenger_id bigint REFERENCES messenger_user_chatbot_state(messenger_id) ON DELETE
   SET NULL, state int, message varchar(255))