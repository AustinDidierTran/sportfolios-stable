/* Replace with your SQL commands */
DROP VIEW IF EXISTS events_infos;
DROP VIEW IF EXISTS person_all_infos;
DROP VIEW IF EXISTS entities_all_infos;

ALTER TABLE person_infos
  ADD COLUMN birth_date VARCHAR(255),
  ADD COLUMN phone_number VARCHAR(11);

UPDATE person_infos 
  SET birth_date = subquery.birth_date,
   phone_number = subquery.phone_number
    FROM( SELECT birth_date, phone_number, entity_id FROM entities_general_infos) AS subquery
      WHERE subquery.entity_id=person_infos.entity_id;

ALTER TABLE entities_general_infos
  DROP COLUMN birth_date,
  DROP COLUMN phone_number,
  ADD COLUMN infos_supp_id UUID UNIQUE;

ALTER TABLE person_infos
  ADD COLUMN address_id UUID UNIQUE,
  ADD COLUMN id UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL;

ALTER TABLE entities_address
  RENAME TO addresses;

ALTER TABLE addresses
  ADD COLUMN id UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL;

UPDATE entities_general_infos 
  SET infos_supp_id=subquery.id
    FROM( SELECT entity_id, id FROM person_infos) AS subquery
      WHERE subquery.entity_id=entities_general_infos.entity_id;

UPDATE person_infos 
  SET address_id=subquery.id
    FROM( SELECT entity_id, id FROM addresses) AS subquery
      WHERE subquery.entity_id=person_infos.entity_id;


ALTER TABLE memberships
  DROP COLUMN birth_date,
  DROP COLUMN street_address,
  DROP COLUMN city,
  DROP COLUMN state,
  DROP COLUMN zip,
  DROP COLUMN country,
  DROP COLUMN gender,
  DROP COLUMN phone_number,
  DROP COLUMN emergency_name,
  DROP COLUMN emergency_surname,
  DROP COLUMN emergency_phone_number,
  DROP COLUMN medical_conditions,
  ADD COLUMN infos_supp_id UUID REFERENCES person_infos(id);

UPDATE memberships 
  SET infos_supp_id = subquery.id
    FROM( SELECT id, entity_id FROM person_infos) AS subquery
      WHERE subquery.entity_id=memberships.person_id;

ALTER TABLE person_infos
  DROP COLUMN entity_id,
  ADD PRIMARY KEY(id);

ALTER TABLE addresses
  DROP COLUMN entity_id,
  ADD PRIMARY KEY(id);


CREATE OR REPLACE VIEW entities_all_infos AS
  SELECT id, 
  type, 
  name, 
  surname, 
  photo_url, 
  description, 
  quick_description,
  e.created_at,
  deleted_at,
  infos_supp_id
  FROM entities e 
  LEFT JOIN entities_general_infos egi on e.id = egi.entity_id;

CREATE OR REPLACE VIEW person_all_infos as 
  SELECT entities_all_infos.id, name, surname, photo_url, birth_date, gender, CONCAT_WS(', ', street_address, city, state, zip, country) "address", address_id, type, phone_number, emergency_name, emergency_surname, emergency_phone_number, medical_conditions
    FROM entities_all_infos
        LEFT JOIN person_infos ON person_infos.id = entities_all_infos.infos_supp_id
        LEFT JOIN addresses ON addresses.id = person_infos.address_id
    WHERE type = 1;

CREATE OR REPLACE VIEW events_infos AS
  SELECT DISTINCT ON (e.id) 
	  e.id,
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
    e_role.entity_id_admin as creator_id,
	  e_role.created_at as creator

      FROM entities_all_infos e

        LEFT JOIN events ON e.id=events.id
        LEFT JOIN entities_role e_role ON  e_role.entity_id = e.id

          WHERE type=4 and role=1

            ORDER BY e.id, creator ASC;


CREATE OR REPLACE VIEW memberships_infos as 
  SELECT memberships.id,
   organization_id,
   person_id,
   member_type,
   expiration_date,
   memberships.created_at,
   memberships.updated_at,
   status,
   invoice_item_id,
   paid_on,
   membership_id,
   gender,
   CONCAT_WS(', ', street_address, city, state, zip, country) "address",
   birth_date,
   phone_number,
   heard_organization,
   frequented_school,
   job_title,
   employer getting_involved,
   emergency_name,
   emergency_surname,
   emergency_phone_number,
   medical_conditions
    FROM memberships
        LEFT JOIN person_infos ON memberships.infos_supp_id = person_infos.id
        LEFT JOIN addresses ON addresses.id = person_infos.address_id;






