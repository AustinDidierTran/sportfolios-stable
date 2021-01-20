---[HOW TO USE]-----------------------------------------------------------------------|
-- first copy paste execute the create function in postgres                           |
-- then execute SELECT create_event_template('Name of event','Name of organization');  |
-- that's it, new event created!                                                      |
--------------------------------------------------------------------------------------|

CREATE OR REPLACE FUNCTION create_event_template(eventName CHARACTER VARYING, organizationName CHARACTER VARYING)
    RETURNS UUID AS
$BODY$
DECLARE didierEntityId UUID;
DECLARE organizationEntityId UUID;
DECLARE eventEntityId UUID;
DECLARE eventId UUID;
DECLARE paymentOptionId UUID;
DECLARE phaseId UUID;
DECLARE slot1 UUID;
DECLARE slot2 UUID;
DECLARE slot3 UUID;
DECLARE slot4 UUID;
DECLARE slot5 UUID;
DECLARE slot6 UUID;
DECLARE field1 UUID;
DECLARE field2 UUID;
DECLARE field3 UUID;
DECLARE field4 UUID;
DECLARE teamEntityId1 UUID;
DECLARE teamEntityId2 UUID;
DECLARE teamEntityId3 UUID;
DECLARE teamEntityId4 UUID;
DECLARE teamId1 UUID;
DECLARE teamId2 UUID;
DECLARE teamId3 UUID;
DECLARE teamId4 UUID;
DECLARE gameId1 UUID;
DECLARE gameId2 UUID;
DECLARE gameId3 UUID;
DECLARE gameId4 UUID;
DECLARE gameId5 UUID;
DECLARE gameId6 UUID;
BEGIN
    -- get Didier's entityId
    SELECT (entity_id) FROM user_entity_role WHERE user_id = (SELECT (user_id) FROM user_app_role WHERE app_role = 1) INTO didierEntityId;

    --create organization entity 
    INSERT INTO entities (type) VALUES (2) RETURNING id INTO organizationEntityId;

    --create organization
    INSERT INTO entities_general_infos (entity_id, description, quick_description) VALUES (organizationEntityId, null, null);
    INSERT INTO entities_name (entity_id, name, surname) VALUES (organizationEntityId, organizationName, '');
    INSERT INTO entities_photo (entity_id, photo_url) VALUES (organizationEntityId, null);
    INSERT INTO entities_role (entity_id, role, entity_id_admin) VALUES (organizationEntityId, 1, didierEntityId);

    -- create event entity
    INSERT INTO entities (type) VALUES (4) RETURNING id INTO eventEntityId;

    -- create event
    INSERT INTO events (id, start_date, end_date, maximum_spots) VALUES (eventEntityId, NOW(), NOW() + interval '1 year', 8) RETURNING id INTO eventId;
    INSERT INTO entities_general_infos (entity_id, description, quick_description) VALUES (eventId, null, null);
    INSERT INTO entities_name (entity_id, name, surname) VALUES (eventId, eventName, '');
    INSERT INTO entities_photo (entity_id, photo_url) VALUES (eventId, null);
    INSERT INTO entities_role (entity_id, role, entity_id_admin) VALUES (eventId, 1, organizationEntityId);

    -- create payment option
    INSERT INTO event_payment_options (team_stripe_price_id, event_id, name, team_price, start_time, end_time, individual_price, individual_stripe_price_id) VALUES (null, eventId, 'Base', 0, NOW(), NOW() + interval '1 year', 0, null) RETURNING id INTO paymentOptionId; 

    -- create timeslots
    INSERT INTO event_time_slots (event_id, date, end_time) VALUES (eventId, '2021-01-11 08:00:00', null) RETURNING id INTO slot1;
    INSERT INTO event_time_slots (event_id, date, end_time) VALUES (eventId, '2021-01-11 10:00:00', null) RETURNING id INTO slot2;
    INSERT INTO event_time_slots (event_id, date, end_time) VALUES (eventId, '2021-01-11 12:00:00', null) RETURNING id INTO slot3;
    INSERT INTO event_time_slots (event_id, date, end_time) VALUES (eventId, '2021-01-11 14:00:00', null) RETURNING id INTO slot4;
    INSERT INTO event_time_slots (event_id, date, end_time) VALUES (eventId, '2021-01-11 16:00:00', null) RETURNING id INTO slot5;
    INSERT INTO event_time_slots (event_id, date, end_time) VALUES (eventId, '2021-01-11 18:00:00', null) RETURNING id INTO slot6;

    -- create fields
    INSERT INTO event_fields (event_id, field) VALUES (eventId, 'Terrain 1') RETURNING id INTO field1;
    INSERT INTO event_fields (event_id, field) VALUES (eventId, 'Terrain 2') RETURNING id INTO field2;
    INSERT INTO event_fields (event_id, field) VALUES (eventId, 'Terrain 3') RETURNING id INTO field3;
    INSERT INTO event_fields (event_id, field) VALUES (eventId, 'Terrain 4') RETURNING id INTO field4;

    -- create phase
    INSERT INTO phase (division_id, name, event_id) VALUES (null, 'Pool A', eventId) RETURNING id INTO phaseId;

    -- create teams
    INSERT INTO entities (type) VALUES (3) RETURNING id INTO teamEntityId1;
    INSERT INTO entities_general_infos (entity_id, description, quick_description) VALUES (teamEntityId1, null, null);
    INSERT INTO entities_name (entity_id, name, surname) VALUES (teamEntityId1, 'Team Alpha', '');
    INSERT INTO entities_photo (entity_id, photo_url) VALUES (teamEntityId1, null);
    INSERT INTO entities_role (entity_id, role, entity_id_admin) VALUES (teamEntityId1, 1, didierEntityId);

    INSERT INTO entities (type) VALUES (3) RETURNING id INTO teamEntityId2;
    INSERT INTO entities_general_infos (entity_id, description, quick_description) VALUES (teamEntityId2, null, null);
    INSERT INTO entities_name (entity_id, name, surname) VALUES (teamEntityId2, 'Team Beta', '');
    INSERT INTO entities_photo (entity_id, photo_url) VALUES (teamEntityId2, null);
    INSERT INTO entities_role (entity_id, role, entity_id_admin) VALUES (teamEntityId2, 1, didierEntityId);

    INSERT INTO entities (type) VALUES (3) RETURNING id INTO teamEntityId3;
    INSERT INTO entities_general_infos (entity_id, description, quick_description) VALUES (teamEntityId3, null, null);
    INSERT INTO entities_name (entity_id, name, surname) VALUES (teamEntityId3, 'Team Charlie', '');
    INSERT INTO entities_photo (entity_id, photo_url) VALUES (teamEntityId3, null);
    INSERT INTO entities_role (entity_id, role, entity_id_admin) VALUES (teamEntityId3, 1, didierEntityId);

    INSERT INTO entities (type) VALUES (3) RETURNING id INTO teamEntityId4;
    INSERT INTO entities_general_infos (entity_id, description, quick_description) VALUES (teamEntityId4, null, null);
    INSERT INTO entities_name (entity_id, name, surname) VALUES (teamEntityId4, 'Team Delta', '');
    INSERT INTO entities_photo (entity_id, photo_url) VALUES (teamEntityId4, null);
    INSERT INTO entities_role (entity_id, role, entity_id_admin) VALUES (teamEntityId4, 1, didierEntityId);

    -- create rosters
    INSERT INTO team_rosters (team_id) VALUES (teamEntityId1) RETURNING id INTO teamId1;
    INSERT INTO team_rosters (team_id) VALUES (teamEntityId2) RETURNING id INTO teamId2;
    INSERT INTO team_rosters (team_id) VALUES (teamEntityId3) RETURNING id INTO teamId3;
    INSERT INTO team_rosters (team_id) VALUES (teamEntityId4) RETURNING id INTO teamId4;

    -- add captain
    INSERT INTO team_players (roster_id,person_id,name,role) VALUES (teamId1,didierEntityId,'Austin-Didier Tran','captain'); 
    INSERT INTO team_players (roster_id,person_id,name,role) VALUES (teamId2,didierEntityId,'Austin-Didier Tran','captain'); 
    INSERT INTO team_players (roster_id,person_id,name,role) VALUES (teamId3,didierEntityId,'Austin-Didier Tran','captain'); 
    INSERT INTO team_players (roster_id,person_id,name,role) VALUES (teamId4,didierEntityId,'Austin-Didier Tran','captain'); 

    -- add rosters to event
    INSERT INTO event_rosters (roster_id, event_id, team_id, status, registration_status, invoice_item_id, payment_option_id) VALUES (teamId1, eventId, teamEntityId1, 'free', 'accepted free', null, paymentOptionId);
    INSERT INTO event_rosters (roster_id, event_id, team_id, status, registration_status, invoice_item_id, payment_option_id) VALUES (teamId2, eventId, teamEntityId2, 'free', 'accepted free', null, paymentOptionId);
    INSERT INTO event_rosters (roster_id, event_id, team_id, status, registration_status, invoice_item_id, payment_option_id) VALUES (teamId3, eventId, teamEntityId3, 'free', 'accepted free', null, paymentOptionId);
    INSERT INTO event_rosters (roster_id, event_id, team_id, status, registration_status, invoice_item_id, payment_option_id) VALUES (teamId4, eventId, teamEntityId4, 'free', 'accepted free', null, paymentOptionId);

    -- create division
    INSERT INTO divisions (event_id, name) VALUES (eventId, 'Main');

    -- add rosters to division ranking
    INSERT INTO division_ranking (team_id, division_id, initial_position, final_position, event_id) VALUES (teamEntityId1, null, null, null, eventId);
    INSERT INTO division_ranking (team_id, division_id, initial_position, final_position, event_id) VALUES (teamEntityId2, null, null, null, eventId);
    INSERT INTO division_ranking (team_id, division_id, initial_position, final_position, event_id) VALUES (teamEntityId3, null, null, null, eventId);
    INSERT INTO division_ranking (team_id, division_id, initial_position, final_position, event_id) VALUES (teamEntityId4, null, null, null, eventId);

    -- add rosters to schedule
    INSERT INTO schedule_teams (event_id, roster_id, name) VALUES (eventId, teamId1, 'Team Alpha');
    INSERT INTO schedule_teams (event_id, roster_id, name) VALUES (eventId, teamId2, 'Team Beta');
    INSERT INTO schedule_teams (event_id, roster_id, name) VALUES (eventId, teamId3, 'Team Charlie');
    INSERT INTO schedule_teams (event_id, roster_id, name) VALUES (eventId, teamId4, 'Team Delta');

    -- create games
    INSERT INTO games (phase_id, location_id, event_id, timeslot_id, field_id) VALUES (phaseId, null, eventId, slot6, field1) RETURNING id INTO gameId1;
    INSERT INTO games (phase_id, location_id, event_id, timeslot_id, field_id) VALUES (phaseId, null, eventId, slot2, field2) RETURNING id INTO gameId2;
    INSERT INTO games (phase_id, location_id, event_id, timeslot_id, field_id) VALUES (phaseId, null, eventId, slot5, field3) RETURNING id INTO gameId3;
    INSERT INTO games (phase_id, location_id, event_id, timeslot_id, field_id) VALUES (phaseId, null, eventId, slot1, field4) RETURNING id INTO gameId4;
    INSERT INTO games (phase_id, location_id, event_id, timeslot_id, field_id) VALUES (phaseId, null, eventId, slot4, field2) RETURNING id INTO gameId5;
    INSERT INTO games (phase_id, location_id, event_id, timeslot_id, field_id) VALUES (phaseId, null, eventId, slot3, field3) RETURNING id INTO gameId6;

    -- team a vs team b
    INSERT INTO game_teams (game_id, roster_id, score, position, name, spirit) VALUES (gameId1, teamId1, 0, null, 'Team Alpha', null);
    INSERT INTO game_teams (game_id, roster_id, score, position, name, spirit) VALUES (gameId1, teamId2, 0, null, 'Team Beta', null);
    INSERT INTO game_teams (game_id, roster_id, score, position, name, spirit) VALUES (gameId2, teamId1, 0, null, 'Team Alpha', null);
    INSERT INTO game_teams (game_id, roster_id, score, position, name, spirit) VALUES (gameId2, teamId3, 0, null, 'Team Charlie', null);
    INSERT INTO game_teams (game_id, roster_id, score, position, name, spirit) VALUES (gameId3, teamId1, 0, null, 'Team Alpha', null);
    INSERT INTO game_teams (game_id, roster_id, score, position, name, spirit) VALUES (gameId3, teamId4, 0, null, 'Team Delta', null);
    INSERT INTO game_teams (game_id, roster_id, score, position, name, spirit) VALUES (gameId4, teamId2, 0, null, 'Team Beta', null);
    INSERT INTO game_teams (game_id, roster_id, score, position, name, spirit) VALUES (gameId4, teamId3, 0, null, 'Team Charlie', null);
    INSERT INTO game_teams (game_id, roster_id, score, position, name, spirit) VALUES (gameId5, teamId2, 0, null, 'Team Beta', null);
    INSERT INTO game_teams (game_id, roster_id, score, position, name, spirit) VALUES (gameId5, teamId4, 0, null, 'Team Delta', null);
    INSERT INTO game_teams (game_id, roster_id, score, position, name, spirit) VALUES (gameId6, teamId3, 0, null, 'Team Charlie', null);
    INSERT INTO game_teams (game_id, roster_id, score, position, name, spirit) VALUES (gameId6, teamId4, 0, null, 'Team Delta', null);

    RETURN eventId;
END;
$BODY$
 LANGUAGE plpgsql VOLATILE;