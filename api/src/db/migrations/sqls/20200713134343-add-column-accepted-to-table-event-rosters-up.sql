/* Replace with your SQL commands */
ALTER TABLE event_rosters
ADD COLUMN registration_status VARCHAR(255) NOT NULL DEFAULT 'accepted';