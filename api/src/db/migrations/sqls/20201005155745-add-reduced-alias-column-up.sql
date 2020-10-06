ALTER TABLE "alias"
  DROP CONSTRAINT alias_pkey,
  DROP CONSTRAINT unique_alias,
  DROP CONSTRAINT unique_id,
  ADD COLUMN reduced_alias VARCHAR(255) UNIQUE;

UPDATE "alias" SET reduced_alias = LOWER(REPLACE(alias, '.', ''));

ALTER TABLE "alias"
  ADD PRIMARY KEY (id, reduced_alias);

INSERT INTO "ga_toggles_events" ("category", "enabled") VALUES ('Visit', true);