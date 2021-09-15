import * as queries from '../../db/queries/team.js';

export const getAllTeamsWithAdmins = async ({ limit, page }) => {
  return queries.getAllTeamsWithAdmins(Number(limit), Number(page));
};
