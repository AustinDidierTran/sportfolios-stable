ALTER TABLE entities_name
  ADD COLUMN surname VARCHAR(255),
  ADD CONSTRAINT entities_name_pkey PRIMARY KEY (entity_id);

DELETE FROM entities_name;

INSERT INTO entities_name(entity_id, name, surname) SELECT id, first_name, last_name FROM persons;

ALTER TABLE users
  ADD COLUMN language VARCHAR(255);

UPDATE users
  SET language = subquery.language
  FROM (SELECT persons.language, user_entity_role.user_id
    FROM persons
    LEFT JOIN user_entity_role on persons.id = user_entity_role.entity_id) AS subquery
  WHERE users.id = subquery.user_id;

CREATE TABLE entities_birth_date (
  entity_id UUID REFERENCES entities(id) PRIMARY KEY,
  birth_date VARCHAR(255)
);

INSERT INTO entities_birth_date (entity_id, birth_date) SELECT id, birth_date FROM PERSONS;

ALTER TABLE entities
  ADD COLUMN created_at timestamp DEFAULT now(),
  ADD COLUMN deleted_at timestamp;

UPDATE entities
  SET created_at = subquery.created_at, deleted_at = subquery.deleted_at
  FROM (SELECT * FROM persons) AS subquery
  WHERE entities.id = subquery.id;

UPDATE entities
  SET created_at = subquery.created_at, deleted_at = subquery.deleted_at
  FROM (SELECT * FROM organizations) AS subquery
  WHERE entities.id = subquery.id;

ALTER TABLE persons
  DROP COLUMN first_name,
  DROP COLUMN last_name,
  DROP COLUMN birth_date,
  DROP COLUMN language,
  DROP COLUMN created_at,
  DROP COLUMN deleted_at;

ALTER TABLE organizations
  DROP COLUMN created_at,
  DROP COLUMN deleted_at;
  

