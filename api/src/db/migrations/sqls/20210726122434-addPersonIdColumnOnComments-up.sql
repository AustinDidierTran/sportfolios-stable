ALTER TABLE comments
 ADD COLUMN person_id uuid REFERENCES entities(id);
