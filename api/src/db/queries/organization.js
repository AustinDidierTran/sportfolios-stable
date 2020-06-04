const knex = require('../connection');

function getAllOrganizations(includeDeleted) {
  if (includeDeleted && includeDeleted !== 'false') {
    return knex('organizations').select(['id', 'name']);
  } else {
    return knex('organizations')
      .select(['id', 'name'])
      .where({ deleted_at: null });
  }
}

function getSingleOrganization(id) {
  return knex('organizations')
    .select(['id', 'name'])
    .where({ id, deleted_at: null });
}

const addOrganization = async organization => {
  const res = await knex('organizations')
    .insert(organization)
    .returning(['id']);

  return res[0];
};

function updateOrganization(id, organization) {
  return knex('organizations')
    .update(organization)
    .where({ id, deleted_at: null })
    .returning(['id', 'name']);
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
