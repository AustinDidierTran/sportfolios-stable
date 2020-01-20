
exports.up = function (knex, Promise) {
  return knex.schema.createTable('users', (table => {
    table.uuid('id').primary();
    table.string('name').notNullable();
    table.timestamp('delete_at');
  }))
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('users');
};
