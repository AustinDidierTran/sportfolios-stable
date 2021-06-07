/* Replace with your SQL commands */
CREATE TABLE terms_and_conditions
(
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  description TEXT,
  file_name VARCHAR(255),
  file_url VARCHAR(255),
  tmp_id UUID
  );

ALTER TABLE entity_memberships 
  ADD COLUMN terms_and_conditions_id UUID;

INSERT INTO terms_and_conditions (description,file_name,file_url,tmp_id)
(SELECT description,file_name,file_url,id FROM entity_memberships WHERE file_url IS NOT NULL);

ALTER TABLE entity_memberships
  DROP COLUMN description,
  DROP COLUMN file_name,
  DROP COLUMN file_url;

UPDATE entity_memberships
  SET terms_and_conditions_id = terms_and_conditions.id
    FROM terms_and_conditions
      WHERE entity_memberships.id=terms_and_conditions.tmp_id;

ALTER TABLE terms_and_conditions
  DROP COLUMN tmp_id;

ALTER TABLE memberships
  ADD COLUMN terms_and_conditions_id UUID;  