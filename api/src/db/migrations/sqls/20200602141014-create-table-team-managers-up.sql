/* Replace with your SQL commands */
CREATE TABLE team_managers (
  user_id UUID REFERENCES users(id) FOREIGN KEY NOT NULL,
  team_id UUID REFERENCES teams(id) FOREIGN KEY NOT NULL,
  role INTEGER NOT NULL,
  PRIMARY KEY(user_id, team_id)
  );