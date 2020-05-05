const {
  addQueryToRecentSearches,
  getPreviousSearchQueriesFromId,
  getUsersFromQuery,
} = require('../helpers/data');

const globalSearch = async (user_id, query) => {
  await addQueryToRecentSearches(user_id, query);
  const users = await getUsersFromQuery(query);

  return {
    users,
  };
};

const getPreviousSearchQueries = async user_id => {
  const res = await getPreviousSearchQueriesFromId(user_id);
  return res[0];
};

module.exports = {
  getPreviousSearchQueries,
  globalSearch,
};
