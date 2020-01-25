/* Replace with your SQL commands */
CREATE TABLE user_info (
  user_id UUID REFERENCES users(id) PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL
);

INSERT INTO user_info(user_id, first_name, last_name) SELECT id, first_name, last_name FROM users;

ALTER TABLE users
  DROP COLUMN first_name,
  DROP COLUMN last_name;
