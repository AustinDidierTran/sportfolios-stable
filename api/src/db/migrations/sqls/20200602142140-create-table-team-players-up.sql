/* Replace with your SQL commands *//* Replace with your SQL commands */
CREATE TABLE team_players (
roster_id UUID REFERENCES team_rosters(id) FOREIGN KEY NOT NULL,
person_id UUID REFERENCES person(id) FOREIGN KEY NOT NULL,
PRIMARY KEY(roster_id,person_id)
  );