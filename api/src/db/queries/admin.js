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
        'users.id, array_agg(user_email.email ORDER BY user_email.email) AS emails, entities_name.name, entities_name.surname, user_app_role.app_role',
      ),
    )
    .from('users')
    .leftJoin('user_email', 'users.id', '=', 'user_email.user_id')
    .leftJoin(
      'user_entity_role',
      'user_entity_role.user_id',
      '=',
      'users.id',
    )
    .leftJoin(
      'entities',
      'entities.id',
      '=',
      'user_entity_role.entity_id',
    )
    .leftJoin(
      'entities_name',
      'entities.id',
      '=',
      'entities_name.entity_id',
    )
    .leftJoin(
      'user_app_role',
      'users.id',
      '=',
      'user_app_role.user_id',
    )
    .groupBy(
      'users.id',
      'entities_name.name',
      'entities_name.surname',
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
