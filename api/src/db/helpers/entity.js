const knex = require('../connection');

const {
  ENTITIES_ROLE_ENUM,
  ENTITIES_TYPE_ENUM,
} = require('../../../../common/enums');

const addEntity = async (body, user_id) => {
  const { name, surname, type } = body;

  const [{ id: entity_id } = {}] = await knex('entities')
    .insert({ type })
    .returning(['id']);

  await knex('entities_name').insert({
    entity_id,
    name,
    surname,
  });

  await knex('entities_photo').insert({
    entity_id,
  });

  if (
    [
      ENTITIES_TYPE_ENUM.TEAM,
      ENTITIES_TYPE_ENUM.ORGANIZATION,
    ].includes(type)
  ) {
    const [{ id: entity_id_admin } = {}] = await knex('persons')
      .select(['id'])
      .leftJoin(
        'user_entity_role',
        'user_entity_role.entity_id',
        '=',
        'persons.id',
      )
      .where('user_entity_role.user_id', user_id);

    await knex('entities_role').insert({
      entity_id,
      entity_id_admin,
      role: ENTITIES_ROLE_ENUM.ADMIN,
    });

    if (type === ENTITIES_TYPE_ENUM.ORGANIZATION) {
      const [organization] = await knex('organizations')
        .insert({ id: entity_id })
        .returning(['id']);

      return organization;
    }
    if (type === ENTITIES_TYPE_ENUM.TEAM) {
      const [team] = await knex('teams')
        .insert({ id: entity_id })
        .returning(['id']);

      return team;
    }
  } else if (ENTITIES_TYPE_ENUM.PERSON === type) {
    await knex('user_entity_role').insert({
      user_id,
      entity_id,
      role: ENTITIES_ROLE_ENUM.ADMIN,
    });

    const [person] = await knex('persons')
      .insert({ id: entity_id })
      .returning(['id']);

    return person;
  }
};

async function getAllEntities(params) {
  const { type } = params;

  if (type) {
    return knex('entities')
      .select('id', 'type', 'name', 'photo_url')
      .leftJoin(
        'entities_name',
        'entities.id',
        '=',
        'entities_name.entity_id',
      )
      .leftJoin(
        'entities_photo',
        'entities.id',
        '=',
        'entities_photo.entity_id',
      )
      .where({ type });
  }

  return knex('entities')
    .select('id', 'type', 'name', 'photo_url')
    .leftJoin(
      'entities_name',
      'entities.id',
      '=',
      'entities_name.entity_id',
    )
    .leftJoin(
      'entities_photo',
      'entities.id',
      '=',
      'entities_photo.entity_id',
    );
}

async function getAllTypeEntities(type) {
  return knex('entities')
    .select('id', 'type', 'name', 'photo_url')
    .leftJoin(
      'entities_name',
      'entities.id',
      '=',
      'entities_name.entity_id',
    )
    .leftJoin(
      'entities_photo',
      'entities.id',
      '=',
      'entities_photo.entity_id',
    )
    .where({ type });
}

async function getAllRolesEntity(entity_id) {
  return knex('entities_role')
    .select('entity_id_admin', 'role', 'name', 'photo_url')
    .leftJoin(
      'entities_name',
      'entities_role.entity_id_admin',
      '=',
      'entities_name.entity_id',
    )
    .leftJoin(
      'entities_photo',
      'entities_role.entity_id_admin',
      '=',
      'entities_photo.entity_id',
    )
    .where('entities_role.entity_id', entity_id);
}

async function getEntity(id, user_id) {
  const [entity] = await knex('entities')
    .select('id', 'type', 'name', 'photo_url')
    .leftJoin(
      'entities_name',
      'entities.id',
      '=',
      'entities_name.entity_id',
    )
    .leftJoin(
      'entities_photo',
      'entities.id',
      '=',
      'entities_photo.entity_id',
    )
    .where({ id });

  let role;

  if (entity.type === ENTITIES_TYPE_ENUM.PERSON) {
    const [row] = await knex('user_entity_role')
      .select('role')
      .where({
        entity_id: id,
        user_id,
      });

    role = row.role;
  } else {
    const [row] = await knex('entities_role')
      .select('role')
      .leftJoin(
        'user_entity_role',
        'entities_role.entity_id_admin',
        '=',
        'user_entity_role.entity_id',
      )
      .where('entities_role.entity_id', id)
      .andWhere('user_entity_role.user_id', user_id);
    role = row.role;
  }

  return { ...entity, role };
}

async function updateEntityRole(entity_id, entity_id_admin, role) {
  const [entity] = await knex('entities_role')
    .update({ role })
    .where({ entity_id, entity_id_admin })
    .returning(['role']);
  return entity;
}

async function updateEntityName(entity_id, name) {
  return knex('entities_name')
    .update({ name })
    .where({ entity_id })
    .returning(['entity_id', 'name']);
}

async function updateEntityPhoto(entity_id, photo_url) {
  return knex('entities_photo')
    .update({ photo_url })
    .where({ entity_id })
    .returning(['entity_id', 'photo_url']);
}

async function addEntityRole(entity_id, entity_id_admin, role) {
  return knex('entities_role')
    .insert({ entity_id, entity_id_admin, role })
    .returning(['entity_id', 'entity_id_admin', 'role']);
}

async function getUsersAuthorization(id) {
  const res = await knex('user_entity_role')
    .select(['user_id', 'entities_role.role'])
    .leftJoin(
      'entities_role',
      'user_entity_role.entity_id',
      '=',
      'entities_role.entity_id_admin',
    )
    .where('entities_role.entity_id', id);

  return res;
}

module.exports = {
  addEntity,
  getEntity,
  getAllEntities,
  getAllTypeEntities,
  getAllRolesEntity,
  updateEntityName,
  updateEntityPhoto,
  updateEntityRole,
  addEntityRole,
  getUsersAuthorization,
};
