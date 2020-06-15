CREATE TABLE events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL
);

CREATE TABLE event_rosters (
  roster_id UUID REFERENCES team_rosters(id)  NOT NULL,
  event_id UUID REFERENCES events(id) NOT NULL,
  PRIMARY KEY(roster_id,event_id)
);

CREATE TABLE divisions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_id UUID REFERENCES events(id) NOT NULL,
  name VARCHAR(255) NOT NULL
);

CREATE TABLE division_ranking (
  team_id UUID REFERENCES teams(id) NOT NULL,
  division_id UUID REFERENCES divisions(id) NOT NULL,
  initial_position INTEGER NOT NULL,
  final_position INTEGER,
  PRIMARY KEY(team_id,division_id)
);

CREATE TABLE phase (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  division_id UUID REFERENCES divisions(id) NOT NULL,
  name VARCHAR(255) NOT NULL
);

CREATE TABLE location (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  location VARCHAR(255) NOT NULL
);

CREATE TABLE games (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  phase_id UUID REFERENCES phase(id) NOT NULL,
  location_id UUID REFERENCES location(id) NOT NULL,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  field VARCHAR(255)
);

CREATE TABLE phase_link(
  initial_phase UUID NOT NULL,
  final_phase UUID NOT NULL,
  initial_position INTEGER NOT NULL,
  final_position INTEGER NOT NULL
);

CREATE TABLE game_teams(
  game_id UUID REFERENCES games(id) NOT NULL,
  roster_id UUID REFERENCES team_rosters(id) NOT NULL,
  score INTEGER NOT NULL,
  position INTEGER NOT NULL
);

