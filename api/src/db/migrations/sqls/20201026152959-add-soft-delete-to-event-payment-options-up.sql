ALTER TABLE event_payment_options
ADD COLUMN deleted_at timestamp;

CREATE RULE delete_option AS ON DELETE TO event_payment_options
DO INSTEAD
(UPDATE event_payment_options SET deleted_at = now() WHERE event_payment_options.id = old.id;
)
