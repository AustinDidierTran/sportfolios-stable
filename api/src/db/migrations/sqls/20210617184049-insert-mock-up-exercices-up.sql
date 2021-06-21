/* Replace with your SQL commands */
ALTER TABLE evaluations
  DROP COLUMN event_id,
  ADD COLUMN session_id UUID REFERENCES sessions(id);

UPDATE sessions SET id = entity_id WHERE entity_id IS NOT NULL;

ALTER TABLE sessions DROP COLUMN entity_id;

