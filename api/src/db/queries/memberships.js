import knex from '../connection.js';

const getMembershipsByIdAndOrganizationId = async (personId, organizationId) => {
  return await knex('memberships_infos')
    .select('*')
    .where({
      person_id: personId,
      organization_id: organizationId,
    });
}

export { getMembershipsByIdAndOrganizationId }