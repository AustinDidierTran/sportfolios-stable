/* Replace with your SQL commands */
CREATE TABLE score_suggestion(
  game_id UUID REFERENCES games(id),
  event_id UUID REFERENCES entities(id),
  start_time TIMESTAMP,
  your_team VARCHAR(255),
  your_roster_id UUID REFERENCES team_rosters(id),
  your_score INTEGER,
  opposing_team VARCHAR(255),
  opposing_roster_id UUID REFERENCES team_rosters(id),
  opposing_team_score INTEGER,
  opposing_team_spirit INTEGER,
  created_at timestamp DEFAULT now()
);