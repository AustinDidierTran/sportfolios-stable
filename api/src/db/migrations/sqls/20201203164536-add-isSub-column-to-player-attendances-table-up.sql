DELETE
FROM game_players_attendance
WHERE id in
    (SELECT id
     from
       (SELECT id,
               ROW_NUMBER() OVER(PARTITION BY GAME_ID, ROSTER_ID, PLAYER_ID
                                 ORDER BY id) AS row_num
        FROM game_players_attendance) t
     WHERE t.row_num > 1 );


ALTER TABLE game_players_attendance ADD CONSTRAINT game_id_roster_id_player_id_key UNIQUE (game_id,
                                                                                           roster_id,
                                                                                           player_id), ADD COLUMN is_sub BOOLEAN NOT NULL DEFAULT FALSE;