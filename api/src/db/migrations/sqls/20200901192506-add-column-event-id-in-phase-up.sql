/* Replace with your SQL commands */
ALTER TABLE phase
  ADD COLUMN event_id UUID REFERENCES events(id);