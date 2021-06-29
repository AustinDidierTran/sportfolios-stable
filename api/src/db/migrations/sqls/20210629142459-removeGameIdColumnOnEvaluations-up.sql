ALTER TABLE evaluations ALTER COLUMN session_id SET NOT NULL;
ALTER TABLE evaluations DROP COLUMN game_id;
DELETE FROM evaluations WHERE game_id is not null;
