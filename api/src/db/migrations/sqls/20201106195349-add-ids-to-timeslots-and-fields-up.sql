ALTER TABLE event_fields
  DROP CONSTRAINT event_fields_pkey;
  
ALTER TABLE event_fields
  ADD COLUMN id UUID DEFAULT uuid_generate_v4() PRIMARY KEY;

ALTER TABLE event_time_slots
  DROP CONSTRAINT event_time_slots_pkey;
  
ALTER TABLE event_time_slots
  ADD COLUMN id UUID DEFAULT uuid_generate_v4() PRIMARY KEY;

ALTER TABLE games
  ADD COLUMN timeslot_id UUID,
  ADD COLUMN field_id UUID,
  ADD FOREIGN KEY (timeslot_id) REFERENCES event_time_slots(id),
  ADD FOREIGN KEY (field_id) REFERENCES event_fields(id);

UPDATE games 
  SET 
    timeslot_id = (SELECT id FROM event_time_slots 
      WHERE event_time_slots.event_id = games.event_id 
      AND event_time_slots.date = games.start_time),
    field_id = (SELECT id FROM event_fields 
      WHERE event_fields.event_id = games.event_id 
      AND event_fields.field = games.field);

ALTER TABLE games
  DROP COLUMN start_time,
  DROP COLUMN end_time,
  DROP field;

ALTER TABLE event_time_slots
  ADD COLUMN end_time TIMESTAMP DEFAULT NULL;

ALTER TABLE score_suggestion
  DROP COLUMN start_time;