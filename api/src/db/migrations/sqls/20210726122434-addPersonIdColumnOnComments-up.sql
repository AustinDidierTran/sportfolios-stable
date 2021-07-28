ALTER TABLE comments
 ADD COLUMN person_id uuid REFERENCES entities(id), 
 ADD COLUMN exercise_id uuid REFERENCES exercises(id);
 
