
ALTER TABLE facebook_data RENAME facebook_app_id TO facebook_id;
CREATE TABLE user_apps_id (
user_id UUID PRIMARY KEY REFERENCES users(id) NOT NULL,
facebook_id BIGINT REFERENCES facebook_data(facebook_id) ON DELETE SET NULL,
messenger_id BIGINT default NULL
);

INSERT INTO user_apps_id (user_id) 
SELECT id FROM users;

UPDATE user_apps_id 
set facebook_id=a.facebook_app_id ,
messenger_id = a.facebook_messenger_id
FROM user_facebook_id as a
WHERE user_apps_id.user_id=a.user_id;

DROP TABLE user_facebook_id;
