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