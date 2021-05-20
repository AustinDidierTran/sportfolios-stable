/* Replace with your SQL commands */
CREATE TABLE partners (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  organization_id UUID REFERENCES entities(id) NOT NULL,
  name VARCHAR(255) NOT NULL,
  website VARCHAR(255),
  description TEXT,
  photo_url VARCHAR(255)
);
