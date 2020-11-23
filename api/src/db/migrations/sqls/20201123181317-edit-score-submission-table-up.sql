ALTER TABLE SCORE_SUGGESTION RENAME COLUMN YOUR_ROSTER_ID TO SUBMITTED_BY_ROSTER;


ALTER TABLE SCORE_SUGGESTION RENAME COLUMN CREATED_BY TO SUBMITTED_BY_PERSON;


ALTER TABLE SCORE_SUGGESTION
DROP COLUMN EVENT_ID,
DROP COLUMN YOUR_TEAM,
DROP COLUMN YOUR_SCORE,
DROP COLUMN OPPOSING_TEAM,
DROP COLUMN OPPOSING_ROSTER_ID,
DROP COLUMN OPPOSING_TEAM_SCORE,
DROP COLUMN OPPOSING_TEAM_SPIRIT,
DROP COLUMN PLAYERS,
DROP COLUMN COMMENTS;


ALTER TABLE SCORE_SUGGESTION ADD SCORE JSON,
                                 ADD ID UUID NOT NULL DEFAULT UUID_GENERATE_V4() PRIMARY KEY;


CREATE TABLE SPIRIT_SUBMISSION(ID UUID NOT NULL DEFAULT UUID_GENERATE_V4() PRIMARY KEY,
                                                                                   SUBMITTED_BY_ROSTER UUID REFERENCES TEAM_ROSTERS(ID),
                                                                                                                       SUBMITTED_BY_PERSON UUID REFERENCES ENTITIES(ID),
                                                                                                                                                           GAME_ID UUID REFERENCES GAMES(ID),
                                                                                                                                                                                   COMMENT text, SPIRIT_SCORE integer, SUBMITTED_FOR_ROSTER UUID REFERENCES TEAM_ROSTERS(ID));


CREATE TABLE GAME_PLAYERS_ATTENDANCE AS
SELECT PLAYER_ID,
       GAME_ID,
       ROSTER_ID
FROM GAME_PLAYERS_VIEW;


ALTER TABLE GAME_PLAYERS_ATTENDANCE ADD COLUMN STATUS varchar DEFAULT 'present',
                                                                      ADD COLUMN EDITED_BY UUID REFERENCES ENTITIES(ID),
                                                                                                           ADD COLUMN ID UUID NOT NULL DEFAULT UUID_GENERATE_V4() PRIMARY KEY;