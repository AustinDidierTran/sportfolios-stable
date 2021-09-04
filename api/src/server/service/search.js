import { GLOBAL_ENUM } from '../../../../common/enums/index.js';

import {
  addQueryToRecentSearches,
  getEntitiesFromQuery,
  getOrganizationsFromQuery,
  getPersonsFromQuery,
  getPreviousSearchQueriesFromId,
  getMyTeamsFromQuery,
  getTeamsFromQuery,
} from '../../db/queries/search.js';

async function globalSearch(
  user_id,
  query,
  typeProps,
  blackList,
  whiteList,
) {
  const type = Number(typeProps);
  let entities;

  if (type === GLOBAL_ENUM.PERSON) {
    entities = await getPersonsFromQuery(query, blackList, whiteList);
  } else if (type === GLOBAL_ENUM.ORGANIZATION) {
    entities = await getOrganizationsFromQuery(query);
  } else if (type === GLOBAL_ENUM.TEAM) {
    entities = await getTeamsFromQuery(query, blackList, whiteList);
  } else {
    await addQueryToRecentSearches(user_id, query);
    entities = await getEntitiesFromQuery(query, blackList);
  }
  return { entities };
}

async function myTeamsSearch(userId, query, eventId) {
  const entities = await getMyTeamsFromQuery(userId, eventId, query);

  return { entities };
}

function getPreviousSearchQueries(userId) {
  return getPreviousSearchQueriesFromId(userId);
}

export {
  getPreviousSearchQueries,
  globalSearch,
  myTeamsSearch,
};
