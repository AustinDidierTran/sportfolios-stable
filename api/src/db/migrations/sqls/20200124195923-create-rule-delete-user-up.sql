/* Replace with your SQL commands */
CREATE RULE delete_user AS ON DELETE TO users
DO INSTEAD
(UPDATE users SET deleted_at = now() WHERE users.id = old.id;
)
