/* Replace with your SQL commands */
ALTER TABLE division_ranking
  DROP CONSTRAINT division_ranking_pkey,
  ALTER division_id DROP NOT NULL,
  ALTER initial_position DROP NOT NULL,
  ALTER final_position DROP NOT NULL,
  ADD COLUMN event_id UUID REFERENCES entities(id),
  ADD PRIMARY KEY (team_id,event_id);

  INSERT INTO division_ranking (team_id,event_id)
  SELECT team_id,event_id
  FROM event_rosters;


