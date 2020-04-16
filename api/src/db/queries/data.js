const { getPreviousSearchQueriesFromId } = require('../helpers/data');

const getPreviousSearchQueries = async user_id => {
  return getPreviousSearchQueriesFromId(user_id);
};

module.exports = {
  getPreviousSearchQueries,
};
