DROP EVENT TRIGGER tr_create_table;


CREATE EVENT TRIGGER tr_create_table ON ddl_command_end WHEN TAG IN ('CREATE TABLE') EXECUTE PROCEDURE on_create_table_func();

