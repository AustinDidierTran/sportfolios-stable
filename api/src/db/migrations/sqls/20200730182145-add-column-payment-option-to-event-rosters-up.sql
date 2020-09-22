/* Replace with your SQL commands */
ALTER TABLE event_rosters
  ADD COLUMN payment_option_id VARCHAR(255) REFERENCES event_payment_options(id);

UPDATE event_rosters
  SET payment_option_id=subquery.id
  FROM (SELECT id, event_payment_options.event_id FROM event_payment_options
    LEFT JOIN event_rosters on event_payment_options.event_id = event_rosters.event_id) AS subquery
  WHERE subquery.event_id=event_rosters.event_id;

ALTER TABLE event_rosters
  ALTER COLUMN payment_option_id SET NOT NULL;
