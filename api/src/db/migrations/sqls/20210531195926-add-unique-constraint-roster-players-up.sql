/* Replace with your SQL commands */
CREATE TEMP VIEW duplicates
  AS SELECT id, row_number() over(partition by roster_id, person_id ORDER BY created_at DESC) AS rn
    FROM roster_players;

DELETE FROM roster_players
  WHERE id IN ( 
    SELECT id
      FROM duplicates
        WHERE rn > 1);

ALTER TABLE roster_players
  ADD CONSTRAINT unique_roster_id_person_id UNIQUE (person_id,roster_id);

ALTER TABLE team_players
  ADD CONSTRAINT unique_team_id_person_id UNIQUE (person_id,team_id);


CREATE TEMP VIEW temp_rosters
  AS SELECT *, row_number() over(partition by team_id ORDER BY created_at DESC) AS rn
    FROM team_rosters;

INSERT INTO team_players (team_id, person_id, name, role) (
	SELECT team_id, person_id, name, role FROM temp_rosters 
    LEFT JOIN roster_players ON roster_players.roster_id=temp_rosters.id 
      WHERE temp_rosters.rn = 1 AND person_id IS NOT null
);
