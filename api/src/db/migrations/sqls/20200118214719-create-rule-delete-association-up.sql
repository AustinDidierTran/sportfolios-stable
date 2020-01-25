/* Replace with your SQL commands */
CREATE RULE delete_association AS ON DELETE TO associations
DO INSTEAD
(UPDATE associations SET deleted_at = now() WHERE associations.id = old.id;
)
