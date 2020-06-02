/* Replace with your SQL commands */
CREATE TABLE person (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) FOREIGN KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  birth_date VARCHAR(255) NOT NULL,
  photo_url VARCHAR(255),
  language VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL,
  deleted_at TIMESTAMP,

  );

INSERT INTO person (created_at) VALUES (now);
INSERT INTO person(user_id, first_name, last_name, birth_date, photo_url,language) SELECT id, first_name, last_name, birth_date, photo_url, language FROM user_info;

DROP TABLE user_info;
