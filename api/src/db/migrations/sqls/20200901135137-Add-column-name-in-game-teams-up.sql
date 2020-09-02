/* Replace with your SQL commands */
ALTER TABLE game_teams
  ADD COLUMN name VARCHAR (255);

ALTER TABLE games
  ALTER COLUMN phase_id DROP NOT NULL,
  ALTER COLUMN location_id DROP NOT NULL,
  ALTER COLUMN end_time DROP NOT NULL;
