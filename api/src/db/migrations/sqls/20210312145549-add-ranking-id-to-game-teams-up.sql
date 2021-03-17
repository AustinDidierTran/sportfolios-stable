/* Replace with your SQL commands */
ALTER TABLE phase_rankings 
ADD UNIQUE (ranking_id);

ALTER TABLE game_teams 
ADD COLUMN ranking_id UUID REFERENCES phase_rankings(ranking_id);

UPDATE game_teams
    SET ranking_id=subquery.ranking_id
    FROM(
        SELECT phase_id, phase_rankings.ranking_id, phase_rankings.roster_id, current_phase,game_id, game_teams.id
        FROM phase_rankings
        INNER JOIN game_teams
        ON game_teams.roster_id=phase_rankings.roster_id 
		INNER JOIN games
		ON games.phase_id=phase_rankings.current_phase AND games.id=game_teams.game_id
    ) AS subquery
WHERE subquery.id=game_teams.id;

DELETE FROM entities
USING games, game_teams
WHERE game_teams.game_id=games.id AND games.entity_id=entities.id AND game_teams.ranking_id IS NULL;

DELETE FROM score_suggestion
USING games, game_teams
WHERE game_teams.game_id=games.id AND games.id=score_suggestion.game_id AND game_teams.ranking_id IS NULL;

DELETE FROM spirit_submission
USING games, game_teams
WHERE game_teams.game_id=games.id AND games.id=spirit_submission.game_id AND game_teams.ranking_id IS NULL;

/*No condition on the ranking id here because we want every team in the game to be deleted or there will be dead data*/
DELETE FROM game_teams
USING games
WHERE game_teams.game_id=games.id;

DELETE FROM games
WHERE NOT EXISTS(SELECT * FROM game_teams WHERE game_teams.game_id=games.id);

ALTER TABLE game_teams 
ALTER COLUMN ranking_id SET NOT NULL;

ALTER TABLE game_teams
ALTER COLUMN roster_id DROP NOT NULL; 