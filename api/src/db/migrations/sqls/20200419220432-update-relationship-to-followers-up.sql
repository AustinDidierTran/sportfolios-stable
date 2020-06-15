DROP TABLE relationships;
DROP TABLE relationship_requests;

CREATE TABLE followers (
  sender UUID REFERENCES users(id),
  target UUID REFERENCES users(id),
  created_at timestamp DEFAULT now(),
  PRIMARY KEY(sender, target)
)