CREATE TABLE notification_follow (
  sender_id UUID REFERENCES entities(id),
  target_id UUID REFERENCES entities(id),
  created_at timestamp DEFAULT now(),
  seen_at timestamp,
  PRIMARY KEY(sender_id, target_id)
);
DROP VIEW notifications_view;
DROP TABLE notifications;
