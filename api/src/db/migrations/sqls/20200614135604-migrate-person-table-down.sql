ALTER TABLE organizations
  ADD COLUMN created_at timestamp DEFAULT now(),
  ADD COLUMN deleted_at timestamp;

UPDATE organizations
  SET created_at = subquery.created_at, deleted_at = subquery.deleted_at
  FROM (SELECT * from entities) AS subquery
  WHERE organizations.id = subquery.id;

ALTER TABLE persons
  ADD COLUMN first_name VARCHAR(255),
  ADD COLUMN last_name VARCHAR(255),
  ADD COLUMN birth_date VARCHAR(255),
  ADD COLUMN language VARCHAR(255),
  ADD COLUMN created_at timestamp DEFAULT now(),
  ADD COLUMN deleted_at timestamp;

UPDATE persons
  SET created_at = subquery.created_at, deleted_at = subquery.deleted_at
  FROM (SELECT * from entities) AS subquery
  WHERE persons.id = subquery.id;

ALTER TABLE entities
  DROP COLUMN created_at,
  DROP COLUMN deleted_at;

UPDATE persons
  SET birth_date = subquery.birth_date
  FROM (SELECT *
    FROM entities_birth_date) AS subquery
  WHERE persons.id = subquery.entity_id;

DROP TABLE entities_birth_date;

UPDATE persons
  SET language = subquery.language
  FROM (SELECT users.language, user_entity_role.entity_id
    FROM users
    LEFT JOIN user_entity_role on users.id = user_entity_role.user_id) AS subquery
  WHERE persons.id = subquery.entity_id;

ALTER TABLE users
  DROP COLUMN language;

UPDATE persons
  SET first_name = subquery.name, last_name = subquery.surname
  FROM (SELECT *
  FROM entities_name) AS subquery
  WHERE persons.id = subquery.entity_id;

ALTER TABLE entities_name
  DROP COLUMN surname,
  DROP CONSTRAINT entities_name_pkey;