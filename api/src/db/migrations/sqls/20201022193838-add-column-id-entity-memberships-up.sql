/* Replace with your SQL commands */
ALTER TABLE entity_memberships
  ADD COLUMN id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  ALTER COLUMN length DROP NOT NULL;