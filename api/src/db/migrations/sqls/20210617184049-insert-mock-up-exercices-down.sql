/* Replace with your SQL commands */
ALTER TABLE sessions ADD COLUMN entity_id UUID REFERENCES entities(id);

ALTER TABLE evaluations
  ADD COLUMN event_id UUID,
  DROP COLUMN session_id;