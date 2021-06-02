CREATE OR REPLACE VIEW public.games_all_infos AS
  SELECT events.id AS event_id,
    entities_general_infos.name AS event_name,
    games.id,
    event_time_slots.date AS timeslot,
    event_fields.field,   
    games.notified_end,
    games.notified_start,
    phase.id as phase_id
  FROM events
  LEFT JOIN entities_general_infos ON events.id = entities_general_infos.entity_id
  LEFT JOIN games ON events.id = games.event_id
  LEFT JOIN event_time_slots ON event_time_slots.id = games.timeslot_id
  LEFT JOIN event_fields ON event_fields.id = games.field_id
  LEFT JOIN phase ON phase.id = games.phase_id;
