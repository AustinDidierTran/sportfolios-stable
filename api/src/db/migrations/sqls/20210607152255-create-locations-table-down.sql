/* Replace with your SQL commands */
ALTER TABLE sessions
DROP COLUMN location_id;

ALTER TABLE sessions
ADD COLUMN location VARCHAR(255);
ADD COLUMN address_id UUID REFERENCES addresses(id)

DROP TABLE locations;