ALTER TABLE team_players
  ALTER COLUMN role SET DEFAULT NULL;

UPDATE team_players
  SET role = null WHERE role = 'player';