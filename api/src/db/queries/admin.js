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
        'users.id, array_agg(user_email.email ORDER BY user_email.email) AS emails, user_info.first_name, user_info.last_name, user_app_role.app_role',
      ),
    )
    .from('users')
    .leftJoin('user_info', 'users.id', '=', 'user_info.user_id')
    .leftJoin('user_email', 'users.id', '=', 'user_email.user_id')
    .leftJoin(
      'user_app_role',
      'users.id',
      '=',
      'user_app_role.user_id',
    )
    .orderBy('user_app_role.app_role', 'asc')
    .orderBy('user_info.last_name', 'asc')
    .orderBy('user_info.first_name', 'asc')
    .groupBy(
      'users.id',
      'user_info.first_name',
      'user_info.last_name',
      'user_app_role.app_role',
    );
  // .offset(0)
  // .limit(10);
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
