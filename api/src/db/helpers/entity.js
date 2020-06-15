const knex = require('../connection');

const {
  ENTITIES_ROLE_ENUM,
  ENTITIES_TYPE_ENUM,
} = require('../../../../common/enums');

const addEntity = async (body, user_id) => {
  const { name, type } = body;

  const [{ id: entity_id } = {}] = await knex('entities')
    .insert({ type })
    .returning(['id']);

  await knex('entities_name').insert({
    entity_id,
    name,
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
    .select('id', 'type', 'name', 'surname', 'photo_url')
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
  return await knex('entities_role')
    .select('entity_id_admin', 'role', 'name', 'surname', 'photo_url')
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

async function getEntity(id) {
  const [entity] = await knex('entities')
    .select('id', 'type', 'name', 'surname', 'photo_url')
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
  return entity;
}

async function updateEntityName(entity_id, name, surname) {
  const update = {};
  if (name) {
    update.name = name;
  }
  if (surname) {
    update.surname = surname;
  }
  return await knex('entities_name')
    .update(update)
    .where({ entity_id })
    .returning(['entity_id', 'name', 'surname']);
}

async function updateEntityPhoto(entity_id, photo_url) {
  return await knex('entities_photo')
    .update({ photo_url })
    .where({ entity_id })
    .returning(['entity_id', 'photo_url']);
}

async function getUsersAuthorization(id) {
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

  return userId;
}

module.exports = {
  addEntity,
  getAllEntities,
  getAllTypeEntities,
  getEntity,
  updateEntityName,
  updateEntityPhoto,
  getAllRolesEntity,
  getUsersAuthorization,
};
