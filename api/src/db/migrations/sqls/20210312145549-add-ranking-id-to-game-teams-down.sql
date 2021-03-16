/* Replace with your SQL commands */
DELETE FROM entities
USING games, game_teams
WHERE game_teams.game_id=games.id AND games.entity_id=entities.id AND game_teams.roster_id IS NULL;

DELETE FROM score_suggestion
USING games, game_teams
WHERE game_teams.game_id=games.id AND games.id=score_suggestion.game_id AND game_teams.roster_id IS NULL;

DELETE FROM spirit_submission
USING games, game_teams
WHERE game_teams.game_id=games.id AND games.id=spirit_submission.game_id AND game_teams.roster_id IS NULL;

DELETE FROM game_teams
USING games
WHERE game_teams.game_id=games.id AND game_teams.roster_id IS NULL;

DELETE FROM games
WHERE NOT EXISTS(SELECT * FROM game_teams WHERE game_teams.game_id=games.id);

ALTER TABLE game_teams 
ALTER COLUMN roster_id SET NOT NULL;

ALTER TABLE game_teams
DROP COLUMN ranking_id;

ALTER TABLE phase_rankings
DROP CONSTRAINT phase_rankings_ranking_id_key;