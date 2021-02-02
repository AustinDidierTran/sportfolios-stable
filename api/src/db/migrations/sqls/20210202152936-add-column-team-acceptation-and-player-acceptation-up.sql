/* Replace with your SQL commands */
ALTER TABLE event_payment_options
  ADD COLUMN team_acceptation BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN player_acceptation BOOLEAN NOT NULL DEFAULT FALSE;
