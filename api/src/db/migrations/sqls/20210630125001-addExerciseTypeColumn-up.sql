ALTER TABLE exercises ADD COLUMN type varchar(30);
UPDATE exercises SET type = 'default';
ALTER TABLE exercises ALTER COLUMN type SET NOT NULL;
