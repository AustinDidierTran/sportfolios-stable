ALTER TABLE game_players_attendance
  DROP CONSTRAINT game_id_roster_id_player_id_key,
  DROP COLUMN is_sub;