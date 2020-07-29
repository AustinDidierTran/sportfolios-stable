/* Replace with your SQL commands */
CREATE TABLE persons(
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY
);
INSERT INTO persons(id) SELECT id FROM entities WHERE entities.type=1;

CREATE TABLE organizations(
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY
);
INSERT INTO organizations(id) SELECT id FROM entities WHERE entities.type=2;

CREATE TABLE teams(
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY
);
INSERT INTO teams(id) SELECT id FROM entities WHERE entities.type=3;

ALTER TABLE team_players
  DROP CONSTRAINT team_players_person_id_fkey,
  ADD CONSTRAINT team_players_person_id_fkey FOREIGN KEY (person_id) REFERENCES persons(id);

ALTER TABLE memberships
  DROP CONSTRAINT memberships_organization_id_fkey,
  ADD CONSTRAINT memberships_organization_id_fkey FOREIGN KEY (organization_id) REFERENCES organizations(id);
  
ALTER TABLE memberships
  DROP CONSTRAINT memberships_person_id_fkey,
  ADD CONSTRAINT memberships_person_id_fkey FOREIGN KEY (person_id) REFERENCES persons(id);

ALTER TABLE team_rosters
  DROP CONSTRAINT team_rosters_team_id_fkey,
  ADD CONSTRAINT team_rosters_team_id_fkey FOREIGN KEY (team_id) REFERENCES teams(id);

ALTER TABLE division_ranking
  DROP CONSTRAINT division_ranking_team_id_fkey,
  ADD CONSTRAINT division_ranking_team_id_fkey FOREIGN KEY (team_id) REFERENCES teams(id);

ALTER TABLE event_rosters
  DROP CONSTRAINT event_rosters_team_id_fkey,
  ADD CONSTRAINT event_rosters_team_id_fkey FOREIGN KEY (team_id) REFERENCES teams(id);



