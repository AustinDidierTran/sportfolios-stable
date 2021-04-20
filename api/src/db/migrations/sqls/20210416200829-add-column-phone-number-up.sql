/* Replace with your SQL commands */
ALTER TABLE entities_general_infos
  ADD COLUMN name VARCHAR (255),
  ADD COLUMN surname VARCHAR (255),
  ADD COLUMN photo_url VARCHAR (255),
  ADD COLUMN birth_date VARCHAR(255),
  ADD COLUMN phone_number VARCHAR(11);

INSERT INTO entities_general_infos (entity_id)
  SELECT id FROM entities
    WHERE entities.id NOT IN (SELECT entity_id FROM entities_general_infos);

UPDATE entities_general_infos 
  SET name=subquery.name
    FROM( SELECT entity_id, name FROM entities_name) AS subquery
      WHERE subquery.entity_id=entities_general_infos.entity_id;

UPDATE entities_general_infos 
  SET surname=subquery.surname
    FROM( SELECT entity_id, surname FROM entities_name) AS subquery
      WHERE subquery.entity_id=entities_general_infos.entity_id;

UPDATE entities_general_infos 
  SET photo_url=subquery.photo_url
    FROM( SELECT entity_id, photo_url FROM entities_photo) AS subquery
      WHERE subquery.entity_id=entities_general_infos.entity_id;

UPDATE entities_general_infos 
  SET birth_date=subquery.birth_date
    FROM( SELECT entity_id, birth_date FROM entities_birth_date) AS subquery
      WHERE subquery.entity_id=entities_general_infos.entity_id;

CREATE TABLE person_infos(
  entity_id UUID REFERENCES entities(id) PRIMARY KEY,
  gender VARCHAR(6) CHECK (gender in ('Male', 'Female', 'Other')),
  emergency_name VARCHAR(255),
  emergency_surname VARCHAR(255),
  emergency_phone_number VARCHAR(11),
  medical_conditions TEXT
);

INSERT INTO person_infos (entity_id)
  SELECT id FROM entities
    WHERE type = 1;

UPDATE person_infos 
  SET gender=subquery.gender
    FROM( SELECT entity_id, gender FROM entities_gender) AS subquery
      WHERE subquery.entity_id=person_infos.entity_id;

CREATE OR REPLACE VIEW public.games_all_infos AS
  SELECT events.id AS event_id,
    entities_general_infos.name AS event_name,
    games.id,
    event_time_slots.date AS timeslot,
    event_fields.field,   
    games.notified_end,
    games.notified_start
      FROM events
  LEFT JOIN entities_general_infos ON events.id = entities_general_infos.entity_id
  LEFT JOIN games ON events.id = games.event_id
  LEFT JOIN event_time_slots ON event_time_slots.id = games.timeslot_id
  LEFT JOIN event_fields ON event_fields.id = games.field_id;

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
  deleted_at,
  phone_number
  FROM entities e 
  left join entities_general_infos egi on e.id = egi.entity_id;

CREATE OR REPLACE VIEW notifications_view AS 
  SELECT * 
    FROM (notifications as n LEFT JOIN 
     (SELECT photo_url, entity_id  
       FROM entities_general_infos) as e ON n.entity_photo = e.entity_id);

DROP view person_all_infos;
CREATE OR REPLACE VIEW person_all_infos as 
  SELECT id, name, surname, photo_url, birth_date, gender, CONCAT_WS(', ', street_address, city, state, zip, country) "address", type, phone_number, emergency_name, emergency_surname, emergency_phone_number, medical_conditions
    FROM entities_all_infos
        LEFT JOIN entities_address ON entities_address.entity_id = id
        LEFT JOIN person_infos ON person_infos.entity_id = id
    WHERE type = 1;


DROP TABLE entities_name;

DROP TABLE entities_photo;

DROP TABLE entities_gender;

DROP TABLE entities_birth_date;
