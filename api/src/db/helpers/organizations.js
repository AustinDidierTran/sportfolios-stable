const {
  ENTITIES_ROLE_ENUM,
  ENTITIES_TYPE_ENUM,
} = require('../../../../common/enums');
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

async function addOrganization(body, user_id) {
  const { name, surname } = body;

  const [entity_id] = await knex('entities')
    .insert({ type: ENTITIES_TYPE_ENUM.ORGANIZATION })
    .returning(['id']);

  const [entity_id_admin] = await knex('persons')
    .select(['id'])
    .leftJoin(
      'user_entity_role',
      'user_entity_role.entity_id',
      '=',
      'persons.id',
    )
    .where('user_entity_role.user_id', user_id);

  await knex('entities_role').insert({
    entity_id: entity_id.id,
    entity_id_admin: entity_id_admin.id,
    role: ENTITIES_ROLE_ENUM.ADMIN,
  });

  await knex('entities_name').insert({
    entity_id: entity_id.id,
    name,
    surname,
  });

  await knex('entities_photo').insert({
    entity_id: entity_id.id,
  });

  const [organization] = await knex('organizations')
    .insert({ id: entity_id.id })
    .returning(['id']);

  return organization;
}

module.exports = {
  getOrganizationAccess,
  getSingleOrganization,
  addOrganization,
};
