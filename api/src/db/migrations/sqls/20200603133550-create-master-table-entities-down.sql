/* Replace with your SQL commands */

ALTER TABLE teams
DROP CONSTRAINT teams_id_fkey;


ALTER TABLE organizations
DROP CONSTRAINT organizations_id_fkey;


ALTER TABLE persons
DROP CONSTRAINT persons_id_fkey;


DROP TABLE entities;