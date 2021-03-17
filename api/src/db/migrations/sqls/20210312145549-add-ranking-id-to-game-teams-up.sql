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

ALTER TABLE game_teams 
ALTER COLUMN ranking_id SET NOT NULL;

ALTER TABLE game_teams
ALTER COLUMN roster_id DROP NOT NULL; 