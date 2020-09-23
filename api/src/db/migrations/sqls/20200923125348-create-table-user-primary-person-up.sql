CREATE TABLE  user_primary_person AS
  SELECT DISTINCT ON (user_id) user_id, entity_id as primary_person 
  FROM user_entity_role LEFT JOIN entities 
  ON entities.id = user_entity_role.entity_id 
  WHERE type = 1;

ALTER TABLE user_primary_person ADD FOREIGN KEY (user_id) REFERENCES users(id) ;
ALTER TABLE user_primary_person ADD FOREIGN KEY (primary_person) REFERENCES entities(id) ;
ALTER TABLE user_primary_person ADD PRIMARY KEY (user_id);
