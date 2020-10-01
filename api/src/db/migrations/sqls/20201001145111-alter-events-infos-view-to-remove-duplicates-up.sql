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

CREATE OR REPLACE VIEW events_infos AS
SELECT e.id,
    type,
    name,
    surname,
    photo_url,
    description,
    quick_description,
    maximum_spots,
    start_date,
    end_date,
    e.created_at,
    deleted_at,
    e_role.entity_id_admin as creator_id
FROM entities_all_infos e
    LEFT JOIN events ON e.id=events.id
    LEFT JOIN entities_role e_role ON  e_role.entity_id = e.id
WHERE type=4 and role=1
;