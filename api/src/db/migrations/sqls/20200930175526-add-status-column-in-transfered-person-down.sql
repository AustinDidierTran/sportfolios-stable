ALTER TABLE transfered_person DROP COLUMN status;
ALTER TABLE transfered_person ADD COLUMN transfered_on timestamp;
ALTER TABLE transfered_person DROP COLUMN sender_id;
