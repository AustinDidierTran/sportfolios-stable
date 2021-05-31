/* Replace with your SQL commands */
ALTER TABLE team_players RENAME TO roster_players;

CREATE TABLE team_players (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  team_id UUID REFERENCES entities(id) NOT NULL,
  person_id UUID REFERENCES entities(id) NOT NULL,
  name VARCHAR(255),
  role VARCHAR(255) NOT NULL
);

CREATE TABLE sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  roster_id UUID REFERENCES team_rosters(id) NOT NULL,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  name VARCHAR(255) NOT NULL,
  type VARCHAR (255) NOT NULL,
  location VARCHAR(255),
  address_id UUID REFERENCES addresses(id)
);

CREATE TABLE exercises (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT
);

CREATE TABLE session_exercises (
  session_id UUID REFERENCES sessions(id) NOT NULL,
  exercise_id UUID REFERENCES exercises(id) NOT NULL,
  PRIMARY KEY(session_id,exercise_id)
);

CREATE TABLE evaluations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  exercise_id UUID REFERENCES exercises(id) NOT NULL,
  coach_id UUID REFERENCES entities(id) NOT NULL,
  person_id UUID REFERENCES entities(id) NOT NULL,
  event_id UUID REFERENCES entities(id) NOT NULL,
  rating INTEGER
);

CREATE TABLE comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  content TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE evaluation_comments (
  evaluation_id UUID REFERENCES evaluations(id) NOT NULL,
  comment_id UUID REFERENCES comments(id) NOT NULL,
  PRIMARY KEY(evaluation_id, comment_id)
);

CREATE TABLE exercise_comments_suggestions (
  exercise_id UUID REFERENCES exercises(id) NOT NULL,
  comment_id UUID REFERENCES comments(id) NOT NULL,
  PRIMARY KEY(exercise_id, comment_id)
);

CREATE TABLE trialist_devices (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) NOT NULL,
  os VARCHAR(255) NOT NULL
);







