/* Replace with your SQL commands */
CREATE TABLE persons (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  birth_date VARCHAR(255),
  photo_url VARCHAR(255),
  language VARCHAR(255),
  created_at TIMESTAMP DEFAULT now(),
  deleted_at TIMESTAMP
);

INSERT INTO persons(user_id, first_name, last_name, birth_date, photo_url,language) SELECT user_id, first_name, last_name, birth_date, photo_url, language FROM user_info;

DROP TABLE user_info;

CREATE TABLE teams (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  photo_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT now(),
  deleted_at TIMESTAMP
);

CREATE TABLE team_managers (
  user_id UUID REFERENCES users(id) NOT NULL,
  team_id UUID REFERENCES teams(id) NOT NULL,
  role INTEGER NOT NULL,
  PRIMARY KEY(user_id, team_id)
  );

CREATE TABLE team_rosters (
   id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
   team_id UUID REFERENCES teams(id) NOT NULL,
   created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE team_players (
   roster_id UUID REFERENCES team_rosters(id) NOT NULL,
   person_id UUID REFERENCES persons(id) NOT NULL,
   PRIMARY KEY(roster_id, person_id)
);


CREATE TABLE organizations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  photo_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT now(),
  deleted_at TIMESTAMP
);

INSERT INTO organizations(id, name, deleted_at) SELECT id, name, deleted_at FROM associations;

DROP TABLE user_to_association;
DROP TABLE associations;

CREATE TABLE memberships (
  organization_id UUID REFERENCES organizations(id) NOT NULL,
  person_id UUID REFERENCES persons(id)   NOT NULL,
  member_type INTEGER NOT NULL,
  expiration_date TIMESTAMP NOT NULL,
  PRIMARY KEY(organization_id, person_id, member_type)
);

CREATE TABLE organization_managers (
  user_id UUID REFERENCES users(id) NOT NULL,
  organization_id UUID REFERENCES organizations(id) NOT NULL,
  role INTEGER NOT NULL,
  PRIMARY KEY(user_id, organization_id)
);