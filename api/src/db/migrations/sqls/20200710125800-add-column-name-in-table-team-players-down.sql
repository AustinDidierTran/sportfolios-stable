/* Replace with your SQL commands */
ALTER TABLE team_players
DROP CONSTRAINT team_players_pkey,
DROP COLUMN name,
<<<<<<< HEAD
DROP COLUMN id;

DELETE FROM team_players 
WHERE person_id IS NULL;

ALTER TABLE team_players
ALTER COLUMN person_id SET NOT NULL,
=======
DROP COLUMN id,
ALTER COLUMN person_id SET NOT NULL;

DELETE FROM team_players 
WHERE (person_id IS NULL AND roster_id IS NULL);

ALTER TABLE team_players
>>>>>>> WIP roster can now be fully modified in event registration TODO: Add to db when finishing stepper
ADD PRIMARY KEY (roster_id,person_id);