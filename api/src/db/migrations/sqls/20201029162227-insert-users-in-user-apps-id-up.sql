INSERT into user_apps_id(user_id) select id from users ON CONFLICT DO nothing
