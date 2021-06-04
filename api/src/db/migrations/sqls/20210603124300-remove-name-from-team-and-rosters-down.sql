/* Replace with your SQL commands */
DROP VIEW team_players_infos;

DROP VIEW roster_players_infos;

ALTER TABLE roster_players
  ADD COLUMN name VARCHAR(255);

ALTER TABLE team_players
  ADD COLUMN name VARCHAR(255);

UPDATE roster_players
  SET name=t.name
    FROM( SELECT CONCAT(entities_general_infos.name, ' ', entities_general_infos.surname) AS name, roster_players.id FROM entities_general_infos
      LEFT JOIN roster_players ON person_id=entity_id) t
	      WHERE t.id=roster_players.id;

UPDATE team_players
  SET name=t.name
    FROM( SELECT CONCAT(entities_general_infos.name, ' ', entities_general_infos.surname) AS name, team_players.id FROM entities_general_infos
      LEFT JOIN team_players ON person_id=entity_id) t
	      WHERE t.id=team_players.id;
