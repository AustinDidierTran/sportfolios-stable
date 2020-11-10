ALTER TABLE score_suggestion
  ADD COLUMN start_time TIMESTAMP;

ALTER TABLE games
  ADD COLUMN start_time TIMESTAMP,
  ADD COLUMN end_time TIMESTAMP,
  ADD COLUMN field VARCHAR(255);

UPDATE games 
  SET 
    start_time = (SELECT date FROM event_time_slots 
      WHERE id = games.timeslot_id),
    field = (SELECT field FROM event_fields 
      WHERE id = games.field_id);

ALTER TABLE event_time_slots
  DROP COLUMN end_time;

ALTER TABLE games
  DROP CONSTRAINT games_timeslot_id_fkey,
  DROP CONSTRAINT games_field_id_fkey,
  DROP COLUMN timeslot_id,
  DROP COLUMN field_id;