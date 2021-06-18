ALTER TABLE sessions ADD COLUMN sessionType INTEGER;
ALTER TABLE sessions
 ADD COLUMN game_id uuid,
 ADD FOREIGN KEY (game_id) REFERENCES games(id);
ALTER TABLE evaluations ALTER COLUMN session_id DROP NOT NULL;
