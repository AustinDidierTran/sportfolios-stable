CREATE RULE user_delete AS ON DELETE TO users
DO INSTEAD
(UPDATE users SET deleted_at = now() WHERE users.id = old.id;
UPDATE user_to_team SET deleted_at = now() WHERE user_to_team.user_id = old.id;)
