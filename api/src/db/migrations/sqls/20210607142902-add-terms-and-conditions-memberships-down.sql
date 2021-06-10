/* Replace with your SQL commands */
ALTER TABLE terms_and_conditions
  ADD COLUMN tmp_id UUID;

ALTER TABLE entity_memberships
  ADD COLUMN description TEXT,
  ADD COLUMN file_name VARCHAR(255),
  ADD COLUMN file_url VARCHAR(255);

UPDATE entity_memberships SET 
  description = terms_and_conditions.description,
  file_name=terms_and_conditions.file_name,
  file_url=terms_and_conditions.file_url
    FROM terms_and_conditions
      WHERE entity_memberships.terms_and_conditions_id=terms_and_conditions.id;

ALTER TABLE entity_memberships 
  DROP COLUMN terms_and_conditions_id;

ALTER TABLE memberships
  DROP COLUMN terms_and_conditions_id;

DROP TABLE terms_and_conditions;



