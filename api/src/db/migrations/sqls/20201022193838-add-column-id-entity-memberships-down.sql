/* Replace with your SQL commands */

DELETE FROM entity_memberships WHERE length IS NULL;

ALTER TABLE entity_memberships
  ALTER COLUMN length SET NOT NULL,
  DROP COLUMN id;
