/* Replace with your SQL commands */
CREATE TABLE event_rosters (
roster_id UUID REFERENCES team_rosters(id)  NOT NULL,
event_id UUID REFERENCES events(id) NOT NULL,
PRIMARY KEY(roster_id,person_id)
  );