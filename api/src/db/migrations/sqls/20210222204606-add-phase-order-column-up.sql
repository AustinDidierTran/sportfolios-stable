ALTER TABLE phase
ADD COLUMN phase_order integer;

UPDATE phase 
SET phase_order = 1;

ALTER TABLE phase 
ALTER COLUMN phase_order
SET NOT NULL;