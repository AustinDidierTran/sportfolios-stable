/* Replace with your SQL commands */
CREATE TABLE users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(320) NOT NULL,
  password VARCHAR(64) NOT NULL,
  deleted_at TIMESTAMP
);

INSERT INTO users (id, first_name, last_name, email, password)
  VALUES (
  '318644a8-b90f-42dc-bb02-9f92b0fc1c1c',
  'Austin-Didier',
  'Tran',
  'tran.austin.didier@gmail.com',
  'password123'
  );
