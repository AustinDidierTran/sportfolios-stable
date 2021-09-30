import * as queries from '../../db/queries/person.js';

export const getAllPeopleWithAdmins = async ({
    limit,
    page,
    query,
  }) => {
    return queries.getAllPeopleWithAdmins(
      Number(limit),
      Number(page),
      query,
    );
  };
  
  export const deletePerson = async (id, restore = 'false') => {
    if (restore === 'false') {
      return queries.deletePersonById(id);
    }
  
    return queries.restorePersonById(id);
  };

