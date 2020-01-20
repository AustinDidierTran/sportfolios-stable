// ID should be a UUID

exports.up = function (knex, Promise) {
  return knex.schema.createTable('user_to_team', (table => {
    table.increments();
    // should be present in another table
    table.string('user_id').notNullable();
    // should be present in another table
    table.string('team_id').notNullable();
    table.timestamp('delete_at');
  }))
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('user_to_team');
};
