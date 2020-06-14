const knex = require('../connection');

const addQueryToRecentSearches = async (user_id, search_query) => {
  return knex('previous_search_queries')
    .insert({
      user_id,
      search_query,
    })
    .returning('*');
};

const getUsersFromQuery = async query => {
  return knex('entities_name')
    .select('id', 'name', 'surname', 'photo_url')
    .leftJoin(
      'entities_photo',
      'entities_name.id',
      '=',
      'entities_photo.entity_id',
    )
    .where('persons.name', 'ILIKE', `%${query}%`)
    .orWhere('persons.surname', 'ILIKE', `%${query}%`);
};

const getPreviousSearchQueriesFromId = async user_id => {
  return knex
    .select(knex.raw('array_agg(search_query) AS search_queries'))
    .from(
      knex
        .select('search_query')
        .from('previous_search_queries')
        .where({ user_id })
        .orderBy('previous_search_queries.created_at', 'desc')
        .limit(10)
        .as('subQuery'),
    );
};

module.exports = {
  addQueryToRecentSearches,
  getPreviousSearchQueriesFromId,
  getUsersFromQuery,
};
