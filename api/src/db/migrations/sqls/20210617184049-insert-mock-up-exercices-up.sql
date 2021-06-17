/* Replace with your SQL commands */
ALTER TABLE evaluations
  DROP COLUMN event_id,
  ADD COLUMN session_id UUID REFERENCES sessions(id) NOT NULL;

UPDATE sessions SET id = entity_id;

ALTER TABLE sessions DROP COLUMN entity_id;

