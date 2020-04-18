const {
  getPreviousSearchQueriesFromId,
  getUsersFromQuery,
} = require('../helpers/data');

const globalSearch = async (user_id, query) => {
  const users = await getUsersFromQuery(query);

  return {
    users,
  };
};

const getPreviousSearchQueries = async user_id => {
  return getPreviousSearchQueriesFromId(user_id);
};

module.exports = {
  getPreviousSearchQueries,
  globalSearch,
};
