/* Replace with your SQL commands */
ALTER TABLE event_payment_options
ALTER COLUMN id TYPE
UUID USING id::UUID;