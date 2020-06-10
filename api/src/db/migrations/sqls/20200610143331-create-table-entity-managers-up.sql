/* Replace with your SQL commands */
CREATE TABLE entities_role(
  entity_id UUID REFERENCES entities(id) NOT NULL,
  user_id UUID REFERENCES users(id) NOT NULL,
  role INTEGER NOT NULL,
  PRIMARY KEY(entity_id,user_id)
);

INSERT INTO entities_role(entity_id, user_id, role) SELECT organization_id, user_id, role FROM organization_managers;

INSERT INTO entities_role(entity_id, user_id, role) SELECT team_id, user_id, role FROM team_managers;

DROP TABLE team_managers;

DROP TABLE organization_managers;