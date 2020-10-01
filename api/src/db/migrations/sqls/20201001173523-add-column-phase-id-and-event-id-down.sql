/* Replace with your SQL commands */
DELETE FROM division_ranking;

ALTER TABLE division_ranking
  DROP CONSTRAINT division_ranking_pkey,
  DROP COLUMN event_id,
  ALTER division_id SET NOT NULL,
  ALTER initial_position SET NOT NULL,
  ALTER final_position SET NOT NULL,
  ADD PRIMARY KEY (team_id, division_id);
