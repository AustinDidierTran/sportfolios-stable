const knex = require('../connection');

const {
  getEntity: getEntityHelper,
  getAllTypeEntities: getAllTypeEntitiesHelper,
  getAllEntities: getAllEntitiesHelper,
  updateEntityName: updateEntityNameHelper,
  updateEntityPhoto: updateEntityPhotoHelper,
} = require('../helpers/entity');

function getAllOrganizations() {
  return getAllTypeEntitiesHelper(2);
}

async function getSingleOrganization(id) {
  return getEntityHelper(id);
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

async function updateOrganization(body) {
  const { id, name, photo_url } = body;
  if (name) {
    await updateEntityNameHelper(id, name);
  }
  if (photo_url) {
    await updateEntityPhotoHelper(id, photo_url);
  }
  return { id, name, photo_url };
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
