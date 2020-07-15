ALTER TABLE team_rosters
  DROP CONSTRAINT team_rosters_team_id_fkey,
  ADD CONSTRAINT team_rosters_team_id_fkey FOREIGN KEY (team_id) REFERENCES entities(id);

ALTER TABLE event_rosters
  DROP CONSTRAINT event_rosters_team_id_fkey,
  ADD CONSTRAINT event_rosters_team_id_fkey FOREIGN KEY (team_id) REFERENCES entities(id);