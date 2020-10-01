ALTER TABLE transfered_person ADD COLUMN status varchar(16) DEFAULT 'pending';
ALTER TABLE transfered_person DROP COLUMN transfered_on;
ALTER TABLE transfered_person ADD COLUMN sender_id UUID;
ALTER TABLE transfered_person ADD CONSTRAINT FK_SENDERID FOREIGN KEY (sender_id) references users(id);
