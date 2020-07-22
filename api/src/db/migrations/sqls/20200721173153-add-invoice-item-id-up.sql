ALTER TABLE event_rosters
  ADD COLUMN invoice_item_id VARCHAR(255),
  DROP COLUMN invoice_id;