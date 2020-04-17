const knex = require('../connection');

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

module.exports = { getPreviousSearchQueriesFromId };
