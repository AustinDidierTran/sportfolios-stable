DROP TABLE team_managers;

DROP TABLE team_players;

CREATE TABLE associations
(
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  deleted_at TIMESTAMP
);

CREATE RULE delete_association AS ON
DELETE TO associations
DO INSTEAD
(
UPDATE associations SET deleted_at = now() WHERE associations.id = old.id;
);

CREATE TABLE user_to_association
(
  user_id UUID REFERENCES users(id) NOT NULL,
  association_id UUID REFERENCES associations(id) NOT NULL,
  role INTEGER NOT NULL,
  PRIMARY KEY(user_id, association_id)
);

DROP TABLE memberships;

DROP TABLE organization_managers;

DROP TABLE organizations;

DROP TABLE team_rosters;

DROP TABLE teams;

CREATE TABLE user_info
(
  user_id UUID REFERENCES users(id) NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255),
  birth_date VARCHAR(255),
  photo_url VARCHAR(255),
  language VARCHAR(255)
);

INSERT INTO user_info
  (user_id , first_name, last_name, birth_date, photo_url, language)
SELECT user_id , first_name, last_name, birth_date, photo_url, language
FROM persons;

DROP TABLE persons;

