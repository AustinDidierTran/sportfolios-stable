const knex = require('../connection');

function getOrganizationAccess(user_id, organization_id) {
  return knex('organization_managers')
    .select(['role'])
    .where({ user_id, organization_id });
}

function getSingleOrganization(id) {
  return knex('organizations')
    .select(['id', 'name', 'photo_url'])
    .where({ id, deleted_at: null });
}

module.exports = {
  getOrganizationAccess,
  getSingleOrganization,
};
