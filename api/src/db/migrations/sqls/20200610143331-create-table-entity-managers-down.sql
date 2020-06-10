/* Replace with your SQL commands */
CREATE TABLE organization_managers(
  organization_id UUID REFERENCES organizations(id) NOT NULL,
  user_id UUID REFERENCES users(id) NOT NULL,
  role INTEGER NOT NULL,
  PRIMARY KEY(organization_id, user_id)
);

INSERT INTO organization_managers (organization_id, user_id, role) 
SELECT entity_id, id, role 
FROM (SELECT entity_id, id, role FROM entities_role NATURAL JOIN organizations) AS subquery;

CREATE TABLE team_managers(
  team_id UUID REFERENCES teams(id) NOT NULL,
  user_id UUID REFERENCES users(id) NOT NULL,
  role INTEGER NOT NULL,
  PRIMARY KEY(team_id, user_id)
);

INSERT INTO team_managers (team_id, user_id, role) 
SELECT entity_id, id, role 
FROM (SELECT entity_id, id, role FROM entities_role NATURAL JOIN teams) AS subquery;

DROP TABLE entities_role;
