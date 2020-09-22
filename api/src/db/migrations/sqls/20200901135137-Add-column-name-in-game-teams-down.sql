/* Replace with your SQL commands */
ALTER TABLE game_teams
  DROP COLUMN name;

DELETE FROM games WHERE phase_id IS NULL;
DELETE FROM games WHERE location_id IS NULL;
DELETE FROM games WHERE end_time IS NULL;

ALTER TABLE games
  ALTER COLUMN phase_id SET NOT NULL,
  ALTER COLUMN location_id SET NOT NULL,
  ALTER COLUMN end_time SET NOT NULL;