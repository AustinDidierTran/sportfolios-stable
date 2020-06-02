/* Replace with your SQL commands */
CREATE TABLE team_managers (
  user_id UUID REFERENCES users(id) NOT NULL,
  team_id UUID REFERENCES teams(id) NOT NULL,
  role INTEGER NOT NULL,
  PRIMARY KEY(user_id, team_id)
  );