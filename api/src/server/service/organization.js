import { getEntity } from '../../db/queries/entity.js';

import {
  getOrganizationMembers as getOrganizationMembersHelper,
  getOwnedEvents as getOwnedEventsHelper,
  generateReport as generateReportHelper,
} from '../../db/queries/organization.js';

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

export {
  getOwnedEvents,
  generateReport,
  getOrganizationMembers,
  getOrganization,
};
