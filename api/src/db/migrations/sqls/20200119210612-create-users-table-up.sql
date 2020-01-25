/* Replace with your SQL commands */
CREATE TABLE users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(320) NOT NULL,
  password VARCHAR(64) NOT NULL,
  deleted_at TIMESTAMP
);
