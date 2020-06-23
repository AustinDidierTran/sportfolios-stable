const knex = require('../connection');

const {
  ENTITIES_ROLE_ENUM,
  ENTITIES_TYPE_ENUM,
} = require('../../../../common/enums');

const addEntity = async (body, user_id) => {
  const { name, surname, type } = body;

  return knex.transaction(async trx => {
    const [{ id: entity_id } = {}] = await knex('entities')
      .insert({ type })
      .returning(['id'])
      .transacting(trx);

    await knex('entities_name')
      .insert({
        entity_id,
        name,
        surname,
      })
      .transacting(trx);

    await knex('entities_photo')
      .insert({
        entity_id,
      })
      .transacting(trx);

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
        .where('user_entity_role.user_id', user_id)
        .transacting(trx);

      await knex('entities_role')
        .insert({
          entity_id,
          entity_id_admin,
          role: ENTITIES_ROLE_ENUM.ADMIN,
        })
        .transacting(trx);

      if (type === ENTITIES_TYPE_ENUM.ORGANIZATION) {
        const [organization] = await knex('organizations')
          .insert({ id: entity_id })
          .returning(['id'])
          .transacting(trx);

        return organization;
      }
      if (type === ENTITIES_TYPE_ENUM.TEAM) {
        const [team] = await knex('teams')
          .insert({ id: entity_id })
          .returning(['id'])
          .transacting(trx);

        return team;
      }
    } else if (ENTITIES_TYPE_ENUM.PERSON === type) {
      await knex('user_entity_role')
        .insert({
          user_id,
          entity_id,
          role: ENTITIES_ROLE_ENUM.ADMIN,
        })
        .transacting(trx);

      const [person] = await knex('persons')
        .insert({ id: entity_id })
        .returning(['id'])
        .transacting(trx);

      return person;
    }
  });
};

const deleteEntity = async (entity_id, user_id) => {
  const [{ role } = {}] = await knex('user_entity_role')
    .select('entities_role.role')
    .leftJoin(
      'entities_role',
      'entities_role.entity_id_admin',
      '=',
      'user_entity_role.entity_id',
    )
    .where('entities_role.entity_id', entity_id)
    .andWhere('user_entity_role.user_id', user_id);

  if (role !== ENTITIES_ROLE_ENUM.ADMIN) {
    throw 'Access denied';
  } else {
    await knex('entities')
      .where({ id: entity_id })
      .del();
  }
};

async function getAllEntities(params) {
  const { type } = params;

  if (type) {
    const entities = await knex('entities')
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
      .whereNull('deleted_at')
      .where({ type });

    return entities.map(e => ({
      id: e.id,
      name: e.name,
      photoUrl: e.photo_url,
      surname: e.surname,
      type,
    }));
  }

  const entities = await knex('entities')
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
    );

  return entities.map(e => ({
    id: e.id,
    name: e.name,
    photoUrl: e.photo_url,
    surname: e.surname,
    type: e.type,
  }));
}

async function getAllTypeEntities(type) {
  const entities = await knex('entities')
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
    .whereNull('deleted_at')
    .where({ type });

  return entities.map(e => {
    const { photo_url: photoUrl, ...otherProps } = e;

    return { ...otherProps, photoUrl };
  });
}

async function getAllRolesEntity(entity_id) {
  const entities_role = await knex('entities_role')
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

  return entities_role.map(e => {
    const { photo_url: photoUrl, ...otherProps } = e;

    return { ...otherProps, photoUrl };
  });
}

async function getEntity(id, user_id) {
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
    .whereNull('deleted_at')
    .andWhere({ id });

  let role;

  if (entity.type === ENTITIES_TYPE_ENUM.PERSON) {
    const [row = {}] = await knex('user_entity_role')
      .select('role')
      .where({
        entity_id: id,
        user_id,
      });

    role = row.role;
  } else {
    const [row = {}] = await knex('entities_role')
      .select('entities_role.role')
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

  return {
    id: entity.id,
    type: entity.type,
    name: entity.name,
    surname: entity.surname,
    photoUrl: entity.photo_url,
    role,
  };
}

async function getMembers(personsString, organization_id) {
  const persons = personsString.split(',');
  const members = await knex('memberships')
    .select('*')
    .rightJoin('persons', 'persons.id', '=', 'memberships.person_id')
    .whereIn('persons.id', persons)
    .andWhere({ organization_id });
  return members.map(m => ({
    organizationId: m.organization_id,
    personId: m.person_id,
    memberType: m.member_type,
    expirationDate: m.expiration_date,
    id: m.id,
  }));
}

async function getMemberships(entity_id) {
  return await knex('entity_memberships')
    .select('*')
    .where({ entity_id });
}

async function updateEntityRole(entity_id, entity_id_admin, role) {
  const [entity] = await knex('entities_role')
    .update({ role })
    .where({ entity_id, entity_id_admin })
    .returning(['role']);
  return entity;
}

async function updateEntityName(entity_id, name, surname) {
  return knex('entities_name')
    .update({ name, surname })
    .where({ entity_id });
}

async function updateEntityPhoto(entity_id, photo_url) {
  return knex('entities_photo')
    .update({ photo_url })
    .where({ entity_id });
}

async function addEntityRole(entity_id, entity_id_admin, role) {
  return knex('entities_role')
    .insert({
      entity_id,
      entity_id_admin,
      role,
    })
    .returning(['role']);
}

async function getUsersAuthorization(id) {
  const [{ type } = {}] = await knex('entities')
    .select('type')
    .where('entities_role.entity_id', id);

  if (!type) {
    return null;
  }

  if (type === ENTITIES_TYPE_ENUM.PERSON) {
    return knex('user_entity_role')
      .select(['user_id', 'role'])
      .where({ entity_id: id });
  }

  return knex('user_entity_role')
    .select(['user_id', 'entities_role.role'])
    .leftJoin(
      'entities_role',
      'user_entity_role.entity_id',
      '=',
      'entities_role.entity_id_admin',
    )
    .where('entities_role.entity_id', id);
}

async function addMember(
  member_type,
  organization_id,
  person_id,
  expiration_date,
) {
  const [res] = await knex('memberships')
    .insert({
      member_type,
      organization_id,
      person_id,
      expiration_date,
    })
    .returning('*');
  return res;
}

async function updateMember(
  member_type,
  organization_id,
  person_id,
  expiration_date,
) {
  const [res] = await knex('memberships')
    .where({ member_type, organization_id, person_id })
    .update({
      expiration_date,
    })
    .returning('*');
  return res;
}

async function removeEntityRole(entity_id, entity_id_admin) {
  return await knex('entities_role')
    .where({ entity_id, entity_id_admin })
    .del();
}

module.exports = {
  addEntity,
  addEntityRole,
  addMember,
  deleteEntity,
  getAllEntities,
  getAllRolesEntity,
  getAllTypeEntities,
  getEntity,
  getMembers,
  getMemberships,
  getUsersAuthorization,
  removeEntityRole,
  updateEntityName,
  updateEntityPhoto,
  updateEntityRole,
  updateMember,
};
