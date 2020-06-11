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
  return knex('persons')
    .select('id', 'first_name', 'last_name', 'photo_url')
    .leftJoin(
      'entities_photo',
      'persons.id',
      '=',
      'entities_photo.entity_id',
    )
    .where('persons.first_name', 'ILIKE', `%${query}%`)
    .orWhere('persons.last_name', 'ILIKE', `%${query}%`);
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
