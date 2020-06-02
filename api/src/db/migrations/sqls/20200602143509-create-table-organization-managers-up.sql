/* Replace with your SQL commands */
CREATE TABLE organization_managers (
  user_id UUID REFERENCES users(id) FOREIGN KEY NOT NULL,
  organization_id UUID REFERENCES organization(id) FOREIGN KEY NOT NULL,
  role INTEGER NOT NULL,
  PRIMARY KEY(user_id, organization_id)
  );