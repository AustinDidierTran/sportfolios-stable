const knex = require('../connection');

function createSport(sport) {
  return knex('sports')
    .insert({
      name: sport.name,
      score_type: sport.scoreType,
    })
    .returning(['id', 'name']);
}

function getAllSports() {
  return knex('sports')
    .select('*')
    .orderBy('score_type', 'asc')
    .orderBy('name', 'asc');
}

function getAllUsers() {
  return knex
    .select(
      knex.raw(
        'users.id, array_agg(user_email.email ORDER BY user_email.email) AS emails, persons.first_name, persons.last_name, user_app_role.app_role',
      ),
    )
    .from('users')
    .leftJoin('persons', 'users.id', '=', 'persons.user_id')
    .leftJoin('user_email', 'users.id', '=', 'user_email.user_id')
    .leftJoin(
      'user_app_role',
      'users.id',
      '=',
      'user_app_role.user_id',
    )
    .orderBy('user_app_role.app_role', 'asc')
    .orderBy('persons.last_name', 'asc')
    .orderBy('persons.first_name', 'asc')
    .groupBy(
      'users.id',
      'persons.first_name',
      'persons.last_name',
      'user_app_role.app_role',
    );
}

function updateSport(id, sport) {
  const updateObject = {};

  if (sport.name) {
    updateObject.name = sport.name;
  }

  if (sport.scoreType || sport.scoreType === 0) {
    updateObject.score_type = sport.scoreType;
  }

  return knex('sports')
    .update(updateObject)
    .where({ id, deleted_at: null })
    .returning('*');
}

module.exports = {
  createSport,
  getAllSports,
  getAllUsers,
  updateSport,
};
