const { getEntity } = require('../../db/queries/entity');
const {
  getOrganizationMembers: getOrganizationMembersHelper,
  getOwnedEvents: getOwnedEventsHelper,
  generateReport: generateReportHelper,
} = require('../../db/queries/organization');

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

module.exports = {
  getOwnedEvents,
  generateReport,
  getOrganizationMembers,
  getOrganization,
};
