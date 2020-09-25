ALTER TABLE score_suggestion
  ADD COLUMN created_by UUID DEFAULT null,
ADD CONSTRAINT fk_createByUUID FOREIGN KEY
(created_by) REFERENCES entities
(id);