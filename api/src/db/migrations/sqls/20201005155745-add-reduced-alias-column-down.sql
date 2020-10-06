ALTER TABLE "alias"
  DROP CONSTRAINT alias_pkey,
  DROP COLUMN reduced_alias,
  ADD CONSTRAINT unique_alias UNIQUE (alias),
  ADD CONSTRAINT unique_id UNIQUE (id),
  ADD PRIMARY KEY (id, alias);

DELETE FROM "ga_toggles_events" WHERE "category" = 'Visit';