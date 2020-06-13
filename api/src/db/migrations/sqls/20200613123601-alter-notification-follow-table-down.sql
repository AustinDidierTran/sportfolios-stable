/* Replace with your SQL commands */
ALTER TABLE persons
  ADD COLUMN user_id UUID REFERENCES users(id);

UPDATE persons
  SET user_id = subquery.user_id
  FROM (SELECT * 
  FROM user_entity_role) AS subquery
  where persons.id = subquery.entity_id;

ALTER TABLE persons
  ALTER COLUMN user_id SET NOT NULL;

DROP TABLE user_entity_role;

DROP TABLE notification_follow;

CREATE TABLE notification_follow (
  user_id UUID REFERENCES users(id),
  follower UUID REFERENCES users(id),
  created_at timestamp DEFAULT now(),
  seen_at timestamp,
  PRIMARY KEY(user_id, follower)
)

