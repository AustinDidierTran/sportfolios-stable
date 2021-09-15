import * as queries from '../../db/queries/team.js';

export const getAllTeamsWithAdmins = async ({
  limit,
  page,
  query,
}) => {
  return queries.getAllTeamsWithAdmins(
    Number(limit),
    Number(page),
    query,
  );
};

export const deleteTeam = async (id, restore = 'false') => {
  if (restore === 'false') {
    return queries.deleteTeamById(id);
  }

  return queries.restoreTeamById(id);
};
