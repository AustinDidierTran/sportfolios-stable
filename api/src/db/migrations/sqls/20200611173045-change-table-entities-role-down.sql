DELETE FROM entities_role;

ALTER TABLE entities_role
  ADD COLUMN user_id UUID REFERENCES users
(id) NOT NULL,
DROP COLUMN entity_id_admin;