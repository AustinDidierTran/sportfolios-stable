/* Replace with your SQL commands */
CREATE TABLE entities_general_infos(
  entity_id UUID REFERENCES entities(id) NOT NULL PRIMARY KEY,
  description TEXT
);
