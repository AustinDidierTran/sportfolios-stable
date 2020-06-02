/* Replace with your SQL commands */
CREATE TABLE team_players (
roster_id UUID REFERENCES team_rosters(id) NOT NULL,
person_id UUID REFERENCES person(id) NOT NULL,
PRIMARY KEY(roster_id,person_id)
  );