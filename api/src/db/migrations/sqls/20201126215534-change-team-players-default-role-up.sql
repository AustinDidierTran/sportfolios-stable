ALTER TABLE team_players
  ALTER COLUMN role SET DEFAULT 'player';

UPDATE team_players
  SET role = 'player' WHERE role IS NULL;