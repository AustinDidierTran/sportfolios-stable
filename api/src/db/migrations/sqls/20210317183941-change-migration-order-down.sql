/* Replace with your SQL commands */
ALTER TABLE game_teams
DROP COLUMN ranking_id;

ALTER TABLE phase_rankings
DROP CONSTRAINT phase_rankings_ranking_id_key;