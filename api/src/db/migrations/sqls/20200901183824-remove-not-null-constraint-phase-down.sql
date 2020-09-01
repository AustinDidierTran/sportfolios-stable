/* Replace with your SQL commands */
DELETE FROM phase WHERE division_id IS NULL;

ALTER TABLE phase 
  ALTER COLUMN division_id SET NOT NULL;