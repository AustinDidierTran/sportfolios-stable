ALTER TABLE evaluations ALTER COLUMN session_id SET NOT NULL;
ALTER TABLE evaluations DROP COLUMN game_id;
