/* Replace with your SQL commands */
CREATE TABLE memberships (
organization_id UUID REFERENCES organization(id) FOREIGN KEY NOT NULL,
person_id UUID REFERENCES person(id) FOREIGN KEY NOT NULL,
member_type INTEGER NOT NULL,
expiration_date TIMESTAMP NOT NULL,
PRIMARY KEY(roster_id,person_id,member_type)
  );