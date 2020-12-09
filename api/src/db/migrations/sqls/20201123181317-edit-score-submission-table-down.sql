ALTER TABLE SCORE_SUGGESTION RENAME COLUMN SUBMITTED_BY_ROSTER TO YOUR_ROSTER_ID;


ALTER TABLE SCORE_SUGGESTION RENAME COLUMN SUBMITTED_BY_PERSON TO CREATED_BY;


ALTER TABLE SCORE_SUGGESTION
DROP COLUMN score,
DROP COLUMN id,
  ADD your_team character varying(255),
  ADD event_id uuid references entities(id),
  ADD your_score integer, ADD opposing_team character varying(255),
  ADD opposing_roster_id uuid REFERENCES team_rosters(id),
  ADD opposing_team_score integer, ADD opposing_team_spirit integer, ADD players json,
  ADD comments text;


DROP TABLE spirit_submission;


DROP TABLE GAME_PLAYERS_ATTENDANCE;