ALTER TABLE posts ADD COLUMN location_id uuid REFERENCES entities(id);


DO $$
DECLARE
	post posts;
BEGIN
FOR post IN
		SELECT * FROM posts 
	LOOP
	UPDATE posts set location_id = post.entity_id WHERE id = post.id;
END LOOP;
END;
$$
LANGUAGE plpgsql;