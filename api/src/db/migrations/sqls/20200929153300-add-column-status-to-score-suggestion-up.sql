/* Replace with your SQL commands */
ALTER TABLE score_suggestion
  ADD COLUMN status VARCHAR(255) NOT NULL DEFAULT 'pending';