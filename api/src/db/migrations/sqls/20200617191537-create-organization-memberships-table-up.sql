/* Replace with your SQL commands */
CREATE TABLE entity_memberships(
  entity_id UUID REFERENCES entities(id) NOT NULL,
  membership_type INTEGER NOT NULL,
  length INTEGER,
  fixed_date TIMESTAMP,
  price INTEGER,
  PRIMARY KEY(entity_id,membership_type,length,fixed_date)
);
