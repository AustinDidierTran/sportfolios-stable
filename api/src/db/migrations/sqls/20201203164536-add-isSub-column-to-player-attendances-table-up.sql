ALTER TABLE game_players_attendance
  ADD CONSTRAINT game_id_roster_id_player_id_key UNIQUE (game_id, roster_id, player_id),
  ADD COLUMN is_sub BOOLEAN NOT NULL DEFAULT FALSE;