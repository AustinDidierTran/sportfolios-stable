/* Replace with your SQL commands */
CREATE RULE delete_association AS ON DELETE TO associations
DO INSTEAD
(UPDATE associations SET deleted_at = now() WHERE associations.id = old.id;
-- UPDATE user_to_team SET deleted_at = now() WHERE user_to_team.user_id = old.id;
)
