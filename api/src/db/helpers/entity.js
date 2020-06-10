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

async function getEntity(id) {
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
  return entity;
}

async function updateEntityName(entity_id, name) {
  return await knex('entities_name')
    .update({ name })
    .where({ entity_id })
    .returning(['entity_id', 'name']);
}

async function updateEntityPhoto(entity_id, photo_url) {
  return await knex('entities_photo')
    .update({ photo_url })
    .where({ entity_id })
    .returning(['entity_id', 'photo_url']);
}

module.exports = {
  getAllEntities,
  getAllTypeEntities,
  getEntity,
  updateEntityName,
  updateEntityPhoto,
};
