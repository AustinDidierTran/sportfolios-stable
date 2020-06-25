const knex = require('../connection');

const {
  ENTITIES_ROLE_ENUM,
  GLOBAL_ENUM,
} = require('../../../../common/enums');

const addEntity = async (body, user_id) => {
  const { name, creator, surname, type } = body;

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

    switch (Number(type)) {
      case GLOBAL_ENUM.TEAM:
      case GLOBAL_ENUM.ORGANIZATION: {
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

        if (type === GLOBAL_ENUM.ORGANIZATION) {
          const [organization] = await knex('organizations')
            .insert({ id: entity_id })
            .returning(['id'])
            .transacting(trx);

          return organization;
        }

        if (type === GLOBAL_ENUM.TEAM) {
          const [team] = await knex('teams')
            .insert({ id: entity_id })
            .returning(['id'])
            .transacting(trx);

          return team;
        }
      }
      case GLOBAL_ENUM.PERSON: {
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
      case GLOBAL_ENUM.EVENT: {
        const insertObj = {
          entity_id,
          role: ENTITIES_ROLE_ENUM.ADMIN,
          entity_id_admin: creator,
        };

        await knex('entities_role')
          .insert(insertObj)
          .transacting(trx);

        const [event] = await knex('events')
          .insert({ id: entity_id })
          .returning(['id'])
          .transacting(trx);

        return event;
      }
    }
  });
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
    .select(
      'entity_id_admin',
      'role',
      'name',
      'surname',
      'photo_url',
      'type',
    )
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
    .leftJoin(
      'entities',
      'entities_role.entity_id_admin',
      '=',
      'entities.id',
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

  const role = await getEntityRole(id, user_id);

  return {
    id: entity.id,
    type: entity.type,
    name: entity.name,
    surname: entity.surname,
    photoUrl: entity.photo_url,
    role,
  };
}
const findRole = async (entity_id, lookedFor, role, cpt) => {
  if (cpt > 5) {
    return role;
  }
  const entities = await knex('entities_role')
    .select('*')
    .where({ entity_id });

  const roles = await Promise.all(
    entities.map(async entity => {
      const maxRole = Math.max(entity.role, role);
      if ((entity.entity_id = lookedFor)) {
        return maxRole;
      } else {
        return findRole(
          entity.entity_id_admin,
          lookedFor,
          maxRole,
          cpt + 1,
        );
      }
    }),
  );

  return Math.min(...roles);
};

async function getEntityRole(entity_id, user_id) {
  const entities = await knex('user_entity_role')
    .select('*')
    .where({ user_id });

  const roles = await Promise.all(
    entities.map(async entity => {
      if (entity.entity_id === entity_id) {
        return entity.role;
      } else {
        return findRole(entity.entity_id, entity_id, entity.role, 0);
      }
    }),
  );

  return Math.min(...roles);
}

async function getUsersAuthorization(id) {
  const [{ type } = {}] = await knex('entities')
    .select('type')
    .where('entities_role.entity_id', id);

  if (!type) {
    return null;
  }

  if (type === GLOBAL_ENUM.PERSON) {
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

async function addMembership(
  entity_id,
  membership_type,
  length,
  fixed_date,
  price,
) {
  const [res] = await knex('entity_memberships')
    .insert({
      entity_id,
      membership_type,
      length,
      fixed_date,
      price,
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

const deleteEntityMembership = async (
  entity_id,
  membership_type_props,
  length_props,
  fixed_date,
) => {
  const membership_type = Number(membership_type_props);
  const length = Number(length_props);

  await knex('entity_memberships')
    .where({
      entity_id,
      membership_type,
      length,
      fixed_date,
    })
    .del();
};

module.exports = {
  addEntity,
  addEntityRole,
  addMember,
  addMembership,
  deleteEntity,
  deleteEntityMembership,
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
