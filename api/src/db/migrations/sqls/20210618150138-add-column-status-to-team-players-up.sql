/* Replace with your SQL commands */
CREATE TABLE team_players_request(
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  team_id UUID REFERENCES entities(id) NOT NULL,
  person_id UUID REFERENCES entities(id) NOT NULL,
  status VARCHAR(255) NOT NULL,
  UNIQUE (team_id,person_id)
  );