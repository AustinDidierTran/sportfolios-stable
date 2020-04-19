/* Replace with your SQL commands */
CREATE TABLE relationship_requests (
  sender UUID REFERENCES users(id),
  target UUID REFERENCES users(id),
  created_at timestamp DEFAULT now()
);

CREATE TABLE relationships (
  users UUID[2],
  created_at timestamp DEFAULT now()
);