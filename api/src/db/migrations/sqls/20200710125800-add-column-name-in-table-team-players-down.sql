/* Replace with your SQL commands */
ALTER TABLE team_players
DROP CONSTRAINT team_players_pkey,
DROP COLUMN name,
DROP COLUMN id;

DELETE FROM team_players 
WHERE person_id IS NULL;

ALTER TABLE team_players
ALTER COLUMN person_id SET NOT NULL,
ADD PRIMARY KEY (roster_id,person_id);