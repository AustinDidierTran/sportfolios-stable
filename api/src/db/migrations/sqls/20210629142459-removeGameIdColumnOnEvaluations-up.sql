ALTER TABLE evaluations ALTER COLUMN session_id SET NOT NULL;
DELETE FROM evaluations WHERE game_id is not null;
ALTER TABLE evaluations DROP COLUMN game_id;
CREATE TABLE team_exercises(
    team_id uuid REFERENCES entities(id)  NOT NULL,
    exercise_id uuid REFERENCES exercises(id) NOT NULL,
    PRIMARY KEY(team_id, exercise_id)
);