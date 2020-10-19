/* Replace with your SQL commands */
DELETE FROM event_rosters
  WHERE payment_option_id IS NULL;

ALTER TABLE event_rosters
ALTER COLUMN payment_option_id SET NOT NULL;