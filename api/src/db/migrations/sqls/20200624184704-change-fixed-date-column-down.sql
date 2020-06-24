/* Replace with your SQL commands */
ALTER TABLE entity_memberships
ALTER COLUMN fixed_date TYPE TIMESTAMP USING fixed_date::TIMESTAMP;