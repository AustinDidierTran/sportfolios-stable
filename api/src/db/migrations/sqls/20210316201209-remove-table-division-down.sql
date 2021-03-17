/* Replace with your SQL commands */
CREATE TABLE divisions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_id UUID REFERENCES events(id) NOT NULL,
  name VARCHAR(255) NOT NULL
);

ALTER TABLE divisions
ALTER name SET DEFAULT 'Main';

CREATE TABLE division_ranking (
  team_id UUID REFERENCES entities(id) NOT NULL,
  division_id UUID REFERENCES divisions(id) NOT NULL,
  initial_position INTEGER NOT NULL,
  final_position INTEGER,
  PRIMARY KEY(team_id,division_id)
);

ALTER TABLE division_ranking
  DROP CONSTRAINT division_ranking_team_id_fkey,
  ADD CONSTRAINT division_ranking_team_id_fkey FOREIGN KEY (team_id) REFERENCES entities(id);

  ALTER TABLE division_ranking
  DROP CONSTRAINT division_ranking_pkey,
  ALTER division_id DROP NOT NULL,
  ALTER initial_position DROP NOT NULL,
  ALTER final_position DROP NOT NULL,
  ADD COLUMN event_id UUID REFERENCES entities(id),
  ADD PRIMARY KEY (team_id,event_id);

  ALTER TABLE phase
  ADD COLUMN division_id UUID REFERENCES divisions(id);