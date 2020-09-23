/* Replace with your SQL commands */
DELETE FROM game_teams WHERE
EXISTS(
           SELECT 1
             FROM games
            WHERE games.id = game_teams.game_id
              and games.start_time IS NULL
       );


DELETE FROM games WHERE start_time IS NULL;

ALTER TABLE games
  ALTER COLUMN start_time SET NOT NULL;