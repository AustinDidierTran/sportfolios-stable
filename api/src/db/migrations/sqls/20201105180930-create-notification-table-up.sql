DROP TABLE notification_follow;
CREATE TABLE notifications(
id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
type int,
seen_at timestamp,
clicked_at timestamp,
title varchar(255),
description varchar(500),
entity_photo UUID REFERENCES entities(id) ON DELETE SET NULL,
metadata json);

CREATE VIEW notifications_view AS SELECT * FROM (notifications as n LEFT JOIN (SELECT photo_url, entity_id FROM entities_photo) as e ON n.entity_photo = e.entity_id);




