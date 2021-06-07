/* Replace with your SQL commands */
ALTER TABLE roster_players
  DROP COLUMN name;

ALTER TABLE team_players
  DROP COLUMN name;

CREATE OR REPLACE VIEW team_players_infos AS
  SELECT 
  team_players.id,
  team_players.team_id,
  team_players.person_id,
  team_players.role,
  team_players.created_at,
  team_players.updated_at,
  photo_url,
  CONCAT(name, ' ', surname) AS name
   FROM team_players    
    LEFT JOIN entities_general_infos ON person_id=entity_id;

CREATE OR REPLACE VIEW roster_players_infos AS
  SELECT 
  roster_players.id,
  roster_players.roster_id,
  roster_players.person_id,
  roster_players.role,
  roster_players.created_at,
  roster_players.updated_at,
  roster_players.is_sub,
  roster_players.payment_status,
  roster_players.invoice_item_id,
  photo_url,
  CONCAT(name, ' ', surname) AS name
   FROM roster_players    
    LEFT JOIN entities_general_infos ON person_id=entity_id;