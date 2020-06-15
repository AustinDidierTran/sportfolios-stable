ALTER TABLE entities_role
  ADD COLUMN user_id UUID REFERENCES users(id);

UPDATE entities_role
  SET user_id = entity_id_admin;
  
ALTER TABLE entities_role
  ALTER COLUMN user_id SET NOT NULL,
  DROP COLUMN entity_id_admin;