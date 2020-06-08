const knex = require('../connection');

const {
  getOrganizationAccess: getOrganizationAccessHelper,
  getSingleOrganization: getSingleOrganizationHelper,
} = require('../helpers/notifications');

function getAllOrganizations(includeDeleted) {
  if (includeDeleted && includeDeleted !== 'false') {
    return knex('organizations').select(['id', 'name', 'photo_url']);
  } else {
    return knex('organizations')
      .select(['id', 'name', 'photo_url'])
      .where({ deleted_at: null });
  }
}

async function getSingleOrganization(id, user_id) {
  const [organization] = await knex('organizations')
    .select(['id', 'name', 'photo_url'])
    .where({ id, deleted_at: null });

  return organization;
}

const addOrganization = async organizationProps => {
  const [entity] = await knex('entities')
    .insert({ type: 2 })
    .returning(['id']);

  const [organization = {}] = await knex('organizations')
    .insert({ ...organizationProps, id: entity.id })
    .returning(['id']);

  return organization.id;
};

async function updateOrganization(id, organization) {
  const { id: idProps, ...updateQuery } = organization;

  const [org] = await knex('organizations')
    .update(updateQuery)
    .where({ id, deleted_at: null })
    .returning(['id', 'name']);

  return org;
}

function deleteOrganization(id) {
  return knex('organizations')
    .where('id', id)
    .del();
}

function restoreOrganization(id) {
  return knex('organizations')
    .update({ deleted_at: null })
    .where({ id })
    .returning(['id', 'name']);
}

module.exports = {
  addOrganization,
  deleteOrganization,
  getAllOrganizations,
  getSingleOrganization,
  restoreOrganization,
  updateOrganization,
};
