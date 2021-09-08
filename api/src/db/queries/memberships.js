import knex from '../connection.js';

export const getMembershipsByIdAndOrganizationId = async (personId, organizationId) => {
  return await knex('memberships_infos')
    .select('*')
    .where({
      person_id: personId,
      organization_id: organizationId,
    });
}

export const getMembershipByPersonIds = async (playerIds, creatorId) => {
  return await knex('memberships')
    .whereIn('person_id', playerIds)
    .andWhere('organization_id', creatorId);
}


