const {
  addQueryToRecentSearches,
  getPreviousSearchQueriesFromId,
  getPersonsFromQuery,
} = require('../helpers/data');

const globalSearch = async (user_id, query) => {
  await addQueryToRecentSearches(user_id, query);
  const persons = await getPersonsFromQuery(query);
  return {
    persons: persons.map(p => ({
      id: p.id,
      name: p.name,
      surname: p.surname,
      photoUrl: p.photo_url,
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
