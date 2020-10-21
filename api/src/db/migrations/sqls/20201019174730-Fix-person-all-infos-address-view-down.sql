DROP VIEW person_all_infos;
CREATE OR REPLACE VIEW person_all_infos as 
    SELECT id, name, surname, photo_url, birth_date, gender, CONCAT_WS(', ', street_address, city, state, country) "address", type 
    FROM entities_all_infos
        LEFT JOIN entities_gender ON entities_gender.entity_id = id
        LEFT JOIN entities_address ON entities_address.entity_id = id
    WHERE type = 1;
