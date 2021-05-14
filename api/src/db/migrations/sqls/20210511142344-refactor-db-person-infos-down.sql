/* Replace with your SQL commands */
DROP VIEW IF EXISTS events_infos;
DROP VIEW IF EXISTS person_all_infos;
DROP VIEW IF EXISTS entities_all_infos;
DROP VIEW IF EXISTS memberships_infos;

ALTER TABLE person_infos
  ADD COLUMN entity_id UUID REFERENCES entities(id);

UPDATE person_infos 
  SET entity_id=subquery.entity_id
    FROM( SELECT entity_id, infos_supp_id FROM entities_general_infos) AS subquery
      WHERE subquery.infos_supp_id=person_infos.id;

ALTER TABLE addresses 
  ADD COLUMN entity_id UUID REFERENCES entities(id);

UPDATE addresses 
  SET entity_id=subquery.entity_id
    FROM( SELECT entity_id, address_id FROM person_infos) AS subquery
      WHERE subquery.address_id=addresses.id;

ALTER TABLE memberships
  ADD COLUMN birth_date VARCHAR(255),
  ADD COLUMN street_address VARCHAR(255), 
  ADD COLUMN city VARCHAR(255),
  ADD COLUMN state  VARCHAR(255),
  ADD COLUMN zip VARCHAR(255),
  ADD COLUMN country VARCHAR(255),
  ADD COLUMN gender VARCHAR(6) CHECK (gender in ('Male', 'Female', 'Other')),
  ADD COLUMN phone_number VARCHAR(11),
  ADD COLUMN emergency_name VARCHAR(255),
  ADD COLUMN emergency_surname VARCHAR(255),
  ADD COLUMN emergency_phone_number VARCHAR(11),
  ADD COLUMN medical_conditions TEXT;

UPDATE memberships 
  SET birth_date = subquery.birth_date,
    street_address = subquery.street_address,
    city = subquery.city,
    state = subquery.state,
    zip = subquery.zip,
    country = subquery.country,
    gender = subquery.gender,
    phone_number = subquery.phone_number,
    emergency_name = subquery.emergency_name,
    emergency_surname = subquery.emergency_surname,
    emergency_phone_number = subquery.emergency_phone_number,
    medical_conditions = subquery.medical_conditions
      FROM( SELECT person_infos.id,
        birth_date,
        street_address,
        city,
        state,
        zip,
        country,
        gender,
        phone_number,
        emergency_name,
        emergency_surname,
        emergency_phone_number,
        medical_conditions FROM person_infos
          LEFT JOIN addresses ON addresses.id = person_infos.address_id ) AS subquery
          WHERE subquery.id=memberships.infos_supp_id;

          
ALTER TABLE memberships
  DROP COLUMN infos_supp_id;

ALTER TABLE entities_general_infos
  DROP COLUMN infos_supp_id; 

DELETE FROM person_infos WHERE entity_id IS NULL;

ALTER TABLE person_infos
  DROP COLUMN id,
  DROP COLUMN address_id,
  ADD PRIMARY KEY(entity_id);

DELETE FROM addresses WHERE entity_id IS NULL;

ALTER TABLE addresses
  DROP COLUMN id,
  ADD PRIMARY KEY(entity_id);

ALTER TABLE addresses
  RENAME TO entities_address;

ALTER TABLE entities_general_infos
  ADD COLUMN birth_date VARCHAR(255),
  ADD COLUMN phone_number VARCHAR(11);

UPDATE entities_general_infos 
  SET birth_date=subquery.birth_date, phone_number=subquery.phone_number
    FROM( SELECT birth_date, phone_number, entity_id FROM person_infos) AS subquery
      WHERE subquery.entity_id=entities_general_infos.entity_id;

ALTER TABLE person_infos
  DROP COLUMN birth_date,
  DROP COLUMN phone_number;

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
  birth_date,
  phone_number
  FROM entities e 
  left join entities_general_infos egi on e.id = egi.entity_id;


CREATE OR REPLACE VIEW person_all_infos as 
  SELECT entities_all_infos.id, name, surname, photo_url, birth_date, gender, CONCAT_WS(', ', street_address, city, state, zip, country) "address", type, phone_number, emergency_name, emergency_surname, emergency_phone_number, medical_conditions
    FROM entities_all_infos
        LEFT JOIN entities_address ON entities_address.entity_id = entities_all_infos.id
        LEFT JOIN person_infos ON person_infos.entity_id = entities_all_infos.id
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

