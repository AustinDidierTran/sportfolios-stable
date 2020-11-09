ALTER TABLE event_fields
  DROP CONSTRAINT event_fields_pkey;
  
ALTER TABLE event_fields
  DROP COLUMN id,
  ADD PRIMARY KEY (event_id, field);

ALTER TABLE event_time_slots
  DROP CONSTRAINT event_time_slots_pkey;
  
ALTER TABLE event_time_slots
  DROP COLUMN id,
  ADD PRIMARY KEY (event_id, date);