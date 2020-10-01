/* Replace with your SQL commands */
ALTER TABLE divisions
ALTER name SET DEFAULT 'Main';


INSERT INTO divisions (event_id)
SELECT id
FROM entities
WHERE type=4;
