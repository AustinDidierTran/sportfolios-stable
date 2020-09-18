CREATE OR REPLACE VIEW entities_all_infos AS
SELECT id, 
type, 
name, 
surname, 
birth_date,
photo_url, 
description, 
quick_description,
e.created_at,
deleted_at
FROM entities e 
left join entities_name en on e.id = en.entity_id
left join entities_photo ep on e.id = ep.entity_id
left join entities_general_infos egi on e.id = egi.entity_id
left join entities_birth_date ebd on e.id = ebd.entity_id
;
