/* Replace with your SQL commands */
CREATE TABLE donation (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  amount INTEGER NOT NULL,
  anonyme BOOLEAN NOT NULL DEFAULT FALSE,
  note VARCHAR(255),
  organization_id VARCHAR(255) NOT NULL,
  user_id VARCHAR(255) NOT NULL
);
