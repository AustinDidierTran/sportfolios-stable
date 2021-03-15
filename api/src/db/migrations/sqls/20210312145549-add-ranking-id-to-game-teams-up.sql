/* Replace with your SQL commands */
ALTER TABLE phase_rankings 
ADD UNIQUE (ranking_id);

ALTER TABLE game_teams 
ADD COLUMN ranking_id UUID NOT NULL REFERENCES phase_rankings(ranking_id);

ALTER TABLE game_teams
ALTER COLUMN roster_id DROP NOT NULL; 