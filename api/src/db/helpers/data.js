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
  const mappingFunction = e => ({
    id: e.id,
    type: e.type,
    photoUrl: e.photoUrl,
    completeName: e.complete_name,
  });
  const entities = await knex
    .select(
      'entities_formatted.id',
      'entities_formatted.type',
      'entities_formatted.photo_url',
      'entities_formatted.complete_name',
    )
    .from(
      knex
        .select(
          'id',
          'name',
          'surname',
          'type',
          'entities_photo.photo_url',
          knex.raw(
            "string_agg(entities_name.name || ' ' || entities_name.surname, ' ') AS complete_name",
          ),
        )
        .from('entities')
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
        .groupBy('id', 'type', 'entities_photo.photo_url')
        .as('entities_formatted'),
    )
    .where('complete_name', 'ILIKE', `%${query}%`)
    .orWhere('name', 'ILIKE', `%${query}%`)
    .orWhere('surname', 'ILIKE', `%${query}%`);

  if (!blackList || blackList === undefined) {
    return entities.map(mappingFunction);
  }

  const parsed = JSON.parse(blackList);
  return entities
    .filter(e => !parsed.includes(e.id))
    .map(mappingFunction);
};

const getPersonsFromQuery = async (query, blackList) => {
  const mappingFunction = e => ({
    id: e.id,
    type: e.type,
    photoUrl: e.photoUrl,
    completeName: e.complete_name,
  });
  const entities = await knex
    .select(
      'entities_formatted.id',
      'entities_formatted.type',
      'entities_formatted.photo_url',
      'entities_formatted.complete_name',
    )
    .from(
      knex
        .select(
          'id',
          'type',
          'entities_photo.photo_url',
          knex.raw(
            "string_agg(entities_name.name || ' ' || entities_name.surname, ' ') AS complete_name",
          ),
        )
        .from('entities')
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
        .where('entities.type', GLOBAL_ENUM.PERSON)
        .groupBy('id', 'type', 'entities_photo.photo_url')
        .as('entities_formatted'),
    )
    .where('complete_name', 'ILIKE', `%${query}%`);

  if (whiteList) {
    const parsed = JSON.parse(whiteList);
    return entities
      .filter(t => parsed.includes(t.id))
      .map(mappingFunction);
  }

  if (blackList) {
    const parsed = JSON.parse(blackList);
    return entities
      .filter(e => !parsed.includes(e.id))
      .map(mappingFunction);
  }

  return entities.map(mappingFunction);
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
  return knex('entities')
    .select(
      'id',
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
    .andWhere('entities.type', '=', GLOBAL_ENUM.ORGANIZATION)
    .andWhere('entities_name.name', 'ILIKE', `%${query}%`)
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
