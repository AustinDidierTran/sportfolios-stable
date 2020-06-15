ALTER TABLE user_email
    ADD COLUMN confirmation_email_token VARCHAR(255);

UPDATE user_email
    SET confirmation_email_token = confirmation_email_token
    FROM confirmation_email_token
    WHERE user_email.email = confirmation_email_token.email;

DROP TABLE confirmation_email_token;