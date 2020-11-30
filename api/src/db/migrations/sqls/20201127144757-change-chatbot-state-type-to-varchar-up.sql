ALTER TABLE messenger_user_chatbot_state
ALTER COLUMN STATE TYPE VARCHAR(255);


UPDATE messenger_user_chatbot_state
set state = 'home';