/* Replace with your SQL commands */
ALTER TABLE event_rosters
ADD COLUMN team_id  UUID REFERENCES teams(id),
ADD COLUMN invoice_id VARCHAR(255),
ADD COLUMN status VARCHAR(255);