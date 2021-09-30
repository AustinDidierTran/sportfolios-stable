import { ENTITIES_ROLE_ENUM } from '../../../../common/enums/index.js';
import { ERROR_ENUM } from '../../../../common/errors/index.js';
import { getEntity } from '../../db/queries/entity-deprecate.js';
import * as queries from '../../db/queries/organization.js';

import {
  getOrganizationMembers as getOrganizationMembersHelper,
  getOwnedEvents as getOwnedEventsHelper,
  generateReport as generateReportHelper,
} from '../../db/queries/organization.js';
import { isAllowed } from './entity-deprecate.js';

function getOwnedEvents(organizationId) {
  return getOwnedEventsHelper(organizationId);
}

function generateReport(reportId) {
  return generateReportHelper(reportId);
}

function getOrganizationMembers(organizationId, userId) {
  return getOrganizationMembersHelper(organizationId, userId);
}

async function getOrganization(organizationId, userId) {
  const res = await getEntity(organizationId, userId);

  return {
    basicInfos: res.basicInfos,
  };
}

export const getAllOrganizationsWithAdmins = async ({
  limit,
  page,
  query,
}) => {
  return queries.getAllOrganizationsWithAdmins(
    Number(limit),
    Number(page),
    query,
  );
};

export const verifyOrganization = async ({ id, verify }, userId) => {
  if (verify === 'false') {
    return queries.verifyOrganization(id, userId, false);
  }

  return queries.verifyOrganization(id, userId);
};

export const deleteOrganization = async (id, restore = 'false') => {
  if (restore === 'false') {
    return queries.deleteOrganizationById(id);
  }

  return queries.restoreOrganizationById(id);
};

export const getMembers = async ({ id, searchQuery }, userId) => {
  if (!(await isAllowed(id, userId, ENTITIES_ROLE_ENUM.EDITOR))) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }

  return queries.getMembers(id, searchQuery);
};

export {
  getOwnedEvents,
  generateReport,
  getOrganizationMembers,
  getOrganization,
};
