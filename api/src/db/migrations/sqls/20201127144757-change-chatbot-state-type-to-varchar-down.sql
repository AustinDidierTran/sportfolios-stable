UPDATE messenger_user_chatbot_state
set state = '1';


ALTER TABLE messenger_user_chatbot_state
ALTER COLUMN STATE TYPE int USING CAST(state AS integer);

