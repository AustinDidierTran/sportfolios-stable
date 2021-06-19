ALTER TABLE evaluations ALTER COLUMN session_id DROP NOT NULL;
ALTER TABLE evaluations
 ADD COLUMN game_id uuid,
 ADD FOREIGN KEY (game_id) REFERENCES games(id);
