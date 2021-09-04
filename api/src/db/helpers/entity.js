import knex from '../connection.js';

function getEmailsEntity(entityId) {
  return knex('entities_role')
    .select('email')
    .leftJoin(
      'user_entity_role',
      'user_entity_role.entity_id',
      '=',
      'entities_role.entity_id_admin',
    )
    .leftJoin(
      'user_email',
      'user_email.user_id',
      '=',
      'user_entity_role.user_id',
    )
    .where('entities_role.entity_id', entityId);
}

export { getEmailsEntity };
