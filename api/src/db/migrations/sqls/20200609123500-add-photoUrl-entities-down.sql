ALTER TABLE persons 
ADD COLUMN photo_url VARCHAR(255);

UPDATE persons 
SET photo_url=subquery.photo_url
FROM( SELECT entity_id, photo_url FROM entities_photo) AS subquery
WHERE subquery.entity_id=id;


ALTER TABLE teams 
ADD COLUMN name VARCHAR(255),
ADD COLUMN photo_url VARCHAR(255);

UPDATE teams 
SET photo_url=subquery.photo_url
FROM( SELECT entity_id, photo_url FROM entities_photo) AS subquery
WHERE subquery.entity_id=id;

UPDATE teams 
SET name=subquery.name
FROM( SELECT entity_id, name FROM entities_name) AS subquery
WHERE subquery.entity_id=id;


ALTER TABLE organizations 
ADD COLUMN name VARCHAR(255),
ADD COLUMN photo_url VARCHAR(255);

UPDATE organizations 
SET photo_url=subquery.photo_url
FROM( SELECT entity_id, photo_url FROM entities_photo) AS subquery
WHERE subquery.entity_id=id;

UPDATE organizations 
SET name=subquery.name
FROM( SELECT entity_id, name FROM entities_name) AS subquery
WHERE subquery.entity_id=id;

DROP TABLE entities_photo;

DROP TABLE entities_name;

