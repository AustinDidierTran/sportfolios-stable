/* Replace with your SQL commands */
ALTER TABLE games
  ADD COLUMN event_id UUID REFERENCES entities(id);