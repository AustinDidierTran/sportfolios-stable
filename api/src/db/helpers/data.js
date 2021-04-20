const knex = require('../connection');
const { GLOBAL_ENUM } = require('../../../../common/enums');
const {
  getAllOwnedEntities,
  isTeamRegisteredInEvent,
} = require('./entity');

const addQueryToRecentSearches = async (user_id, search_query) => {
  return knex('previous_search_queries')
    .insert({
      user_id,
      search_query,
    })
    .returning('*');
};

const getEntitiesFromQuery = async (query, blackList) => {
  const mappingFunction = e => {
    if (e.type === GLOBAL_ENUM.PERSON) {
      return {
        id: e.id,
        type: e.type,
        photoUrl: e.photo_url,
        completeName: e.complete_name || e.name,
      };
    }
    return {
      id: e.id,
      type: e.type,
      photoUrl: e.photo_url,
      name: e.complete_name || e.name,
    };
  };
  const entities = await knex
    .select(
      'entities_formatted.name',
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
          'photo_url',
          knex.raw(
            "string_agg(entities_general_infos.name || ' ' || entities_general_infos.surname, ' ') AS complete_name",
          ),
        )
        .from('entities')
        .leftJoin(
          'entities_general_infos',
          'entities.id',
          '=',
          'entities_general_infos.entity_id',
        )
        .groupBy('id', 'type', 'name', 'surname', 'photo_url')
        .as('entities_formatted')
        .whereNull('deleted_at'),
    )
    .where('complete_name', 'ILIKE', `%${query}%`)
    .orWhere('name', 'ILIKE', `%${query}%`)
    .orWhere('surname', 'ILIKE', `%${query}%`)
    .limit(15);

  if (!blackList || blackList === undefined) {
    return entities.map(mappingFunction);
  }

  const parsed = JSON.parse(blackList);
  return entities
    .filter(e => !parsed.includes(e.id))
    .map(mappingFunction);
};

const getPersonsFromQuery = async (query, blackList, whiteList) => {
  const mappingFunction = e => ({
    id: e.id,
    type: e.type,
    photoUrl: e.photo_url,
    completeName: e.complete_name || e.name,
  });
  const entities = await knex
    .select(
      'entities_formatted.name',
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
          'name',
          'surname',
          'photo_url',
          knex.raw(
            "string_agg(entities_general_infos.name || ' ' || entities_general_infos.surname, ' ') AS complete_name",
          ),
        )
        .from('entities')
        .leftJoin(
          'entities_general_infos',
          'entities.id',
          '=',
          'entities_general_infos.entity_id',
        )
        .where('entities.type', GLOBAL_ENUM.PERSON)
        .groupBy('id', 'type', 'name', 'surname', 'photo_url')
        .as('entities_formatted')
        .whereNull('deleted_at'),
    )
    .where('complete_name', 'ILIKE', `%${query}%`)
    .orWhere('name', 'ILIKE', `%${query}%`)
    .orWhere('surname', 'ILIKE', `%${query}%`)
    .limit(15);
  let finalList = entities;
  if (whiteList) {
    const parsed = JSON.parse(whiteList);
    finalList = finalList.filter(t => parsed.includes(t.id));
  }

  if (blackList) {
    const parsed = JSON.parse(blackList);
    finalList = finalList.filter(e => !parsed.includes(e.id));
  }
  return finalList.map(mappingFunction);
};

const getTeamsFromQuery = async (query, blackList, whiteList) => {
  const mappingFunction = e => ({
    id: e.id,
    type: e.type,
    photoUrl: e.photo_url,
    name: e.complete_name || e.name,
  });
  const entities = await knex
    .select(
      'entities_formatted.name',
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
          'photo_url',
          knex.raw(
            "string_agg(entities_general_infos.name || ' ' || entities_general_infos.surname, ' ') AS complete_name",
          ),
        )
        .from('entities')
        .leftJoin(
          'entities_general_infos',
          'entities.id',
          '=',
          'entities_general_infos.entity_id',
        )
        .where('entities.type', GLOBAL_ENUM.TEAM)
        .groupBy('id', 'type', 'name', 'surname', 'photo_url')
        .as('entities_formatted')
        .whereNull('deleted_at'),
    )
    .where('complete_name', 'ILIKE', `%${query}%`)
    .orWhere('name', 'ILIKE', `%${query}%`)
    .orWhere('surname', 'ILIKE', `%${query}%`)
    .limit(15);

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

const getMyTeamsFromQuery = async (userId, eventId, query) => {
  const mappingFunction = async e => ({
    ...e,
    surname: undefined,
    complete_name: undefined,
    isRegistered: await isTeamRegisteredInEvent(e.id, eventId),
  });

  const entities = await getAllOwnedEntities(
    GLOBAL_ENUM.TEAM,
    userId,
    query,
  );

  return Promise.all(entities.map(mappingFunction));
};

const getOrganizationsFromQuery = async query => {
  const mappingFunction = e => ({
    id: e.id,
    type: e.type,
    photoUrl: e.photoUrl,
    name: e.complete_name || e.name,
  });
  const entities = await knex
    .select(
      'entities_formatted.name',
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
          'name',
          'surname',
          'photo_url',
          knex.raw(
            "string_agg(entities_general_infos.name || ' ' || entities_general_infos.surname, ' ') AS complete_name",
          ),
        )
        .from('entities')
        .leftJoin(
          'entities_general_infos',
          'entities.id',
          '=',
          'entities_general_infos.entity_id',
        )
        .where('entities.type', GLOBAL_ENUM.ORGANIZATION)
        .groupBy('id', 'type', 'name', 'surname', 'photo_url')
        .as('entities_formatted')
        .whereNull('deleted_at'),
    )
    .where('complete_name', 'ILIKE', `%${query}%`)
    .orWhere('name', 'ILIKE', `%${query}%`)
    .orWhere('surname', 'ILIKE', `%${query}%`)
    .limit(15);

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
  getMyTeamsFromQuery,
};
