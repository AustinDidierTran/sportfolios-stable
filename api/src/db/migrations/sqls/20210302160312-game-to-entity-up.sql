ALTER TABLE games ADD COLUMN entity_id UUID REFERENCES entities(id);

insert into entities (type) select 5 FROM games;

DO $$
DECLARE
	temprow uuid;
	game_id uuid;
BEGIN
FOR temprow IN
		SELECT id FROM entities WHERE type = 5 and deleted_at IS NULL
	LOOP
	SELECT id INTO game_id FROM games WHERE entity_id is null LIMIT 1;

	UPDATE games set entity_id = temprow WHERE id = game_id;
END LOOP;
END;
$$
LANGUAGE plpgsql;

ALTER TABLE games alter column entity_id set NOT NULL;