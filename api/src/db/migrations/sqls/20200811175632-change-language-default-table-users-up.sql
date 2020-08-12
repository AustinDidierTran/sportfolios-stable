/* Replace with your SQL commands */
ALTER TABLE users
ALTER language SET DEFAULT 'fr';

UPDATE users
SET language='fr'
WHERE language IS NULL;