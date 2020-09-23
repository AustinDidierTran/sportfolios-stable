/* Replace with your SQL commands */
ALTER TABLE score_suggestion
  ADD COLUMN players JSON,
  ADD COLUMN comments TEXT;