CREATE TABLE user_token (
  user_id UUID REFERENCES users(id) NOT NULL,
  token_id UUID NOT NULL PRIMARY KEY,
  expires_at timestamp
);
