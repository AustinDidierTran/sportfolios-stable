/* Replace with your SQL commands */
CREATE TABLE entities_birth_date (
  entity_id UUID REFERENCES entities(id) PRIMARY KEY,
  birth_date VARCHAR(255)
);

INSERT INTO entities_birth_date (entity_id, birth_date) SELECT entity_id, birth_date FROM entities_general_infos;

CREATE TABLE entities_gender (
  entity_id UUID REFERENCES entities(id) PRIMARY KEY,
  gender VARCHAR(6) CHECK (gender in ('Male', 'Female', 'Other'))
);

INSERT INTO entities_gender (entity_id, gender) SELECT entity_id, gender FROM person_infos;


CREATE TABLE entities_photo (
  entity_id UUID REFERENCES entities(id) PRIMARY KEY,
  photo_url VARCHAR(255)
);

INSERT INTO entities_photo (entity_id, photo_url) SELECT entity_id, photo_url FROM entities_general_infos;

CREATE TABLE entities_name (
  entity_id UUID REFERENCES entities(id) PRIMARY KEY,
  name VARCHAR(255),
  surname VARCHAR(255)
);

INSERT INTO entities_name (entity_id, name,surname) SELECT entity_id, name,surname FROM entities_general_infos;


  CREATE OR REPLACE VIEW public.games_all_infos AS
SELECT events.id AS event_id,
       entities_name.name AS event_name,
       games.id,
       event_time_slots.date AS timeslot,
       event_fields.field,
       games.notified_end,
       games.notified_start
FROM events
LEFT JOIN entities_name ON events.id = entities_name.entity_id
LEFT JOIN games ON events.id = games.event_id
LEFT JOIN event_time_slots ON event_time_slots.id = games.timeslot_id
LEFT JOIN event_fields ON event_fields.id = games.field_id;

DROP VIEW IF EXISTS events_infos;
DROP VIEW IF EXISTS person_all_infos;
DROP VIEW IF EXISTS entities_all_infos;

CREATE OR REPLACE VIEW entities_all_infos AS
SELECT id, 
type, 
en.name, 
en.surname, 
ebd.birth_date,
ep.photo_url, 
description, 
quick_description,
e.created_at,
deleted_at
FROM entities e 
left join entities_name en on e.id = en.entity_id
left join entities_photo ep on e.id = ep.entity_id
left join entities_general_infos egi on e.id = egi.entity_id
left join entities_birth_date ebd on e.id = ebd.entity_id;

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

CREATE OR REPLACE VIEW notifications_view AS SELECT * FROM (notifications as n LEFT JOIN (SELECT photo_url, entity_id FROM entities_photo) as e ON n.entity_photo = e.entity_id);

CREATE OR REPLACE VIEW person_all_infos as 
    SELECT id, name, surname, photo_url, birth_date, gender, CONCAT_WS(', ', street_address, city, state, zip, country) "address", type 
    FROM entities_all_infos
        LEFT JOIN entities_gender ON entities_gender.entity_id = id
        LEFT JOIN entities_address ON entities_address.entity_id = id
    WHERE type = 1;


ALTER TABLE entities_general_infos  
  DROP COLUMN name,
  DROP COLUMN surname,
  DROP COLUMN photo_url,
  DROP COLUMN birth_date,
  DROP COLUMN phone_number;

DROP TABLE person_infos;