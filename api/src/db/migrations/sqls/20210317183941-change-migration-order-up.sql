/* Replace with your SQL commands */
ALTER TABLE phase_rankings 
ADD UNIQUE (ranking_id);

ALTER TABLE game_teams 
ADD COLUMN ranking_id UUID REFERENCES phase_rankings(ranking_id);

DELETE FROM score_suggestion;

DELETE FROM spirit_submission;

DELETE FROM game_teams;

DELETE FROM games;

ALTER TABLE game_teams 
ALTER COLUMN ranking_id SET NOT NULL;

ALTER TABLE game_teams
ALTER COLUMN roster_id DROP NOT NULL; 