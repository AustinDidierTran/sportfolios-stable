/* Replace with your SQL commands */
ALTER TABLE posts
	DROP CONSTRAINT posts_location_id_fkey;
	  
ALTER TABLE entities_general_infos
	DROP CONSTRAINT entities_general_infos_entity_id_fkey;
	
ALTER TABLE games
	DROP CONSTRAINT games_entity_id_fkey;

UPDATE entities 
  SET id = games.id
    FROM games
      WHERE games.entity_id = entities.id;

UPDATE entities_general_infos 
  SET entity_id = games.id
    FROM games
      WHERE games.entity_id = entities_general_infos.entity_id;
	  
UPDATE posts 
  SET entity_id = games.id
    FROM games
      WHERE games.entity_id = posts.entity_id;

UPDATE posts 
  SET location_id = games.id
    FROM games
      WHERE games.entity_id = posts.location_id;
	  
ALTER TABLE games
  DROP COLUMN entity_id;

  
ALTER TABLE posts
	ADD CONSTRAINT posts_location_id_fkey
		FOREIGN KEY (location_id) REFERENCES entities(id);
	
ALTER TABLE entities_general_infos
	ADD CONSTRAINT entities_general_infos_entity_id_fkey
		FOREIGN KEY (entity_id) REFERENCES entities(id);
		
ALTER TABLE games
	ADD CONSTRAINT games_entity_id_fkey
		FOREIGN KEY (id) REFERENCES entities(id);