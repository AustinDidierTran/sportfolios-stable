const knex = require('../connection');

const { ENTITIES_ROLE_ENUM } = require('../../server/enums');

const {
  getEntity: getEntityHelper,
  getAllTypeEntities: getAllTypeEntitiesHelper,
  getAllEntities: getAllEntitiesHelper,
  updateEntityName: updateEntityNameHelper,
  updateEntityPhoto: updateEntityPhotoHelper,
} = require('../helpers/entity');

const {
  addOrganization: addOrganizationHelper,
} = require('../helpers/organizations');

function getAllOrganizations() {
  return getAllTypeEntitiesHelper(2);
}

async function getSingleOrganization(id) {
  return getEntityHelper(id);
}

const addOrganization = async (props, user_id) => {
  return addOrganizationHelper(props, user_id);
};

async function updateOrganization(body, user_id) {
  const { id, name, photo_url } = body;

  const [{ role }] = await knex('entities_role')
    .select(['role'])
    .where({ entity_id: id, user_id });

  if (
    role == ENTITIES_ROLE_ENUM.ADMIN ||
    role == ENTITIES_ROLE_ENUM.EDITOR
  ) {
    if (name) {
      await updateEntityNameHelper(id, name);
    }
    if (photo_url) {
      await updateEntityPhotoHelper(id, photo_url);
    }
    return { id, name, photo_url };
  }
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
