/* Replace with your SQL commands *//* Replace with your SQL commands */
CREATE TABLE organization (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  photo_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT now(),
  deleted_at TIMESTAMP
  );

INSERT INTO organization(id, name, deleted_at) SELECT id, name, deleted_at FROM associations;