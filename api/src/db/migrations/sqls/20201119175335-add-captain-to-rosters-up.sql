ALTER TABLE team_players
  ADD COLUMN role VARCHAR(255);

UPDATE team_players 
  SET role = 'captain'
  FROM 
    (SELECT (array_agg(id))[1] as id 
      FROM (SELECT * FROM team_players ORDER BY created_at ASC) as playersOrdered 
    GROUP BY roster_id) AS captainsIds
  WHERE team_players.id = captainsIds.id;