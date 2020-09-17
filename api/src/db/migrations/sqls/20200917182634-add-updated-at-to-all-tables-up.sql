do $$
declare
    selectrow record;
begin
for selectrow in
    select 
      'ALTER TABLE '|| T.mytable || ' ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NULL' as script 
   from 
      ( 
        select tablename as mytable from  pg_tables where schemaname  ='public' --your schema name here
      ) t
loop
execute selectrow.script;
end loop;
end;
$$;
