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
DECLARE prerankPhaseId UUID;
DECLARE poolAPhaseId UUID;
DECLARE poolBPhaseId UUID;
DECLARE slot1 UUID;
DECLARE slot2 UUID;
DECLARE slot3 UUID;
DECLARE slot4 UUID;
DECLARE slot5 UUID;
DECLARE slot6 UUID;
DECLARE slot7 UUID;
DECLARE slot8 UUID;
DECLARE slot9 UUID;
DECLARE slot10 UUID;
DECLARE slot11 UUID;
DECLARE slot12 UUID;
DECLARE field1 UUID;
DECLARE field2 UUID;
DECLARE field3 UUID;
DECLARE field4 UUID;
DECLARE teamEntityId1 UUID;
DECLARE teamEntityId2 UUID;
DECLARE teamEntityId3 UUID;
DECLARE teamEntityId4 UUID;
DECLARE teamEntityId5 UUID;
DECLARE teamEntityId6 UUID;
DECLARE teamEntityId7 UUID;
DECLARE teamEntityId8 UUID;
DECLARE teamId1 UUID;
DECLARE teamId2 UUID;
DECLARE teamId3 UUID;
DECLARE teamId4 UUID;
DECLARE teamId5 UUID;
DECLARE teamId6 UUID;
DECLARE teamId7 UUID;
DECLARE teamId8 UUID;
DECLARE poolRankingId1 UUID;
DECLARE poolRankingId2 UUID;
DECLARE poolRankingId3 UUID;
DECLARE poolRankingId4 UUID;
DECLARE poolRankingId5 UUID;
DECLARE poolRankingId6 UUID;
DECLARE poolRankingId7 UUID;
DECLARE poolRankingId8 UUID;
DECLARE gameId1 UUID;
DECLARE gameId2 UUID;
DECLARE gameId3 UUID;
DECLARE gameId4 UUID;
DECLARE gameId5 UUID;
DECLARE gameId6 UUID;
DECLARE gameId7 UUID;
DECLARE gameId8 UUID;
DECLARE gameId9 UUID;
DECLARE gameId10 UUID;
DECLARE gameId11 UUID;
DECLARE gameId12 UUID;
BEGIN
    -- get Didier's entityId
    SELECT (entity_id) FROM user_entity_role WHERE user_id = (SELECT (user_id) FROM user_app_role WHERE app_role = 1) INTO didierEntityId;

    --create organization entity 
    INSERT INTO entities (type) VALUES (2) RETURNING id INTO organizationEntityId;


    --create organization
    INSERT INTO entities_general_infos (entity_id, name) VALUES (organizationEntityId, organizationName);
    INSERT INTO entities_role (entity_id, role, entity_id_admin) VALUES (organizationEntityId, 1, didierEntityId);

    -- create event entity
    INSERT INTO entities (type) VALUES (4) RETURNING id INTO eventEntityId;

    -- create event
    INSERT INTO events (id, start_date, end_date, maximum_spots) VALUES (eventEntityId, NOW(), NOW() + interval '1 month', 8) RETURNING id INTO eventId;
    INSERT INTO entities_general_infos (entity_id, name) VALUES (eventId, eventName);
    INSERT INTO entities_role (entity_id, role, entity_id_admin) VALUES (eventId, 1, organizationEntityId);

    -- create payment option
    INSERT INTO event_payment_options (team_stripe_price_id, event_id, name, team_price, start_time, end_time, individual_price, individual_stripe_price_id) VALUES (null, eventId, 'Base', 0, NOW(), NOW() + interval '1 year', 0, null) RETURNING id INTO paymentOptionId; 

    -- create timeslots
    INSERT INTO event_time_slots (event_id, date, end_time) VALUES (eventId, '2021-12-11 08:00:00', null) RETURNING id INTO slot1;
    INSERT INTO event_time_slots (event_id, date, end_time) VALUES (eventId, '2021-12-11 09:00:00', null) RETURNING id INTO slot2;
    INSERT INTO event_time_slots (event_id, date, end_time) VALUES (eventId, '2021-12-11 10:00:00', null) RETURNING id INTO slot3;
    INSERT INTO event_time_slots (event_id, date, end_time) VALUES (eventId, '2021-12-11 11:00:00', null) RETURNING id INTO slot4;
    INSERT INTO event_time_slots (event_id, date, end_time) VALUES (eventId, '2021-12-11 12:00:00', null) RETURNING id INTO slot5;
    INSERT INTO event_time_slots (event_id, date, end_time) VALUES (eventId, '2021-12-11 13:00:00', null) RETURNING id INTO slot6;
    INSERT INTO event_time_slots (event_id, date, end_time) VALUES (eventId, '2021-12-11 14:00:00', null) RETURNING id INTO slot7;
    INSERT INTO event_time_slots (event_id, date, end_time) VALUES (eventId, '2021-12-11 15:00:00', null) RETURNING id INTO slot8;
    INSERT INTO event_time_slots (event_id, date, end_time) VALUES (eventId, '2021-12-11 16:00:00', null) RETURNING id INTO slot9;
    INSERT INTO event_time_slots (event_id, date, end_time) VALUES (eventId, '2021-12-11 17:00:00', null) RETURNING id INTO slot10;
    INSERT INTO event_time_slots (event_id, date, end_time) VALUES (eventId, '2021-12-11 18:00:00', null) RETURNING id INTO slot11;
    INSERT INTO event_time_slots (event_id, date, end_time) VALUES (eventId, '2021-12-11 18:00:00', null) RETURNING id INTO slot12;

    -- create fields
    INSERT INTO event_fields (event_id, field) VALUES (eventId, 'Terrain 1') RETURNING id INTO field1;
    INSERT INTO event_fields (event_id, field) VALUES (eventId, 'Terrain 2') RETURNING id INTO field2;
    INSERT INTO event_fields (event_id, field) VALUES (eventId, 'Terrain 3') RETURNING id INTO field3;
    INSERT INTO event_fields (event_id, field) VALUES (eventId, 'Terrain 4') RETURNING id INTO field4;

    -- add prerank
    INSERT INTO phase (name, event_id, spots, phase_order, status) VALUES ('prerank', eventId, 8, 0, 'not_started') RETURNING id INTO prerankPhaseId;

    -- create phase
    INSERT INTO phase (name, event_id, spots, phase_order, status) VALUES ('Pool A', eventId, 4, 1, 'not_started') RETURNING id INTO poolAPhaseId;
    INSERT INTO phase (name, event_id, spots, phase_order, status) VALUES ('Pool B', eventId, 4, 2, 'not_started') RETURNING id INTO poolBPhaseId;

    -- create teams
    INSERT INTO entities (type) VALUES (3) RETURNING id INTO teamEntityId1;
    INSERT INTO entities_general_infos (entity_id, name) VALUES (teamEntityId1, 'Team Alpha');
    INSERT INTO entities_role (entity_id, role, entity_id_admin) VALUES (teamEntityId1, 1, didierEntityId);

    INSERT INTO entities (type) VALUES (3) RETURNING id INTO teamEntityId2;
    INSERT INTO entities_general_infos (entity_id, name) VALUES (teamEntityId2, 'Team Beta');
    INSERT INTO entities_role (entity_id, role, entity_id_admin) VALUES (teamEntityId2, 1, didierEntityId);

    INSERT INTO entities (type) VALUES (3) RETURNING id INTO teamEntityId3;
    INSERT INTO entities_general_infos (entity_id, name) VALUES (teamEntityId3, 'Team Charlie');
    INSERT INTO entities_role (entity_id, role, entity_id_admin) VALUES (teamEntityId3, 1, didierEntityId);

    INSERT INTO entities (type) VALUES (3) RETURNING id INTO teamEntityId4;
    INSERT INTO entities_general_infos (entity_id, name) VALUES (teamEntityId4, 'Team Delta');
    INSERT INTO entities_role (entity_id, role, entity_id_admin) VALUES (teamEntityId4, 1, didierEntityId);

    INSERT INTO entities (type) VALUES (3) RETURNING id INTO teamEntityId5;
    INSERT INTO entities_general_infos (entity_id, name) VALUES (teamEntityId5, 'Team Echo');
    INSERT INTO entities_role (entity_id, role, entity_id_admin) VALUES (teamEntityId5, 1, didierEntityId);

    INSERT INTO entities (type) VALUES (3) RETURNING id INTO teamEntityId6;
    INSERT INTO entities_general_infos (entity_id, name) VALUES (teamEntityId6, 'Team Foxtrot');
    INSERT INTO entities_role (entity_id, role, entity_id_admin) VALUES (teamEntityId6, 1, didierEntityId);

    INSERT INTO entities (type) VALUES (3) RETURNING id INTO teamEntityId7;
    INSERT INTO entities_general_infos (entity_id, name) VALUES (teamEntityId7, 'Team Golf');
    INSERT INTO entities_role (entity_id, role, entity_id_admin) VALUES (teamEntityId7, 1, didierEntityId);

    INSERT INTO entities (type) VALUES (3) RETURNING id INTO teamEntityId8;
    INSERT INTO entities_general_infos (entity_id, name) VALUES (teamEntityId8, 'Team Hotel');
    INSERT INTO entities_role (entity_id, role, entity_id_admin) VALUES (teamEntityId8, 1, didierEntityId);

    -- create rosters
    INSERT INTO team_rosters (team_id) VALUES (teamEntityId1) RETURNING id INTO teamId1;
    INSERT INTO team_rosters (team_id) VALUES (teamEntityId2) RETURNING id INTO teamId2;
    INSERT INTO team_rosters (team_id) VALUES (teamEntityId3) RETURNING id INTO teamId3;
    INSERT INTO team_rosters (team_id) VALUES (teamEntityId4) RETURNING id INTO teamId4;
    INSERT INTO team_rosters (team_id) VALUES (teamEntityId5) RETURNING id INTO teamId5;
    INSERT INTO team_rosters (team_id) VALUES (teamEntityId6) RETURNING id INTO teamId6;
    INSERT INTO team_rosters (team_id) VALUES (teamEntityId7) RETURNING id INTO teamId7;
    INSERT INTO team_rosters (team_id) VALUES (teamEntityId8) RETURNING id INTO teamId8;

    -- add captain
    INSERT INTO team_players (team_id,person_id,role) VALUES (teamEntityId1,didierEntityId,'captain'); 
    INSERT INTO team_players (team_id,person_id,role) VALUES (teamEntityId2,didierEntityId,'captain'); 
    INSERT INTO team_players (team_id,person_id,role) VALUES (teamEntityId3,didierEntityId,'captain'); 
    INSERT INTO team_players (team_id,person_id,role) VALUES (teamEntityId4,didierEntityId,'captain'); 
    INSERT INTO team_players (team_id,person_id,role) VALUES (teamEntityId5,didierEntityId,'captain'); 
    INSERT INTO team_players (team_id,person_id,role) VALUES (teamEntityId6,didierEntityId,'captain'); 
    INSERT INTO team_players (team_id,person_id,role) VALUES (teamEntityId7,didierEntityId,'captain'); 
    INSERT INTO team_players (team_id,person_id,role) VALUES (teamEntityId8,didierEntityId,'captain'); 

    -- add captain
    INSERT INTO roster_players (roster_id,person_id,role) VALUES (teamId1,didierEntityId,'captain'); 
    INSERT INTO roster_players (roster_id,person_id,role) VALUES (teamId2,didierEntityId,'captain'); 
    INSERT INTO roster_players (roster_id,person_id,role) VALUES (teamId3,didierEntityId,'captain'); 
    INSERT INTO roster_players (roster_id,person_id,role) VALUES (teamId4,didierEntityId,'captain'); 
    INSERT INTO roster_players (roster_id,person_id,role) VALUES (teamId5,didierEntityId,'captain'); 
    INSERT INTO roster_players (roster_id,person_id,role) VALUES (teamId6,didierEntityId,'captain'); 
    INSERT INTO roster_players (roster_id,person_id,role) VALUES (teamId7,didierEntityId,'captain'); 
    INSERT INTO roster_players (roster_id,person_id,role) VALUES (teamId8,didierEntityId,'captain'); 

    -- add rosters to event
    INSERT INTO event_rosters (roster_id, event_id, team_id, status, registration_status, invoice_item_id, payment_option_id) VALUES (teamId1, eventId, teamEntityId1, 'free', 'accepted free', null, paymentOptionId);
    INSERT INTO event_rosters (roster_id, event_id, team_id, status, registration_status, invoice_item_id, payment_option_id) VALUES (teamId2, eventId, teamEntityId2, 'free', 'accepted free', null, paymentOptionId);
    INSERT INTO event_rosters (roster_id, event_id, team_id, status, registration_status, invoice_item_id, payment_option_id) VALUES (teamId3, eventId, teamEntityId3, 'free', 'accepted free', null, paymentOptionId);
    INSERT INTO event_rosters (roster_id, event_id, team_id, status, registration_status, invoice_item_id, payment_option_id) VALUES (teamId4, eventId, teamEntityId4, 'free', 'accepted free', null, paymentOptionId);
    INSERT INTO event_rosters (roster_id, event_id, team_id, status, registration_status, invoice_item_id, payment_option_id) VALUES (teamId5, eventId, teamEntityId5, 'free', 'accepted free', null, paymentOptionId);
    INSERT INTO event_rosters (roster_id, event_id, team_id, status, registration_status, invoice_item_id, payment_option_id) VALUES (teamId6, eventId, teamEntityId6, 'free', 'accepted free', null, paymentOptionId);
    INSERT INTO event_rosters (roster_id, event_id, team_id, status, registration_status, invoice_item_id, payment_option_id) VALUES (teamId7, eventId, teamEntityId7, 'free', 'accepted free', null, paymentOptionId);
    INSERT INTO event_rosters (roster_id, event_id, team_id, status, registration_status, invoice_item_id, payment_option_id) VALUES (teamId8, eventId, teamEntityId8, 'free', 'accepted free', null, paymentOptionId);


    -- add rosters to prerank phase
    INSERT INTO phase_rankings (roster_id, origin_phase, origin_position, current_phase, initial_position, final_position) VALUES (teamId1, null, null, prerankPhaseId, 1, null);
    INSERT INTO phase_rankings (roster_id, origin_phase, origin_position, current_phase, initial_position, final_position) VALUES (teamId2, null, null, prerankPhaseId, 2, null);
    INSERT INTO phase_rankings (roster_id, origin_phase, origin_position, current_phase, initial_position, final_position) VALUES (teamId3, null, null, prerankPhaseId, 3, null);
    INSERT INTO phase_rankings (roster_id, origin_phase, origin_position, current_phase, initial_position, final_position) VALUES (teamId4, null, null, prerankPhaseId, 4, null);
    INSERT INTO phase_rankings (roster_id, origin_phase, origin_position, current_phase, initial_position, final_position) VALUES (teamId5, null, null, prerankPhaseId, 5, null);
    INSERT INTO phase_rankings (roster_id, origin_phase, origin_position, current_phase, initial_position, final_position) VALUES (teamId6, null, null, prerankPhaseId, 6, null);
    INSERT INTO phase_rankings (roster_id, origin_phase, origin_position, current_phase, initial_position, final_position) VALUES (teamId7, null, null, prerankPhaseId, 7, null);
    INSERT INTO phase_rankings (roster_id, origin_phase, origin_position, current_phase, initial_position, final_position) VALUES (teamId8, null, null, prerankPhaseId, 8, null);

    -- add rosters to pool A phase
    INSERT INTO phase_rankings (roster_id, origin_phase, origin_position, current_phase, initial_position, final_position) VALUES (teamId1, prerankPhaseId, 1, poolAPhaseId, 1, null) RETURNING ranking_id INTO poolRankingId1;
    INSERT INTO phase_rankings (roster_id, origin_phase, origin_position, current_phase, initial_position, final_position) VALUES (teamId4, prerankPhaseId, 4, poolAPhaseId, 2, null) RETURNING ranking_id INTO poolRankingId4;
    INSERT INTO phase_rankings (roster_id, origin_phase, origin_position, current_phase, initial_position, final_position) VALUES (teamId5, prerankPhaseId, 5, poolAPhaseId, 3, null) RETURNING ranking_id INTO poolRankingId5;
    INSERT INTO phase_rankings (roster_id, origin_phase, origin_position, current_phase, initial_position, final_position) VALUES (teamId8, prerankPhaseId, 8, poolAPhaseId, 4, null) RETURNING ranking_id INTO poolRankingId8;

    --add rosters to pool B phase
    INSERT INTO phase_rankings (roster_id, origin_phase, origin_position, current_phase, initial_position, final_position) VALUES (teamId2, prerankPhaseId, 2, poolBPhaseId, 1, null) RETURNING ranking_id INTO poolRankingId2;
    INSERT INTO phase_rankings (roster_id, origin_phase, origin_position, current_phase, initial_position, final_position) VALUES (teamId3, prerankPhaseId, 3, poolBPhaseId, 2, null) RETURNING ranking_id INTO poolRankingId3;
    INSERT INTO phase_rankings (roster_id, origin_phase, origin_position, current_phase, initial_position, final_position) VALUES (teamId6, prerankPhaseId, 6, poolBPhaseId, 3, null) RETURNING ranking_id INTO poolRankingId6;
    INSERT INTO phase_rankings (roster_id, origin_phase, origin_position, current_phase, initial_position, final_position) VALUES (teamId7, prerankPhaseId, 7, poolBPhaseId, 4, null) RETURNING ranking_id INTO poolRankingId7;

    --create games entities
    INSERT INTO entities (type) VALUES (5) RETURNING id INTO gameId1;
    INSERT INTO entities (type) VALUES (5) RETURNING id INTO gameId2;
    INSERT INTO entities (type) VALUES (5) RETURNING id INTO gameId3;
    INSERT INTO entities (type) VALUES (5) RETURNING id INTO gameId4;
    INSERT INTO entities (type) VALUES (5) RETURNING id INTO gameId5;
    INSERT INTO entities (type) VALUES (5) RETURNING id INTO gameId6;
    INSERT INTO entities (type) VALUES (5) RETURNING id INTO gameId7;
    INSERT INTO entities (type) VALUES (5) RETURNING id INTO gameId8;
    INSERT INTO entities (type) VALUES (5) RETURNING id INTO gameId9;
    INSERT INTO entities (type) VALUES (5) RETURNING id INTO gameId10;
    INSERT INTO entities (type) VALUES (5) RETURNING id INTO gameId11;
    INSERT INTO entities (type) VALUES (5) RETURNING id INTO gameId12;

    -- create games pool A
    INSERT INTO games (phase_id, location_id, event_id, timeslot_id, field_id, id) VALUES (poolAPhaseId, null, eventId, slot1, field1, gameId1);
    INSERT INTO games (phase_id, location_id, event_id, timeslot_id, field_id, id) VALUES (poolAPhaseId, null, eventId, slot2, field2, gameId2);
    INSERT INTO games (phase_id, location_id, event_id, timeslot_id, field_id, id) VALUES (poolAPhaseId, null, eventId, slot3, field3, gameId3);
    INSERT INTO games (phase_id, location_id, event_id, timeslot_id, field_id, id) VALUES (poolAPhaseId, null, eventId, slot4, field4, gameId4);
    INSERT INTO games (phase_id, location_id, event_id, timeslot_id, field_id, id) VALUES (poolAPhaseId, null, eventId, slot5, field2, gameId5);
    INSERT INTO games (phase_id, location_id, event_id, timeslot_id, field_id, id) VALUES (poolAPhaseId, null, eventId, slot6, field3, gameId6);

    INSERT INTO games (phase_id, location_id, event_id, timeslot_id, field_id, id) VALUES (poolBPhaseId, null, eventId, slot7, field1, gameId7);
    INSERT INTO games (phase_id, location_id, event_id, timeslot_id, field_id, id) VALUES (poolBPhaseId, null, eventId, slot8, field2, gameId8);
    INSERT INTO games (phase_id, location_id, event_id, timeslot_id, field_id, id) VALUES (poolBPhaseId, null, eventId, slot9, field3, gameId9);
    INSERT INTO games (phase_id, location_id, event_id, timeslot_id, field_id, id) VALUES (poolBPhaseId, null, eventId, slot10, field4, gameId10);
    INSERT INTO games (phase_id, location_id, event_id, timeslot_id, field_id, id) VALUES (poolBPhaseId, null, eventId, slot11, field2, gameId11);
    INSERT INTO games (phase_id, location_id, event_id, timeslot_id, field_id, id) VALUES (poolBPhaseId, null, eventId, slot12, field3, gameId12);

    -- game teams pool A
    INSERT INTO game_teams (game_id, roster_id, score, position, name, spirit, ranking_id) VALUES (gameId1, teamId1, 0, null, 'Team Alpha', null, poolRankingId1);
    INSERT INTO game_teams (game_id, roster_id, score, position, name, spirit, ranking_id) VALUES (gameId1, teamId8, 0, null, 'Team Hotel', null, poolRankingId8);

    INSERT INTO game_teams (game_id, roster_id, score, position, name, spirit, ranking_id) VALUES (gameId2, teamId4, 0, null, 'Team Delta', null, poolRankingId4);
    INSERT INTO game_teams (game_id, roster_id, score, position, name, spirit, ranking_id) VALUES (gameId2, teamId5, 0, null, 'Team Echo', null, poolRankingId5);

    INSERT INTO game_teams (game_id, roster_id, score, position, name, spirit, ranking_id) VALUES (gameId3, teamId1, 0, null, 'Team Alpha', null, poolRankingId1);
    INSERT INTO game_teams (game_id, roster_id, score, position, name, spirit, ranking_id) VALUES (gameId3, teamId4, 0, null, 'Team Delta', null, poolRankingId4);

    INSERT INTO game_teams (game_id, roster_id, score, position, name, spirit, ranking_id) VALUES (gameId4, teamId5, 0, null, 'Team Echo', null, poolRankingId5);
    INSERT INTO game_teams (game_id, roster_id, score, position, name, spirit, ranking_id) VALUES (gameId4, teamId8, 0, null, 'Team Hotel', null, poolRankingId8);

    INSERT INTO game_teams (game_id, roster_id, score, position, name, spirit, ranking_id) VALUES (gameId5, teamId1, 0, null, 'Team Alpha', null, poolRankingId1);
    INSERT INTO game_teams (game_id, roster_id, score, position, name, spirit, ranking_id) VALUES (gameId5, teamId5, 0, null, 'Team Echo', null, poolRankingId5);

    INSERT INTO game_teams (game_id, roster_id, score, position, name, spirit, ranking_id) VALUES (gameId6, teamId4, 0, null, 'Team Delta', null, poolRankingId4);
    INSERT INTO game_teams (game_id, roster_id, score, position, name, spirit, ranking_id) VALUES (gameId6, teamId8, 0, null, 'Team Hotel', null, poolRankingId8);

    -- game teams pool B
    INSERT INTO game_teams (game_id, roster_id, score, position, name, spirit, ranking_id) VALUES (gameId7, teamId2, 0, null, 'Team Beta', null, poolRankingId2);
    INSERT INTO game_teams (game_id, roster_id, score, position, name, spirit, ranking_id) VALUES (gameId7, teamId7, 0, null, 'Team Golf', null, poolRankingId7);

    INSERT INTO game_teams (game_id, roster_id, score, position, name, spirit, ranking_id) VALUES (gameId8, teamId3, 0, null, 'Team Charlie', null, poolRankingId3);
    INSERT INTO game_teams (game_id, roster_id, score, position, name, spirit, ranking_id) VALUES (gameId8, teamId6, 0, null, 'Team Foxtrot', null, poolRankingId6);

    INSERT INTO game_teams (game_id, roster_id, score, position, name, spirit, ranking_id) VALUES (gameId9, teamId2, 0, null, 'Team Beta', null, poolRankingId2);
    INSERT INTO game_teams (game_id, roster_id, score, position, name, spirit, ranking_id) VALUES (gameId9, teamId3, 0, null, 'Team Charlie', null, poolRankingId3);

    INSERT INTO game_teams (game_id, roster_id, score, position, name, spirit, ranking_id) VALUES (gameId10, teamId6, 0, null, 'Team Foxtrot', null, poolRankingId6);
    INSERT INTO game_teams (game_id, roster_id, score, position, name, spirit, ranking_id) VALUES (gameId10, teamId7, 0, null, 'Team Golf', null, poolRankingId7);

    INSERT INTO game_teams (game_id, roster_id, score, position, name, spirit, ranking_id) VALUES (gameId11, teamId2, 0, null, 'Team Beta', null, poolRankingId2);
    INSERT INTO game_teams (game_id, roster_id, score, position, name, spirit, ranking_id) VALUES (gameId11, teamId6, 0, null, 'Team Foxtrot', null, poolRankingId6);

    INSERT INTO game_teams (game_id, roster_id, score, position, name, spirit, ranking_id) VALUES (gameId12, teamId3, 0, null, 'Team Charlie', null, poolRankingId3);
    INSERT INTO game_teams (game_id, roster_id, score, position, name, spirit, ranking_id) VALUES (gameId12, teamId7, 0, null, 'Team Golf', null, poolRankingId7);

    RETURN eventId;
END;
$BODY$
 LANGUAGE plpgsql VOLATILE;