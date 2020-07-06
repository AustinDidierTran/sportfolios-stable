/* Replace with your SQL commands */
DELETE FROM event_payment_options;
ALTER TABLE event_payment_options
ALTER COLUMN id TYPE
UUID USING id::UUID;