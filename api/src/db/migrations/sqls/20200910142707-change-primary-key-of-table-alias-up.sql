/* Replace with your SQL commands */
 DELETE FROM alias;

ALTER TABLE alias
  ADD CONSTRAINT unique_alias UNIQUE (alias),
  ADD CONSTRAINT unique_id UNIQUE (id);