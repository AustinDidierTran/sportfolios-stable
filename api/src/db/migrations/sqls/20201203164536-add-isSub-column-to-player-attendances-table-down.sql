ALTER TABLE game_players_attendance
  DROP CONSTRAINT IF EXISTS game_id_roster_id_player_id_key,
  DROP COLUMN IF EXISTS is_sub;