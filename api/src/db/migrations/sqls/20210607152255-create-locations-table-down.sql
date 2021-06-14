/* Replace with your SQL commands */
ALTER TABLE sessions
DROP COLUMN location_id;

DELETE FROM sessions WHERE name IS NULL;

ALTER TABLE sessions
ADD COLUMN location VARCHAR(255),
ADD COLUMN address_id UUID REFERENCES addresses(id),
ALTER COLUMN name SET NOT NULL;

DROP TABLE locations;