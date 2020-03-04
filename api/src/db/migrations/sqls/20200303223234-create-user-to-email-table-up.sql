/* Replace with your SQL commands */
CREATE TABLE user_email (
    user_id UUID REFERENCES users(id) NOT NULL,
    email VARCHAR(320) NOT NULL PRIMARY KEY,
    confirmation_email_token VARCHAR(255),
    confirmed_email_at TIMESTAMP
);

INSERT INTO user_email (user_id, email, confirmation_email_token, confirmed_email_at) 
    SELECT id, email, confirmation_email_token, confirmed_email_at FROM users;

ALTER TABLE users
    DROP COLUMN email,
    DROP COLUMN confirmation_email_token,
    DROP COLUMN confirmed_email_at;
    