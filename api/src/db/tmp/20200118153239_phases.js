
exports.up = function (knex, Promise) {
  return knex.schema.createTable('phases', (table => {
    table.increments();
    table.string('name').notNullable();
    table.timestamp('delete_at');
  }))
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('phases');
};
