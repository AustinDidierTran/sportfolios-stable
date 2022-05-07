import knex from '../connection.js';
import {memberships} from '../models/memberships.js'

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

export const getMembers = async (personId, organizationId) => {

  return await memberships
    .query()
    .select('*')
    .leftJoin('members_number', function(){
      this.on('memberships.organization_id', '=', 'members_number.organization_id')
      .andOn('memberships.person_id', '=', 'members_number.person_id')
    })
    .where('memberships.organization_id', organizationId)
    .andWhere('memberships.person_id', personId);
}

