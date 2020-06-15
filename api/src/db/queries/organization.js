const knex = require('../connection');

const { ENTITIES_ROLE_ENUM } = require('../../../../common/enums');

const {
  getEntity: getEntityHelper,
  getAllTypeEntities: getAllTypeEntitiesHelper,
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
  const { id, name, surname, photo_url } = body;

  const res = await knex('user_entity_role')
    .select(['user_id'])
    .leftJoin(
      'entities_role',
      'user_entity_role.entity_id',
      '=',
      'entities_role.entity_id_admin',
    )
    .where('entities_role.entity_id', id);

  const userId = res.map(res => res.user_id);

  const isAuthorized = userId.includes(user_id);

  if (isAuthorized) {
    if (name || surname) {
      await updateEntityNameHelper(id, name, surname);
    }
    if (photo_url) {
      await updateEntityPhotoHelper(id, photo_url);
    }
    return { id, name, surname, photo_url };
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
