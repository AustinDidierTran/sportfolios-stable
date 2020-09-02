/* Replace with your SQL commands */
DELETE FROM games WHERE start_time IS NULL;

ALTER TABLE games
  ALTER COLUMN start_time SET NOT NULL;