const {
  addQueryToRecentSearches,
  getPreviousSearchQueriesFromId,
  getPersonsFromQuery,
} = require('../helpers/data');

const globalSearch = async (user_id, query) => {
  await addQueryToRecentSearches(user_id, query);
  const persons = await getPersonsFromQuery(query);
  return {
    persons,
  };
};

const getPreviousSearchQueries = async user_id => {
  return getPreviousSearchQueriesFromId(user_id);
};

module.exports = {
  getPreviousSearchQueries,
  globalSearch,
};
