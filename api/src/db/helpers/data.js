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
    .select(
      'id',
      'entities_name.name',
      'entities_name.surname',
      'entities_photo.photo_url',
    )
    .leftJoin(
      'entities_photo',
      'persons.id',
      '=',
      'entities_photo.entity_id',
    )
    .leftJoin(
      'entities_name',
      'persons.id',
      '=',
      'entities_name.entity_id',
    )
    .where('entities_name.name', 'ILIKE', `%${query}%`)
    .orWhere('entities_name.surname', 'ILIKE', `%${query}%`);
};

const getPreviousSearchQueriesFromId = async user_id => {
  const [{ search_queries = [] } = {}] = await knex
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

  return search_queries;
};

module.exports = {
  addQueryToRecentSearches,
  getPreviousSearchQueriesFromId,
  getUsersFromQuery,
};
