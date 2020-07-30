const knex = require('../connection');

const { getMembershipName } = require('../../../../common/functions');

const {
  ENTITIES_ROLE_ENUM,
  GLOBAL_ENUM,
} = require('../../../../common/enums');
const { addProduct, addPrice } = require('./stripe/shop');
const { ERROR_ENUM } = require('../../../../common/errors');

const addEntity = async (body, userId) => {
  const { name, creator, surname, type } = body;

  if (
    (name && name.length > 64) ||
    (surname && surname.length > 64)
  ) {
    throw ERROR_ENUM.VALUE_IS_INVALID;
  }
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

    await knex('entities_general_infos')
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
          .andWhere('entities.type', GLOBAL_ENUM.PERSON)
          .transacting(trx);

        await knex('entities_role')
          .insert({
            entity_id: entityId,
            entity_id_admin: entityIdAdmin,
            role: ENTITIES_ROLE_ENUM.ADMIN,
          })
          .transacting(trx);

        return entityId;
      }
      case GLOBAL_ENUM.PERSON: {
        await knex('user_entity_role')
          .insert({
            user_id: userId,
            entity_id: entityId,
            role: ENTITIES_ROLE_ENUM.ADMIN,
          })
          .transacting(trx);
      }
      case GLOBAL_ENUM.EVENT: {
        let entity_id_admin;
        if (creator) {
          entity_id_admin = creator;
        } else {
          const [{ id: entityIdAdmin } = {}] = await knex('entities')
            .select('id')
            .leftJoin(
              'user_entity_role',
              'user_entity_role.entity_id',
              '=',
              'entities.id',
            )
            .where('user_entity_role.user_id', userId)
            .andWhere('entities.type', GLOBAL_ENUM.PERSON)
            .transacting(trx);

          entity_id_admin = entityIdAdmin;
        }
        const insertObj = {
          entity_id: entityId,
          role: ENTITIES_ROLE_ENUM.ADMIN,
          entity_id_admin,
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

async function getAllOwnedEntities(type, userId) {
  const entities = await knex('entities')
    .select('id', 'type', 'name', 'surname', 'photo_url', 'role')
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
    .leftJoin(
      'entities_role',
      'entities.id',
      '=',
      'entities_role.entity_id',
    )
    .whereNull('deleted_at')
    .where({ type });

  const res = await Promise.all(
    entities.map(async entity => {
      const role = await getEntityRole(entity.id, userId);
      return { ...entity, role };
    }),
  );

  const res2 = res
    .filter(({ role }) => {
      return (
        role === ENTITIES_ROLE_ENUM.ADMIN ||
        role === ENTITIES_ROLE_ENUM.EDITOR
      );
    })
    .map(e => {
      const { photo_url: photoUrl, ...otherProps } = e;
      return { ...otherProps, photoUrl };
    });
  return res2;
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

async function getCreator(id) {
  const [creator] = await knex('entities_role')
    .select('*')
    .where({ entity_id: id, role: 1 });

  const data = await getEntity(creator.entity_id_admin);
  return data;
}

async function eventInfos(id, userId) {
  const entity = await getEntity(id);
  const role = await getEntityRole(id, userId);
  const event = await getEvent(id);
  const infos = await getGeneralInfos(id);
  const creator = await getCreator(id);

  return {
    id: entity.id,
    type: entity.type,
    name: entity.name,
    surname: entity.surname,
    photoUrl: entity.photoUrl,
    role,
    maximumSpots: event.maximum_spots,
    startDate: event.start_date,
    endDate: event.end_date,
    description: infos.description,
    creator: {
      id: creator.id,
      type: creator.type,
      name: creator.name,
      surname: creator.surname,
      photoUrl: creator.photoUrl,
    },
  };
}

const findRole = async (entityId, lookedFor, role, cpt) => {
  if (cpt > 5) {
    return ENTITIES_ROLE_ENUM.VIEWER;
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
      if (entity.entity_id === lookedFor) {
        return maxRole;
      } else {
        return findRole(
          entity.entity_id,
          lookedFor,
          maxRole,
          cpt + 1,
        );
      }
    }),
  );

  return Math.min(...roles, ENTITIES_ROLE_ENUM.VIEWER);
};

async function getEntityRole(entityId, userId) {
  if (!userId) {
    return ENTITIES_ROLE_ENUM.VIEWER;
  }
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
    .rightJoin(
      'entities',
      'entities.id',
      '=',
      'memberships.person_id',
    )
    .whereIn('entities.id', persons)
    .andWhere('entities.type', '=', GLOBAL_ENUM.PERSON)
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
  const res = await knex('event_payment_options')
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

  return res.map(r => ({
    ...r,
    start_time: new Date(r.start_time).getTime(),
    end_time: new Date(r.end_time).getTime(),
  }));
}

async function getMemberships(entityId) {
  return knex('entity_memberships')
    .select('*')
    .where({ entity_id: entityId });
}

async function getRegistered(teamId, eventId) {
  const rosters = await knex('team_rosters')
    .select('id')
    .where({ team_id: teamId });
  const rostersId = rosters.map(roster => roster.id);
  return knex('event_rosters')
    .select('*')
    .where({ event_id: eventId })
    .whereIn('roster_id', rostersId);
}

async function getAllRegistered(eventId, userId) {
  const teams = await knex('event_rosters')
    .select('*')
    .where({ event_id: eventId });

  const props = await Promise.all(
    teams.map(async t => {
      const entity = await getEntity(t.team_id, userId);
      const emails = await getEmailsEntity(t.team_id);
      return {
        name: entity.name,
        surname: entity.surname,
        photoUrl: entity.photoUrl,
        rosterId: t.roster_id,
        teamId: t.team_id,
        invoiceItemId: t.invoice_item_id,
        status: t.status,
        emails,
      };
    }),
  );
  return props;
}

const getRosterInvoiceItem = async body => {
  const { eventId, rosterId } = body;

  const [{ invoice_item_id: invoiceItemId, status }] = await knex(
    'event_rosters',
  )
    .select(['invoice_item_id', 'status'])
    .where({ roster_id: rosterId, event_id: eventId });

  return { invoiceItemId, status };
};

const unregister = async body => {
  const { rosterId, eventId } = body;
  await deleteRegistration(rosterId, eventId);
};

async function getEmailsEntity(entity_id) {
  const emails = await knex('entities_role')
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
    .where('entities_role.entity_id', entity_id);
  return emails;
}

async function getEvent(eventId) {
  const [res] = await knex('events')
    .select('*')
    .where({ id: eventId });
  return res;
}

async function getGeneralInfos(entityId) {
  const [res] = await knex('entities_general_infos')
    .select('*')
    .where({ entity_id: entityId });
  return res;
}

async function updateEntityRole(entityId, entityIdAdmin, role) {
  const [entity] = await knex('entities_role')
    .update({ role })
    .where({ entity_id: entityId, entity_id_admin: entityIdAdmin })
    .returning(['role']);
  return entity;
}

async function updateEvent(
  eventId,
  maximumSpots,
  eventStart,
  eventEnd,
) {
  const maximum_spots = Number(maximumSpots);
  const [entity] = await knex('events')
    .update({
      maximum_spots,
      start_date: eventStart,
      end_date: eventEnd,
    })
    .where({ id: eventId })
    .returning('*');
  return entity;
}

async function updateGeneralInfos(entityId, description) {
  const [entity] = await knex('entities_general_infos')
    .update({
      description,
    })
    .where({ entity_id: entityId })
    .returning('*');
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

const deleteRegistration = async (rosterId, eventId) => {
  return knex.transaction(async trx => {
    await knex('event_rosters')
      .where({
        roster_id: rosterId,
        event_id: eventId,
      })
      .del()
      .transacting(trx);

    await knex('team_players')
      .where({ roster_id: rosterId })
      .del()
      .transacting(trx);

    await knex('team_rosters')
      .where({
        id: rosterId,
      })
      .del()
      .transacting(trx);
  });
};

async function updateRegistration(
  rosterId,
  eventId,
  invoiceItemId,
  status,
) {
  return knex('event_rosters')
    .update({
      invoice_item_id: invoiceItemId,
      status,
    })
    .where({
      event_id: eventId,
      roster_id: rosterId,
    });
}

async function addEntityRole(entityId, entityIdAdmin, role) {
  const [res] = await knex('entities_role')
    .insert({
      entity_id: entityId,
      entity_id_admin: entityIdAdmin,
      role,
    })
    .returning('role');
  return res;
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
  eventId,
  name,
  price,
  endTime,
  startTime,
  userId,
) {
  const entity = await getEntity(eventId, userId);

  const stripeProduct = {
    name,
    active: true,
    description: entity.name,

    // TODO: Add entity seller id
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
      end_time: new Date(endTime),
      start_time: new Date(startTime),
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

async function addTeamToEvent(
  teamId,
  eventId,
  invoiceItemId,
  status,
  registration_status,
) {
  return knex.transaction(async trx => {
    const [roster] = await knex('team_rosters')
      .insert({ team_id: teamId })
      .returning('*')
      .transacting(trx);

    const [res] = await knex('event_rosters')
      .insert({
        roster_id: roster.id,
        team_id: teamId,
        event_id: eventId,
        invoice_item_id: invoiceItemId,
        status,
        registration_status,
      })
      .returning('*')
      .transacting(trx);
    return res;
  });
}

async function addRoster(rosterId, roster) {
  const res = await Promise.all(
    roster.map(async person => {
      await knex('team_players')
        .insert({
          roster_id: rosterId,
          person_id: person.person_id,
          name: person.name,
        })
        .returning('*');
    }),
  );
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
  return knex('entities_role')
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
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  } else {
    await knex('entities')
      .where({ id: entityId })
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
  return knex('event_payment_options')
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
  addRoster,
  addTeamToEvent,
  deleteEntity,
  deleteEntityMembership,
  deleteOption,
  deleteRegistration,
  getAllEntities,
  getAllOwnedEntities,
  getAllRolesEntity,
  getAllTypeEntities,
  getCreator,
  getEntity,
  getEntityRole,
  getMembers,
  getMemberships,
  getRegistered,
  getAllRegistered,
  getEvent,
  getGeneralInfos,
  getOptions,
  removeEntityRole,
  unregister,
  getRosterInvoiceItem,
  updateEntityName,
  updateEntityPhoto,
  updateEntityRole,
  updateEvent,
  updateGeneralInfos,
  updateMember,
  updateRegistration,
  eventInfos,
};
