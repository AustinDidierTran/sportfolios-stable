const { GLOBAL_ENUM } = require('../../../../common/enums');

const {
  addQueryToRecentSearches,
  getEntitiesFromQuery,
  getOrganizationsFromQuery,
  getPersonsFromQuery,
  getPreviousSearchQueriesFromId,
  getMyTeamsFromQuery,
  getTeamsFromQuery,
} = require('../helpers/data');

const globalSearch = async (
  user_id,
  query,
  typeProps,
  blackList,
  whiteList,
) => {
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
};

const myTeamsSearch = async (userId, query, eventId) => {
  const entities = await getMyTeamsFromQuery(userId, eventId, query);

  return { entities };
};

const getPreviousSearchQueries = async userId => {
  return getPreviousSearchQueriesFromId(userId);
};

module.exports = {
  getPreviousSearchQueries,
  globalSearch,
  myTeamsSearch,
};
