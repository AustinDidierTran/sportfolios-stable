/* Replace with your SQL commands */
DELETE FROM score_suggestion WHERE score IS NULL;

ALTER TABLE score_suggestion
  ALTER COLUMN score SET NOT NULL;
