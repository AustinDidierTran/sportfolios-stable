const knex = require('../../db/connection');

function getAllAssociations(includeDeleted) {
  if (includeDeleted && includeDeleted !== 'false') {
    return knex('organizations').select(['id', 'name']);
  } else {
    return knex('organizations')
      .select(['id', 'name'])
      .where({ deleted_at: null });
  }
}

function getSingleAssociation(id) {
  return knex('organizations')
    .select(['id', 'name'])
    .where({ id, deleted_at: null });
}

function addAssociation(association) {
  return knex('organizations')
    .insert(association)
    .returning(['id', 'name']);
}

function updateAssociation(id, association) {
  return knex('organizations')
    .update(association)
    .where({ id, deleted_at: null })
    .returning(['id', 'name']);
}

function deleteAssociation(id) {
  return knex('organizations')
    .where('id', id)
    .del();
}

function restoreAssociation(id) {
  return knex('organizations')
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
