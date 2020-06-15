const knex = require('../connection');

async function getAllEntities() {
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
  getAllEntities,
  getAllTypeEntities,
  getEntity,
  updateEntityName,
  updateEntityPhoto,
  getAllRolesEntity,
  getUsersAuthorization,
};
