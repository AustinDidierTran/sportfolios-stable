--This trigger is adding a new row in user_notification_setting for every user when a new type is added in notifications

CREATE OR REPLACE FUNCTION check_for_new_notification_type() RETURNS trigger LANGUAGE PLPGSQL as $$
BEGIN
	IF NEW.type NOT IN (SELECT type FROM user_notification_setting) THEN
		INSERT INTO user_notification_setting(user_id, type) SELECT id, type from (users CROSS JOIN (SELECT Distinct type from notifications where type =NEW.type)as t2);
		END IF;
		return NEW;
END;
$$;


CREATE TRIGGER check_notification_insert AFTER
INSERT ON notifications
FOR EACH ROW EXECUTE procedure check_for_new_notification_type();