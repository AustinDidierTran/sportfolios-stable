const {
  ENTITIES_ROLE_ENUM,
  ENTITIES_TYPE_ENUM,
} = require('../../server/enums');
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

async function addOrganization(props, user_id) {
  const { name } = props;

  const [entity] = await knex('entities')
    .insert({ type: ENTITIES_TYPE_ENUM.ORGANIZATION })
    .returning(['id']);

  await knex('entities_role').insert({
    entity_id: entity.id,
    user_id,
    role: ENTITIES_ROLE_ENUM.ADMIN,
  });

  await knex('entities_name').insert({ entity_id: entity.id, name });

  await knex('entities_photo').insert({
    entity_id: entity.id,
  });

  const [organization] = await knex('organizations')
    .insert({ id: entity.id })
    .returning(['id']);

  return organization;
}

module.exports = {
  getOrganizationAccess,
  getSingleOrganization,
  addOrganization,
};
