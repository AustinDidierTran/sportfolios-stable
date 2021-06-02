/* Replace with your SQL commands */
ALTER TABLE roster_players
  DROP CONSTRAINT unique_roster_id_person_id;

ALTER TABLE team_players
  DROP CONSTRAINT unique_team_id_person_id;

DELETE FROM team_players;
