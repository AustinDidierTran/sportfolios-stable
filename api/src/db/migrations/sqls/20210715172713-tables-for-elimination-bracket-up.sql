/* Replace with your SQL commands */
CREATE TABLE elimination_bracket(
  ranking_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY, 
  origin_step INTEGER,
  current_step INTEGER NOT NULL,
  origin_position INTEGER,
  initial_position INTEGER NOT NULL,
  final_position INTEGER,
  phase_id UUID NOT NULL,
  roster_id UUID
);

ALTER TABLE game_teams
  DROP CONSTRAINT game_teams_ranking_id_fkey;

DROP TABLE IF EXISTS phase_link;
