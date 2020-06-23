CREATE RULE delete_entity AS ON DELETE TO entities
DO INSTEAD
(UPDATE entities SET deleted_at = now() WHERE entities.id = old.id;
)
