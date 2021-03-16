/* Replace with your SQL commands */
INSERT INTO phase (event_id, name, phase_order) 
	SELECT event_id,'prerank', 0 FROM divisions;

create or replace view vvv
as 
( select team_id, event_id 
       , row_number() over (partition by event_id order by team_id) as initial_position
  from division_ranking
);


update division_ranking set initial_position=vvv.initial_position
FROM vvv 
WHERE  division_ranking.event_id=vvv.event_id and division_ranking.team_id=vvv.team_id;
  
	
INSERT INTO phase_rankings (current_phase, initial_position, roster_id) 
	SELECT p.id, d.initial_position, e.roster_id FROM division_ranking d
	LEFT JOIN event_rosters e
	ON d.team_id=e.team_id AND d.event_id=e.event_id
	LEFT JOIN phase p
	ON p.event_id=d.event_id 
	WHERE p.name='prerank';
	
		
ALTER TABLE phase DROP COLUMN division_id;

DROP VIEW vvv;
	
DROP TABLE division_ranking;
	
DROP TABLE divisions;