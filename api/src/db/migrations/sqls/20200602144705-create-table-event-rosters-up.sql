/* Replace with your SQL commands */
CREATE TABLE event_rosters (
roster_id UUID REFERENCES team_rosters(id) FOREIGN KEY NOT NULL,
event_id UUID REFERENCES events(id) FOREIGN KEY NOT NULL,
PRIMARY KEY(roster_id,person_id)
  );