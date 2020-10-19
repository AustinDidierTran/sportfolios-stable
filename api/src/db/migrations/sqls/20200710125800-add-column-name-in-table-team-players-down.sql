/* Replace with your SQL commands */
ALTER TABLE team_players
DROP CONSTRAINT team_players_pkey,
DROP COLUMN name,
DROP COLUMN id;

DELETE FROM team_players 
WHERE person_id IS NULL;

DELETE FROM team_players
  WHERE person_id IN
    (SELECT person_id FROM 
        (SELECT person_id,
         ROW_NUMBER() OVER( PARTITION BY person_id,
         roster_id
        ORDER BY  person_id ) AS row_num
        FROM team_players ) t
        WHERE t.row_num > 1 );
        
ALTER TABLE team_players
ALTER COLUMN person_id SET NOT NULL,
ADD PRIMARY KEY (roster_id,person_id);



