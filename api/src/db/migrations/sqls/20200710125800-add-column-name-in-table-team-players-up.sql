/* Replace with your SQL commands */
ALTER TABLE team_players
DROP CONSTRAINT team_players_pkey,
ALTER COLUMN person_id DROP NOT NULL,
ADD COLUMN name VARCHAR(255),
<<<<<<< HEAD
ADD COLUMN id UUID DEFAULT uuid_generate_v4() PRIMARY KEY;
=======
ADD COLUMN id UUID NOT NULL;

ALTER TABLE team_players
ADD PRIMARY KEY (id);
>>>>>>> WIP roster can now be fully modified in event registration TODO: Add to db when finishing stepper
