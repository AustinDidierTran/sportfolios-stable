ALTER TABLE messenger_user_chatbot_state ADD column game_in_submission uuid references games(id), DROP column chatbot_infos 
