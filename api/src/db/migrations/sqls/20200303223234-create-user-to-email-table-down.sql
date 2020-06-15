ALTER TABLE users
    ADD COLUMN email VARCHAR(320),
    ADD COLUMN confirmation_email_token VARCHAR(255),
    ADD COLUMN confirmed_email_at TIMESTAMP;

UPDATE users
    SET confirmation_email_token = user_email.confirmation_email_token,
    confirmed_email_at = user_email.confirmed_email_at,
    email = user_email.email
    FROM user_email
    WHERE users.id = user_email.user_id;

ALTER TABLE users
    ALTER COLUMN email SET NOT NULL;

DROP TABLE user_email;
