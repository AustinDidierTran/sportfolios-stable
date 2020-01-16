
exports.up = function (knex, Promise) {
  return knex.schema.createTable('associations', (table => {
    table.increments();
    table.string('name').notNullable().unique();
    table.string('sport').notNullable();
    table.integer('memberLimit').notNullable();
    table.boolean('isDeleted').notNullable();
  }))
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('associations');
};
