const knex = require('../connection');
const { GLOBAL_ENUM } = require('../../../../common/enums');
const { getRealId } = require('./entity');

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
        .groupBy(
          'id',
          'type',
          'name',
          'surname',
          'entities_photo.photo_url',
        )
        .as('entities_formatted'),
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
        .groupBy(
          'id',
          'type',
          'name',
          'surname',
          'entities_photo.photo_url',
        )
        .as('entities_formatted'),
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
          'type',
          'name',
          'surname',
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
        .where('entities.type', GLOBAL_ENUM.TEAM)
        .groupBy(
          'id',
          'type',
          'name',
          'surname',
          'entities_photo.photo_url',
        )
        .as('entities_formatted'),
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
  const realEventId = await getRealId(eventId);

  const isRegisteredInEvent = async teamId => {
    const [res] = await knex('event_rosters')
      .select('roster_id')
      .where({ event_id: realEventId, team_id: teamId });
    return res ? true : false;
  };

  const mappingFunction = async e => ({
    id: e.id,
    type: e.type,
    photoUrl: e.photo_url,
    name: e.complete_name || e.name,
    isRegistered: await isRegisteredInEvent(e.id),
  });

  // getPersons
  let entityIds = (
    await knex('user_entity_role')
      .select('entity_id')
      .where({
        user_id: userId,
      })
  ).map(person => person.entity_id);

  let count = 0;
  let newEntityIds = [];

  // get all entities owned by persons and sub persons
  do {
    entityIds = [...newEntityIds, ...entityIds];
    entityIds = entityIds.filter(
      (id, index) => entityIds.indexOf(id) === index,
    );

    newEntityIds = (
      await knex('entities_role')
        .select('entity_id')
        .whereIn('entity_id_admin', entityIds)
    ).map(entity => entity.entity_id);

    count++;
  } while (
    newEntityIds.some(id => !entityIds.includes(id)) &&
    count < 5
  );

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
        .whereNull('entities.deleted_at')
        .whereIn('entities.id', newEntityIds)
        .andWhere('entities.type', GLOBAL_ENUM.TEAM)
        .groupBy(
          'id',
          'type',
          'name',
          'surname',
          'entities_photo.photo_url',
        )
        .as('entities_formatted'),
    )
    .where('complete_name', 'ILIKE', `%${query}%`)
    .orWhere('name', 'ILIKE', `%${query}%`)
    .orWhere('surname', 'ILIKE', `%${query}%`)
    .limit(15);

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
        .where('entities.type', GLOBAL_ENUM.ORGANIZATION)
        .groupBy(
          'id',
          'type',
          'name',
          'surname',
          'entities_photo.photo_url',
        )
        .as('entities_formatted'),
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
