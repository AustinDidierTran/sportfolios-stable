DROP RULE IF EXISTS delete_option ON event_payment_options;

ALTER TABLE event_payment_options
DROP COLUMN deleted_at;