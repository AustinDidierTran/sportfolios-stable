# API

This api is made in Javascript using Node.js using the Koa.js framework.

## Tips

### How to connect to psql

```
psql -U postgres
```

### How to create a migration

1. db-migrate create _migration_name_ --sql-file
2. Edit up and down migration files
3. Run it with `db-migrate up [2020....]`. You can also set

REF: https://db-migrate.readthedocs.io/en/latest/Getting%20Started/commands/#up

## References

### Setup authentication, koa and test

https://mherman.org/blog/building-a-restful-api-with-koa-and-postgres/
