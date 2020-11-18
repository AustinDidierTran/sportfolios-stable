CREATE OR REPLACE VIEW games_all_infos AS
SELECT events.id AS event_id, 
       entities_name.name AS event_name, 
       games.id,
       event_time_slots.date as timeslot, 
       event_fields.field
FROM events 
LEFT JOIN entities_name ON events.id = entities_name.entity_id
LEFT JOIN games ON events.id = games.event_id
LEFT JOIN event_time_slots ON event_time_slots.id = games.timeslot_id
LEFT JOIN event_fields ON event_fields.id = games.field_id