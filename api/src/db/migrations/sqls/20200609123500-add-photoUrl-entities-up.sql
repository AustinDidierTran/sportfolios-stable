CREATE TABLE entities_photo(
  entity_id UUID REFERENCES entities(id) NOT NULL,
  photo_url VARCHAR (255)
);

INSERT INTO entities_photo (entity_id, photo_url) 
SELECT id, photo_url FROM organizations;

INSERT INTO entities_photo (entity_id, photo_url) 
SELECT id, photo_url FROM teams;

INSERT INTO entities_photo (entity_id, photo_url) 
SELECT id, photo_url FROM persons;


CREATE TABLE entities_name(
  entity_id UUID REFERENCES entities(id) NOT NULL,
  name VARCHAR (255)
);

INSERT INTO entities_name (entity_id, name) 
SELECT id, name FROM organizations;

INSERT INTO entities_name (entity_id, name) 
SELECT id, name FROM teams;

INSERT INTO entities_name (entity_id, name) 
SELECT id, CONCAT(first_name, ' ', last_name)AS name FROM persons;


ALTER TABLE organizations
DROP COLUMN name,
DROP COLUMN photo_url;

ALTER TABLE teams
DROP COLUMN name,
DROP COLUMN photo_url;

ALTER TABLE persons
DROP COLUMN photo_url;

