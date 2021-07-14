/* Replace with your SQL commands */
ALTER TABLE games
  ADD COLUMN entity_id UUID REFERENCES entities(id);

UPDATE games SET entity_id = id;