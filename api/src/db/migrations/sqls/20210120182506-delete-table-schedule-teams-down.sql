/* Replace with your SQL commands */
CREATE TABLE schedule_teams (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_id UUID REFERENCES entities(id) NOT NULL,
  roster_id UUID REFERENCES team_rosters(id), 
  name VARCHAR(255)
);

ALTER TABLE schedule_teams
  ADD CONSTRAINT schedule_teams_unique UNIQUE (event_id, roster_id);