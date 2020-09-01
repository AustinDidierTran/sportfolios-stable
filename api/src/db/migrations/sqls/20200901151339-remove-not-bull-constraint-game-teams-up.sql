/* Replace with your SQL commands */
ALTER TABLE game_teams
  ALTER COLUMN roster_id DROP NOT NULL,
  ALTER COLUMN position DROP NOT NULL,
  ALTER COLUMN score SET DEFAULT 0,
  ADD COLUMN id UUID DEFAULT uuid_generate_v4();

ALTER TABLE game_teams
  DROP CONSTRAINT game_teams_pkey;

ALTER TABLE game_teams
  ADD CONSTRAINT game_teams_pkey PRIMARY KEY (id);