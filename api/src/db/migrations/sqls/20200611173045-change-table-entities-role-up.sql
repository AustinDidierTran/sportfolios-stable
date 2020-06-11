/* Replace with your SQL commands */

DELETE FROM entities_role;

ALTER TABLE entities_role
ADD COLUMN entity_id_admin UUID REFERENCES entities(id) NOT NULL,
DROP COLUMN user_id;
