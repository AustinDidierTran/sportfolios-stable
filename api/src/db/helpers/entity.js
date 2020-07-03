const knex = require('../connection');

const { getMembershipName } = require('../../../../common/functions');

const {
  ENTITIES_ROLE_ENUM,
  GLOBAL_ENUM,
} = require('../../../../common/enums');
const { addProduct, addPrice } = require('./stripe/shop');

const addEntity = async (body, userId) => {
  const { name, creator, surname, type } = body;

  return knex.transaction(async trx => {
    const [{ id: entityId } = {}] = await knex('entities')
      .insert({ type })
      .returning(['id'])
      .transacting(trx);

    await knex('entities_name')
      .insert({
        entity_id: entityId,
        name,
        surname,
      })
      .transacting(trx);

    await knex('entities_photo')
      .insert({
        entity_id: entityId,
      })
      .transacting(trx);

    switch (Number(type)) {
      case GLOBAL_ENUM.TEAM:
      case GLOBAL_ENUM.ORGANIZATION: {
        const [{ id: entityIdAdmin } = {}] = await knex('entities')
          .select('id')
          .leftJoin(
            'user_entity_role',
            'user_entity_role.entity_id',
            '=',
            'entities.id',
          )
          .where('user_entity_role.user_id', userId)
          .andWhere('entities.type', 1)
          .transacting(trx);

        await knex('entities_role')
          .insert({
            entity_id: entityId,
            entity_id_admin: entityIdAdmin,
            role: ENTITIES_ROLE_ENUM.ADMIN,
          })
          .transacting(trx);

        if (Number(type) === GLOBAL_ENUM.ORGANIZATION) {
          const [organization] = await knex('organizations')
            .insert({ id: entityId })
            .returning(['id'])
            .transacting(trx);

          return organization;
        }

        if (Number(type) === GLOBAL_ENUM.TEAM) {
          const [team] = await knex('teams')
            .insert({ id: entityId })
            .returning(['id'])
            .transacting(trx);

          return team;
        }
      }
      case GLOBAL_ENUM.PERSON: {
        await knex('user_entity_role')
          .insert({
            userId,
            entityId,
            role: ENTITIES_ROLE_ENUM.ADMIN,
          })
          .transacting(trx);

        const [person] = await knex('persons')
          .insert({ id: entityId })
          .returning(['id'])
          .transacting(trx);

        return person;
      }
      case GLOBAL_ENUM.EVENT: {
        const insertObj = {
          entity_id: entityId,
          role: ENTITIES_ROLE_ENUM.ADMIN,
          entity_id_admin: creator,
        };

        await knex('entities_role')
          .insert(insertObj)
          .transacting(trx);

        const [event] = await knex('events')
          .insert({ id: entityId })
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

async function getAllRolesEntity(entityId) {
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
    .where('entities_role.entity_id', entityId);

  return entities_role.map(e => {
    const { photo_url: photoUrl, ...otherProps } = e;

    return { ...otherProps, photoUrl };
  });
}

async function getEntity(id, userId) {
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

  const role = await getEntityRole(id, userId);

  return {
    id: entity.id,
    type: entity.type,
    name: entity.name,
    surname: entity.surname,
    photoUrl: entity.photo_url,
    role,
  };
}
const findRole = async (entityId, lookedFor, role, cpt) => {
  if (cpt > 5) {
    return role;
  }
  const entities = await knex('entities_role')
    .select('*')
    .leftJoin(
      'entities',
      'entities.id',
      '=',
      'entities_role.entity_id',
    )
    .whereNull('entities.deleted_at')
    .where({ entity_id_admin: entityId });

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

async function getEntityRole(entityId, userId) {
  const entities = await knex('user_entity_role')
    .select('*')
    .leftJoin(
      'entities',
      'entities.id',
      '=',
      'user_entity_role.entity_id',
    )
    .whereNull('entities.deleted_at')
    .where({ user_id: userId });

  const roles = await Promise.all(
    entities.map(async entity => {
      if (entity.entity_id === entityId) {
        return entity.role;
      } else {
        return findRole(entity.entity_id, entityId, entity.role, 0);
      }
    }),
  );

  return Math.min(...roles);
}

async function getMembers(personsString, organizationId) {
  const persons = personsString.split(',');
  const members = await knex('memberships')
    .select('*')
    .rightJoin('persons', 'persons.id', '=', 'memberships.person_id')
    .whereIn('persons.id', persons)
    .andWhere({ organization_id: organizationId });
  return members.map(m => ({
    organizationId: m.organization_id,
    personId: m.person_id,
    memberType: m.member_type,
    expirationDate: m.expiration_date,
    id: m.id,
  }));
}

async function getOptions(eventId) {
  return await knex('event_payment_options')
    .select(
      'event_payment_options.name',
      'price',
      'start_time',
      'end_time',
      'id',
    )
    .leftJoin(
      'entities_name',
      'entities_name.entity_id',
      '=',
      'event_payment_options.event_id',
    )
    .where({ event_id: eventId });
}

async function getMemberships(entityId) {
  return await knex('entity_memberships')
    .select('*')
    .where({ entity_id: entityId });
}

async function getRegistered(teamId, eventId) {
  const rosters = await knex('team_rosters')
    .select('id')
    .where({ team_id: teamId });
  const rostersId = rosters.map(roster => roster.id);

  return await knex('event_rosters')
    .select('*')
    .where({ event_id: eventId })
    .whereIn('roster_id', rostersId);
}

async function updateEntityRole(entityId, entityIdAdmin, role) {
  const [entity] = await knex('entities_role')
    .update({ role })
    .where({ entity_id: entityId, entity_id_admin: entityIdAdmin })
    .returning(['role']);
  return entity;
}

async function updateEntityName(entityId, name, surname) {
  return knex('entities_name')
    .update({ name, surname })
    .where({ entity_id: entityId });
}

async function updateEntityPhoto(entityId, photo_url) {
  return knex('entities_photo')
    .update({ photo_url })
    .where({ entity_id: entityId });
}
async function updateRegistration(
  rosterId,
  eventId,
  invoiceId,
  status,
) {
  return knex('event_rosters')
    .update({ status })
    .where({
      event_id: eventId,
      invoice_id: invoiceId,
      roster_id: rosterId,
    });
}

async function addEntityRole(entityId, entityIdAdmin, role) {
  return knex('entities_role')
    .insert({
      entityId,
      entityIdAdmin,
      role,
    })
    .returning(['role']);
}

async function addMember(
  memberType,
  organizationId,
  personId,
  expirationDate,
) {
  const [res] = await knex('memberships')
    .insert({
      member_type: memberType,
      organization_id: organizationId,
      person_id: personId,
      expiration_date: expirationDate,
    })
    .returning('*');
  return res;
}

async function addOption(
  endTime,
  eventId,
  name,
  price,
  startTime,
  userId,
) {
  const entity = await getEntity(eventId, userId);

  const stripeProduct = {
    name,
    active: true,
    description: entity.name,
    metadata: { type: GLOBAL_ENUM.EVENT, id: eventId },
  };

  const product = await addProduct({ stripeProduct });
  const stripePrice = {
    currency: 'cad',
    unit_amount: price,
    active: true,
    product: product.id,
    metadata: { type: GLOBAL_ENUM.EVENT, id: eventId },
  };
  const priceStripe = await addPrice({
    stripePrice,
    entityId: eventId,
    photoUrl: entity.photoUrl,
  });
  const [res] = await knex('event_payment_options')
    .insert({
      id: priceStripe.id,
      event_id: eventId,
      name,
      price,
      end_time: endTime,
      start_time: startTime,
    })
    .returning('*');
  return res;
}

async function addMembership(
  entityId,
  membershipType,
  length,
  fixedDate,
  price,
  userId,
) {
  const entity = await getEntity(entityId, userId);

  const stripeProduct = {
    name: getMembershipName(membershipType),
    active: true,
    description: entity.name,
    metadata: { type: GLOBAL_ENUM.MEMBERSHIP, id: entityId },
  };
  const product = await addProduct({ stripeProduct });
  const stripePrice = {
    currency: 'cad',
    unit_amount: price,
    active: true,
    product: product.id,
    metadata: { type: GLOBAL_ENUM.MEMBERSHIP, id: entityId },
  };
  const priceStripe = await addPrice({
    stripePrice,
    entityId,
    photoUrl: entity.photoUrl,
  });

  const [res] = await knex('entity_memberships')
    .insert({
      stripe_price_id: priceStripe.id,
      entity_id: entityId,
      membership_type: membershipType,
      length,
      fixed_date: fixedDate,
      price,
    })
    .returning('*');
  return res;
}

async function addTeamToEvent(teamId, eventId, invoiceId, status) {
  const [roster] = await knex('team_rosters')
    .insert({ team_id: teamId })
    .returning('*');

  const [res] = await knex('event_rosters')
    .insert({
      roster_id: roster.id,
      event_id: eventId,
      invoice_id: invoiceId,
      status,
    })
    .returning('*');
  return res;
}

async function updateMember(
  memberType,
  organizationId,
  personId,
  expirationDate,
) {
  const [res] = await knex('memberships')
    .where({
      member_type: memberType,
      organization_id: organizationId,
      person_id: personId,
    })
    .update({
      expiration_date: expirationDate,
    })
    .returning('*');
  return res;
}

async function removeEntityRole(entityId, entityIdAdmin) {
  return await knex('entities_role')
    .where({ entity_id: entityId, entity_id_admin: entityIdAdmin })
    .del();
}

const deleteEntity = async (entityId, userId) => {
  const [{ role } = {}] = await knex('user_entity_role')
    .select('entities_role.role')
    .leftJoin(
      'entities_role',
      'entities_role.entity_id_admin',
      '=',
      'user_entity_role.entity_id',
    )
    .where('entities_role.entity_id', entityId)
    .andWhere('user_entity_role.user_id', userId);

  if (role !== ENTITIES_ROLE_ENUM.ADMIN) {
    throw 'Access denied';
  } else {
    await knex('entities')
      .where({ id: entity_id })
      .del();
  }
};

const deleteEntityMembership = async (
  entityId,
  membershipTypeProps,
  lengthProps,
  fixedDate,
) => {
  const membershipType = Number(membershipTypeProps);
  const length = Number(lengthProps);

  await knex('entity_memberships')
    .where({
      entity_id: entityId,
      membership_type: membershipType,
      length,
      fixed_date: fixedDate,
    })
    .del();
};

const deleteOption = async id => {
  return await knex('event_payment_options')
    .where({
      id,
    })
    .del();
};

module.exports = {
  addEntity,
  addEntityRole,
  addMember,
  addMembership,
  addOption,
  addTeamToEvent,
  deleteEntity,
  deleteEntityMembership,
  deleteOption,
  getAllEntities,
  getAllRolesEntity,
  getAllTypeEntities,
  getEntity,
  getEntityRole,
  getMembers,
  getMemberships,
  getRegistered,
  getOptions,
  removeEntityRole,
  updateEntityName,
  updateEntityPhoto,
  updateEntityRole,
  updateMember,
  updateRegistration,
};
