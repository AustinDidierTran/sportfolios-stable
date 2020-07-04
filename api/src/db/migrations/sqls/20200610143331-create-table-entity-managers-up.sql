CREATE TABLE entities_role
(
  entity_id UUID REFERENCES entities(id) NOT NULL,
  user_id UUID REFERENCES users(id) NOT NULL,
  role INTEGER NOT NULL,
  PRIMARY KEY(entity_id,user_id)
);

DROP TABLE team_managers;

DROP TABLE organization_managers;