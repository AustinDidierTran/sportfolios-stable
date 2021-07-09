DELETE FROM evaluation_comments;
DELETE FROM evaluations;

ALTER TABLE evaluations ADD CONSTRAINT unique_evaluation_by_player_by_coach UNIQUE (person_id, coach_id, exercise_id, session_id);
