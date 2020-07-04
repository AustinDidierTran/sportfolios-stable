/* Replace with your SQL commands */
ALTER TABLE entity_memberships
DROP COLUMN fixed_date
,
ADD COLUMN fixed_date VARCHAR
(255);