# DB

## Tips

### How to connect to psql

```
psql -U postgres
```

### How to create a migration

1. db-migrate create `migration_name` --sql-file
2. Edit up and down migration files

### How to run migrations

3. Run it with `db-migrate up [2020....]`. You can also set

REF: https://db-migrate.readthedocs.io/en/latest/Getting%20Started/commands/#up
