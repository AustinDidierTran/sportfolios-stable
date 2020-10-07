/* Replace with your SQL commands */
DELETE FROM schedule_teams
  WHERE id IN
    (SELECT id FROM 
        (SELECT id,
         ROW_NUMBER() OVER( PARTITION BY event_id,
         roster_id
        ORDER BY  id ) AS row_num
        FROM schedule_teams ) t
        WHERE t.row_num > 1 );

ALTER TABLE schedule_teams
  ADD CONSTRAINT schedule_teams_unique UNIQUE (event_id, roster_id);



