const knex = require('../connection');
const { GLOBAL_ENUM } = require('../../../../common/enums');

const addQueryToRecentSearches = async (user_id, search_query) => {
  return knex('previous_search_queries')
    .insert({
      user_id,
      search_query,
    })
    .returning('*');
};

const getEntitiesFromQuery = async (query, blackList) => {
  const entities = await knex('entities')
    .select(
      'id',
      'type',
      'entities_name.name',
      'entities_name.surname',
      'entities_photo.photo_url',
    )
    .leftJoin(
      'entities_photo',
      'entities.id',
      '=',
      'entities_photo.entity_id',
    )
    .leftJoin(
      'entities_name',
      'entities.id',
      '=',
      'entities_name.entity_id',
    )
    .where('entities_name.name', 'ILIKE', `%${query}%`)
    .orWhere('entities_name.surname', 'ILIKE', `%${query}%`)
    .limit(10);

  if (!blackList || blackList === undefined) {
    return entities;
  }

  const parsed = JSON.parse(blackList);
  return entities.filter(e => !parsed.includes(e.id));
};

const getPersonsFromQuery = async (query, blackList) => {
  const persons = await knex('persons')
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
    .orWhere('entities_name.surname', 'ILIKE', `%${query}%`)
    .limit(10);

  if (!blackList || blackList === undefined) {
    return persons;
  }
  const parsed = JSON.parse(blackList);
  return persons.filter(p => !parsed.includes(p.id));
};

const getTeamsFromQuery = async (query, blackList, whiteList) => {
  const teams = await knex('entities')
    .select(
      'entities.id',
      'entities_name.name',
      'entities_name.surname',
      'entities_photo.photo_url',
    )
    .leftJoin(
      'entities_photo',
      'entities.id',
      '=',
      'entities_photo.entity_id',
    )
    .leftJoin(
      'entities_name',
      'entities.id',
      '=',
      'entities_name.entity_id',
    )
    .whereNull('entities.deleted_at')
    .andWhere('entities_name.name', 'ILIKE', `%${query}%`)
    .andWhere('entities.type', '=', GLOBAL_ENUM.TEAM);

  if (whiteList) {
    const parsed = JSON.parse(whiteList);
    return teams.filter(t => parsed.includes(t.id));
  }
  if (blackList) {
    const parsed = JSON.parse(blackList);
    return teams.filter(t => !parsed.includes(t.id));
  }
  return teams;
};

const getOrganizationsFromQuery = async query => {
  return knex('organizations')
    .select(
      'id',
      'entities_name.name',
      'entities_name.surname',
      'entities_photo.photo_url',
    )
    .leftJoin(
      'entities_photo',
      'organizations.id',
      '=',
      'entities_photo.entity_id',
    )
    .leftJoin(
      'entities_name',
      'organizations.id',
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
        .select(
          knex.raw(
            'search_query, max(previous_search_queries.created_at) AS created_at',
          ),
        )

        .from('previous_search_queries')
        .where({ user_id })
        .groupBy('search_query')
        .orderBy('created_at', 'desc')
        .limit(10)
        .as('subQuery'),
    );

  return search_queries;
};

module.exports = {
  addQueryToRecentSearches,
  getEntitiesFromQuery,
  getOrganizationsFromQuery,
  getPersonsFromQuery,
  getPreviousSearchQueriesFromId,
  getEntitiesFromQuery,
  getOrganizationsFromQuery,
  getPersonsFromQuery,
  getPreviousSearchQueriesFromId,
  getTeamsFromQuery,
};
