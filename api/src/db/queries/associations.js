const knex = require('../connection');

function getAllAssociations() {
  return knex('associations').select('*');
}

function getSingleAssociation(id) {
  return knex('associations').select('*').where({ id: parseInt(id) });
}

function addAssociation(association) {
  return knex('associations').insert(association).returning('*');
}

function updateAssociation(id, association) {
  return knex('associations').update(association).where({ id: parseInt(id) }).returning('*');
}

function deleteAssociation(id) {
  return knex('associations').del().where({ id: parseInt(id) }).returning('*');
}

module.exports = {
  addAssociation,
  deleteAssociation,
  getAllAssociations,
  getSingleAssociation,
  updateAssociation,
}
