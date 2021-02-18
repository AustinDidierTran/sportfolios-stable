/* Replace with your SQL commands */
CREATE TABLE phase_rankings (
	roster_id	 UUID REFERENCES team_rosters(id),
	origin_phase 	 UUID REFERENCES phase(id), 
	origin_position  integer, 
	current_phase	 UUID REFERENCES phase(id) NOT NULL,
	initial_position integer NOT NULL,
	final_position   integer,
	PRIMARY KEY(current_phase, initial_position) 	 
);
