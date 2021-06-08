/* Replace with your SQL commands */
ALTER TABLE team_rosters
  ADD COLUMN name VARCHAR(255),
  ADD COLUMN active BOOLEAN DEFAULT TRUE NOT NULL;

UPDATE team_rosters SET name=t.name
  FROM( SELECT id, CONCAT('roster', row_number() over(partition by team_id ORDER BY created_at DESC)) AS name FROM team_rosters) t 
    WHERE t.id=team_rosters.id;
