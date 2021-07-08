---[HOW TO USE]-----------------------------------------------------------------------|
-- first copy paste execute the create function in postgres                           |
-- then execute SELECT create_session_template('Name of team','Name of session');     |
-- that's it, new event created!                                                      |
--------------------------------------------------------------------------------------|

CREATE OR REPLACE FUNCTION create_session_template(teamName CHARACTER VARYING, sessionName CHARACTER VARYING)
    RETURNS UUID AS
$BODY$
DECLARE didierEntityId UUID;
DECLARE teamId UUID;
DECLARE rosterId UUID;
DECLARE sessionId UUID;
DECLARE playerId1 UUID;
DECLARE playerId2 UUID;
DECLARE playerId3 UUID;
DECLARE playerId4 UUID;
DECLARE playerId5 UUID;
DECLARE exerciseId1 UUID;
DECLARE exerciseId2 UUID;
DECLARE exerciseId3 UUID;
DECLARE exerciseId4 UUID;
DECLARE exerciseId5 UUID;
DECLARE commentId1 UUID;
DECLARE commentId2 UUID;
DECLARE commentId3 UUID;
DECLARE commentId4 UUID;
DECLARE commentId5 UUID;
DECLARE evaluationId1 UUID;
DECLARE evaluationId2 UUID;
DECLARE evaluationId3 UUID;
DECLARE evaluationId4 UUID;
DECLARE evaluationId5 UUID;
DECLARE evaluationId6 UUID;
DECLARE evaluationId7 UUID;
DECLARE evaluationId8 UUID;
DECLARE evaluationId9 UUID;
BEGIN
    -- get Didier's entityId    
    SELECT (entity_id) FROM user_entity_role WHERE user_id = (SELECT (user_id) FROM user_app_role WHERE app_role = 1) INTO didierEntityId;

    -- create team
    INSERT INTO entities (type) VALUES (3) RETURNING id INTO teamId;
    INSERT INTO entities_general_infos (entity_id, name) VALUES (teamId, teamName);
    INSERT INTO entities_role (entity_id, role, entity_id_admin) VALUES (teamId, 1, didierEntityId);

    -- create players
    INSERT INTO entities (type) VALUES (1) RETURNING id INTO playerId1;
    INSERT INTO entities_general_infos (entity_id, name) VALUES (playerId1, 'Steve Jobs');
    
    INSERT INTO entities (type) VALUES (1) RETURNING id INTO playerId2;
    INSERT INTO entities_general_infos (entity_id, name) VALUES (playerId2, 'Johnny Cash');

    INSERT INTO entities (type) VALUES (1) RETURNING id INTO playerId3;
    INSERT INTO entities_general_infos (entity_id, name) VALUES (playerId3, 'Carey Price');

    INSERT INTO entities (type) VALUES (1) RETURNING id INTO playerId4;
    INSERT INTO entities_general_infos (entity_id, name) VALUES (playerId4, 'Bob Marley');

    INSERT INTO entities (type) VALUES (1) RETURNING id INTO playerId5;
    INSERT INTO entities_general_infos (entity_id, name) VALUES (playerId5, 'Austin-Didier Tran');


    --add team player
    INSERT INTO team_players (team_id, person_id, role) VALUES (teamId, didierEntityId, 'coach'); 
    INSERT INTO team_players (team_id, person_id, role) VALUES (teamId, playerId1, 'player'); 
    INSERT INTO team_players (team_id, person_id, role) VALUES (teamId, playerId2, 'player'); 
    INSERT INTO team_players (team_id, person_id, role) VALUES (teamId, playerId3, 'player'); 
    INSERT INTO team_players (team_id, person_id, role) VALUES (teamId, playerId4, 'player'); 
    INSERT INTO team_players (team_id, person_id, role) VALUES (teamId, playerId5, 'player'); 

    -- create roster
    INSERT INTO team_rosters (team_id) VALUES (teamId) RETURNING id INTO rosterId;

    --add roster player
    INSERT INTO roster_players (roster_id, person_id, role) VALUES (rosterId, didierEntityId, 'coach'); 
    INSERT INTO roster_players (roster_id, person_id, role) VALUES (rosterId, playerId1, 'player'); 
    INSERT INTO roster_players (roster_id, person_id, role) VALUES (rosterId, playerId2, 'player'); 
    INSERT INTO roster_players (roster_id, person_id, role) VALUES (rosterId, playerId3, 'player'); 
    INSERT INTO roster_players (roster_id, person_id, role) VALUES (rosterId, playerId4, 'player'); 
    INSERT INTO roster_players (roster_id, person_id, role) VALUES (rosterId, playerId5, 'player'); 

    -- create session
    INSERT INTO sessions (roster_id, start_date, end_date, name, type) VALUES (rosterId, NOW()+ interval '1 day', NOW() + interval '2 day', sessionName, 'practice') RETURNING id INTO sessionId;

    --create exercises
    INSERT INTO exercises (name, description, type) VALUES ('Long throw', 'In this exercise you are going to do 5 long throws long to a teammate', 'Default') RETURNING id INTO exerciseId1;
    INSERT INTO exercises (name, description, type) VALUES ('Short throw', 'In this exercise you are going to do 5 short throws court to a teammate', 'Default') RETURNING id INTO exerciseId2;
    INSERT INTO exercises (name, description, type) VALUES ('Hammer throw', 'In this exercise you are going to do 5 hammer throws marteau to a teammate', 'Default') RETURNING id INTO exerciseId3;
    INSERT INTO exercises (name, description, type) VALUES ('T test', 'In this exercise you are going to do the T test as fast as you can 5 times', 'Default') RETURNING id INTO exerciseId4;
    INSERT INTO exercises (name, description, type) VALUES ('Sky battle', 'In this exercise you are going to battle in the air to catch a disc', 'Default') RETURNING id INTO exerciseId5;

    --add exercises to session
    INSERT INTO session_exercises (session_id, exercise_id) VALUES (sessionId, exerciseId1);
    INSERT INTO session_exercises (session_id, exercise_id) VALUES (sessionId, exerciseId2);
    INSERT INTO session_exercises (session_id, exercise_id) VALUES (sessionId, exerciseId3);
    INSERT INTO session_exercises (session_id, exercise_id) VALUES (sessionId, exerciseId4);
    INSERT INTO session_exercises (session_id, exercise_id) VALUES (sessionId, exerciseId5);

    --create comments
    INSERT INTO comments (content, active) VALUES ('Good intensity', true) RETURNING id INTO commentId1;
    INSERT INTO comments (content, active) VALUES ('Perfect pass', true) RETURNING id INTO commentId2;
    INSERT INTO comments (content, active) VALUES ('Throw away', true) RETURNING id INTO commentId3;
    INSERT INTO comments (content, active) VALUES ('Nice catch', true) RETURNING id INTO commentId4;
    INSERT INTO comments (content, active) VALUES ('Pass dropped', true) RETURNING id INTO commentId5;

    --create evaluation
    INSERT INTO evaluations (exercise_id, coach_id, person_id, session_id, value) VALUES (exerciseId1, didierEntityId, playerId1, sessionId, -1) RETURNING id INTO evaluationId1;
    INSERT INTO evaluations (exercise_id, coach_id, person_id, session_id, value) VALUES (exerciseId1, didierEntityId, playerId2, sessionId, 2) RETURNING id INTO evaluationId2;
    INSERT INTO evaluations (exercise_id, coach_id, person_id, session_id, value) VALUES (exerciseId1, didierEntityId, playerId5, sessionId, 1) RETURNING id INTO evaluationId3;
    INSERT INTO evaluations (exercise_id, coach_id, person_id, session_id, value) VALUES (exerciseId2, didierEntityId, playerId3, sessionId, 0) RETURNING id INTO evaluationId4;
    INSERT INTO evaluations (exercise_id, coach_id, person_id, session_id, value) VALUES (exerciseId2, didierEntityId, playerId4, sessionId, 1) RETURNING id INTO evaluationId5;
    INSERT INTO evaluations (exercise_id, coach_id, person_id, session_id, value) VALUES (exerciseId2, didierEntityId, playerId1, sessionId, -2) RETURNING id INTO evaluationId6;
    INSERT INTO evaluations (exercise_id, coach_id, person_id, session_id, value) VALUES (exerciseId3, didierEntityId, playerId5, sessionId, -1) RETURNING id INTO evaluationId7;
    INSERT INTO evaluations (exercise_id, coach_id, person_id, session_id, value) VALUES (exerciseId3, didierEntityId, playerId4, sessionId, 0) RETURNING id INTO evaluationId8;
    INSERT INTO evaluations (exercise_id, coach_id, person_id, session_id, value) VALUES (exerciseId3, didierEntityId, playerId2, sessionId, 2) RETURNING id INTO evaluationId9;

    --add evaluation comments
    INSERT INTO evaluation_comments (evaluation_id, comment_id) VALUES (evaluationId1, commentId1);
    INSERT INTO evaluation_comments (evaluation_id, comment_id) VALUES (evaluationId1, commentId2);
    INSERT INTO evaluation_comments (evaluation_id, comment_id) VALUES (evaluationId2, commentId2);
    INSERT INTO evaluation_comments (evaluation_id, comment_id) VALUES (evaluationId2, commentId3);
    INSERT INTO evaluation_comments (evaluation_id, comment_id) VALUES (evaluationId2, commentId4);
    INSERT INTO evaluation_comments (evaluation_id, comment_id) VALUES (evaluationId3, commentId5);
    INSERT INTO evaluation_comments (evaluation_id, comment_id) VALUES (evaluationId4, commentId5);
    INSERT INTO evaluation_comments (evaluation_id, comment_id) VALUES (evaluationId5, commentId4);
    INSERT INTO evaluation_comments (evaluation_id, comment_id) VALUES (evaluationId6, commentId3);
    INSERT INTO evaluation_comments (evaluation_id, comment_id) VALUES (evaluationId6, commentId2);
    INSERT INTO evaluation_comments (evaluation_id, comment_id) VALUES (evaluationId6, commentId1);

    RETURN sessionId;
END;
$BODY$
 LANGUAGE plpgsql VOLATILE;