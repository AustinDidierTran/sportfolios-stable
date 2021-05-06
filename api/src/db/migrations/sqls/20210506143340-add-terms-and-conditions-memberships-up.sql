/* Replace with your SQL commands */
ALTER TABLE entity_memberships
  ADD COLUMN description TEXT,
  ADD COLUMN file_name VARCHAR(255),
  ADD COLUMN file_url VARCHAR(255);