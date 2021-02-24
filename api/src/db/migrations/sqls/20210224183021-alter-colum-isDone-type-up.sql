ALTER TABLE phase 
DROP COLUMN is_done; 

ALTER TABLE phase
ADD COLUMN status VARCHAR(15) DEFAULT 'not_started';