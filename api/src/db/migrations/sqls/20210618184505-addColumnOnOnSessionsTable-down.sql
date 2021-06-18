ALTER TABLE sessions DROP COLUMN sessionType;
ALTER TABLE sessions DROP COLUMN game_id;
ALTER TABLE sessions ALTER COLUMN session_id SET NOT NULL;
