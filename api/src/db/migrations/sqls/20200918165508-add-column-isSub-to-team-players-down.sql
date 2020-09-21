/* Replace with your SQL commands */
DELETE FROM team_players WHERE is_sub=true;

ALTER TABLE team_players
  DROP COLUMN is_sub;