
exports.up = function (knex, Promise) {
  return knex.schema.createTable('association_to_sport', (table => {
    table.increments();
    table.string('name').notNullable().unique();
    table.timestamp('delete_at');
  }))
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('association_to_sport');
};
