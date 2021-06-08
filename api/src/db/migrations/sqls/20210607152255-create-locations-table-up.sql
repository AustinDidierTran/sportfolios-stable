/* Replace with your SQL commands */
CREATE TABLE locations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  location VARCHAR(255) NOT NULL,
  address_id UUID REFERENCES addresses(id)
);

ALTER TABLE sessions
DROP COLUMN location,
DROP COLUMN address_id;

ALTER TABLE sessions
ADD COLUMN location_id UUID REFERENCES locations(id);