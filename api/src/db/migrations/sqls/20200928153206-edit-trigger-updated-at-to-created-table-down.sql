CREATE OR REPLACE FUNCTION on_create_table_func()
RETURNS event_trigger AS $$
DECLARE r RECORD;
BEGIN
    FOR r IN SELECT * FROM pg_event_trigger_ddl_commands() 
    LOOP
    IF (r.object_type = 'table') THEN
        --ASSERT r.object_identity = 'public.tddest', r.object_identity;
        EXECUTE format('ALTER TABLE %I 
        ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT now(), 
        ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NULL;', 
        substring(r.object_identity,2+length(r.schema_name)));
	EXECUTE format('CREATE TRIGGER update_date
                        BEFORE UPDATE ON %I
                        FOR EACH ROW EXECUTE PROCEDURE set_last_updated_date()',
                        substring(r.object_identity,2+length(r.schema_name)));
        END IF;
    END LOOP;
END
$$
LANGUAGE plpgsql;


