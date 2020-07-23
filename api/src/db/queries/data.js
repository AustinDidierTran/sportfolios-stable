const { GLOBAL_ENUM } = require('../../../../common/enums');

const {
  addQueryToRecentSearches,
  getEntitiesFromQuery,
  getOrganizationsFromQuery,
  getPersonsFromQuery,
  getPreviousSearchQueriesFromId,
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
    const res = await getPersonsFromQuery(query, blackList);
    entities = res.map(r => ({ ...r, type }));
  } else if (type === GLOBAL_ENUM.ORGANIZATION) {
    const res = await getOrganizationsFromQuery(query);
    entities = res.map(r => ({ ...r, type }));
  } else if (type === GLOBAL_ENUM.TEAM) {
    const res = await getTeamsFromQuery(query, blackList, whiteList);
    entities = res.map(r => ({ ...r, type }));
  } else {
    await addQueryToRecentSearches(user_id, query);
    entities = await getEntitiesFromQuery(query, blackList);
  }
  return {
    entities: entities.map(e => ({
      id: e.id,
      name: e.name,
      surname: e.surname,
      photoUrl: e.photo_url,
      type: e.type,
    })),
  };
};

const getPreviousSearchQueries = async user_id => {
  return getPreviousSearchQueriesFromId(user_id);
};

module.exports = {
  getPreviousSearchQueries,
  globalSearch,
};
