ALTER TABLE event_fields
  DROP CONSTRAINT event_fields_pkey;
  
ALTER TABLE event_fields
  ADD COLUMN id UUID DEFAULT uuid_generate_v4() PRIMARY KEY;

ALTER TABLE event_time_slots
  DROP CONSTRAINT event_time_slots_pkey;
  
ALTER TABLE event_time_slots
  ADD COLUMN id UUID DEFAULT uuid_generate_v4() PRIMARY KEY;
