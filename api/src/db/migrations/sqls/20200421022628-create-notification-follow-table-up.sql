/* Replace with your SQL commands */
CREATE TABLE notification_follow (
  user_id UUID REFERENCES users(id),
  follower UUID REFERENCES users(id),
  created_at timestamp DEFAULT now(),
  seen_at timestamp,
  PRIMARY KEY(user_id, follower)
)