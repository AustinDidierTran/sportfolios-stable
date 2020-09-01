/* Replace with your SQL commands */
DELETE FROM game_teams WHERE roster_id IS NULL;
DELETE FROM game_teams WHERE position IS NULL;

ALTER TABLE game_teams
  ALTER COLUMN roster_id SET NOT NULL,
  ALTER COLUMN position SET NOT NULL,
  ALTER COLUMN score DROP DEFAULT,
  DROP COLUMN id;

ALTER TABLE game_teams
  ADD CONSTRAINT game_teams_pkey PRIMARY KEY (game_id); 