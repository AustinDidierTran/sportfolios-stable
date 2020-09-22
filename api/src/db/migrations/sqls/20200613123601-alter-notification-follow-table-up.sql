DROP TABLE notification_follow;

CREATE TABLE notification_follow (
  sender_id UUID REFERENCES entities(id),
  target_id UUID REFERENCES entities(id),
  created_at timestamp DEFAULT now(),
  seen_at timestamp,
  PRIMARY KEY(sender_id, target_id)
);

CREATE TABLE user_entity_role(
  user_id UUID REFERENCES users(id),
  entity_id UUID REFERENCES entities(id),
  role INTEGER NOT NULL,
  created_at timestamp DEFAULT now(),
  PRIMARY KEY(user_id, entity_id)
);

INSERT INTO user_entity_role(user_id, entity_id, role) SELECT user_id, id, 1 FROM persons;

ALTER TABLE persons
  DROP COLUMN user_id;