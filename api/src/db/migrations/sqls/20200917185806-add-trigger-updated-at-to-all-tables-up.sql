
CREATE OR REPLACE FUNCTION set_last_updated_date()
RETURNS TRIGGER 
LANGUAGE PLPGSQL
AS $$
BEGIN
   NEW.updated_at := current_timestamp;
   RETURN NEW;
END;
$$;



DO $$
DECLARE
    t text;
BEGIN
    FOR t IN 
        SELECT table_name FROM information_schema.columns
        WHERE column_name = 'updated_at'
    LOOP
        EXECUTE format('CREATE TRIGGER update_date
                        BEFORE UPDATE ON %I
                        FOR EACH ROW EXECUTE PROCEDURE set_last_updated_date()',
                        t);
    END LOOP;
END;
$$ LANGUAGE plpgsql;

