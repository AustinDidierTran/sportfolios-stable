/* Replace with your SQL commands */
CREATE TABLE team_rosters (
id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
team_id UUID REFERENCES teams(id) NOT NULL,
created_at TIMESTAMP DEFAULT now()
  );
