const knex = require('../connection');

function getAllAssociations(includeDeleted) {
  if (includeDeleted && includeDeleted !== 'false') {
    return knex('associations').select(['id', 'name']);
  } else {
    return knex('associations')
      .select(['id', 'name'])
      .where({ deleted_at: null });
  }
}

function getSingleAssociation(id) {
  return knex('associations')
    .select(['id', 'name'])
    .where({ id, deleted_at: null });
}

function addAssociation(association) {
  return knex('associations')
    .insert(association)
    .returning(['id', 'name']);
}

function updateAssociation(id, association) {
  return knex('associations')
    .update(association)
    .where({ id, deleted_at: null })
    .returning(['id', 'name']);
}

function deleteAssociation(id) {
  return knex('associations')
    .where('id', id)
    .del();
}

function restoreAssociation(id) {
  return knex('associations')
    .update({ deleted_at: null })
    .where({ id })
    .returning(['id', 'name']);
}

module.exports = {
  addAssociation,
  deleteAssociation,
  getAllAssociations,
  getSingleAssociation,
  restoreAssociation,
  updateAssociation,
};
