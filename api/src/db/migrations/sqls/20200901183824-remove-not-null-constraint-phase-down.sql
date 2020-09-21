/* Replace with your SQL commands */
       DELETE FROM game_teams WHERE
EXISTS(
           SELECT 1
              FROM games
              LEFT JOIN phase
              ON games.phase_id = phase.id
              WHERE games.id = game_teams.game_id
              and phase.division_id IS NULL
       );

DELETE FROM games WHERE
EXISTS(
           SELECT 1
             FROM phase
            WHERE phase.id = games.phase_id
              and phase.division_id IS NULL
       );


DELETE FROM phase WHERE division_id IS NULL;

ALTER TABLE phase 
  ALTER COLUMN division_id SET NOT NULL;