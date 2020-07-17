ALTER TABLE event_rosters
  DROP CONSTRAINT event_rosters_team_id_fkey,
  ADD CONSTRAINT event_rosters_team_id_fkey FOREIGN KEY (team_id) REFERENCES teams(id);

