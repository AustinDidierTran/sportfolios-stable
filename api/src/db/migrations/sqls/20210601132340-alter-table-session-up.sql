ALTER TABLE sessions
ADD COLUMN entity_id UUID REFERENCES entities(id) NOT NULL;
