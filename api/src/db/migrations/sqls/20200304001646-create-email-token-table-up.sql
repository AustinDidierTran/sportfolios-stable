CREATE TABLE confirmation_email_token (
    email VARCHAR(320) NOT NULL,
    token VARCHAR(255) NOT NULL PRIMARY KEY,
    expires_at TIMESTAMP
);

ALTER TABLE user_email
    DROP COLUMN confirmation_email_token;