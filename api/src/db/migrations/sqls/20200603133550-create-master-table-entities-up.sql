/* Replace with your SQL commands */
CREATE TABLE entities (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  type INTEGER
);


INSERT INTO entities (id) SELECT id FROM persons;

-- type 1= person
UPDATE entities
SET type=1
WHERE type IS NULL;


INSERT INTO entities (id) SELECT id FROM organizations;

-- type 2= organizations
UPDATE entities
SET type=2
WHERE type IS NULL;


INSERT INTO entities (id) SELECT id FROM teams;

-- type 1= teams
UPDATE entities
SET type=3
WHERE type IS NULL;


ALTER TABLE persons
ADD CONSTRAINT persons_id_fkey FOREIGN KEY (id) REFERENCES entities(id);

ALTER TABLE organizations
ADD CONSTRAINT organizations_id_fkey FOREIGN KEY (id) REFERENCES entities(id);

ALTER TABLE teams
ADD CONSTRAINT teams_id_fkey FOREIGN KEY (id) REFERENCES entities(id);


ALTER TABLE entities
ALTER COLUMN type SET NOT NULL
DROP CONSTRAINT entities_name_pkey;


