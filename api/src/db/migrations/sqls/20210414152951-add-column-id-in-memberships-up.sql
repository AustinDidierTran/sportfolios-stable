/* Replace with your SQL commands */
ALTER TABLE memberships
  ADD COLUMN id UUID DEFAULT uuid_generate_v4() PRIMARY KEY;
