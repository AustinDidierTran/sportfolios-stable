/* Replace with your SQL commands */
ALTER TABLE team_players
  DROP CONSTRAINT team_players_person_id_fkey,
  ADD CONSTRAINT team_players_person_id_fkey FOREIGN KEY (person_id) REFERENCES entities(id);

ALTER TABLE memberships
  DROP CONSTRAINT memberships_organization_id_fkey,
  ADD CONSTRAINT memberships_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES entities(id);

ALTER TABLE memberships
  DROP CONSTRAINT memberships_person_id_fkey,
  ADD CONSTRAINT memberships_person_id_fkey FOREIGN KEY (person_id) REFERENCES entities(id);

ALTER TABLE team_rosters
  DROP CONSTRAINT team_rosters_team_id_fkey,
  ADD CONSTRAINT team_rosters_team_id_fkey FOREIGN KEY (team_id) REFERENCES entities(id);

ALTER TABLE division_ranking
  DROP CONSTRAINT division_ranking_team_id_fkey,
  ADD CONSTRAINT division_ranking_team_id_fkey FOREIGN KEY (team_id) REFERENCES entities(id);

ALTER TABLE event_rosters
  DROP CONSTRAINT event_rosters_team_id_fkey,
  ADD CONSTRAINT event_rosters_team_id_fkey FOREIGN KEY (team_id) REFERENCES entities(id);

DROP TABLE persons;

DROP TABLE organizations;

DROP TABLE teams;