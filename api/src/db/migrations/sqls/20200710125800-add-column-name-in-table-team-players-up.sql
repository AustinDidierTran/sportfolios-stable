/* Replace with your SQL commands */
ALTER TABLE team_players
DROP CONSTRAINT team_players_pkey,
ALTER COLUMN person_id DROP NOT NULL,
ADD COLUMN name VARCHAR(255),
ADD COLUMN id UUID DEFAULT uuid_generate_v4() PRIMARY KEY;
