/* Replace with your SQL commands */
CREATE TABLE teams (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  photo_url VARCHAR(255),
  creation_date TIMESTAMP NOT NULL,
  deleted_at TIMESTAMP,
);

INSERT INTO teams (creation_date) VALUES (now);
