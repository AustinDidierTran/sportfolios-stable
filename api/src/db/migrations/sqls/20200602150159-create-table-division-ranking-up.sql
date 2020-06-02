/* Replace with your SQL commands */
CREATE TABLE division_ranking (
team_id UUID REFERENCES teams(id) FOREIGN KEY NOT NULL,
division_id UUID REFERENCES event_divisions(id) FOREIGN KEY NOT NULL,
initial_position INTEGER NOT NULL,
final_position INTEGER,
PRIMARY KEY(team_id,division_id)
  );