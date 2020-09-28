const knex = require('../connection');

const { getMembershipName } = require('../../../../common/functions');
const { getBasicUserInfoFromId } = require('./index');
const {
  ENTITIES_ROLE_ENUM,
  GLOBAL_ENUM,
  ROSTER_ROLE_ENUM,
  TAG_TYPE_ENUM,
  CARD_TYPE_ENUM,
  REGISTRATION_STATUS_ENUM,
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

        return { id: entityId };
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

async function getEntitiesName(entityId) {
  const realId = await getRealId(entityId);

  const [name] = await knex('entities_name')
    .select('name', 'surname')
    .where({ entity_id: realId });
  return name;
}

async function getOwnedEvents(organizationId) {
  const realId = await getRealId(organizationId);
  const events = await knex('entities')
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
    .leftJoin(
      'entities_role',
      'entities.id',
      '=',
      'entities_role.entity_id',
    )
    .whereNull('deleted_at')
    .where('entities_role.entity_id_admin', '=', realId)
    .andWhere('entities_role.role', '=', ENTITIES_ROLE_ENUM.ADMIN)
    .andWhere('entities.type', '=', GLOBAL_ENUM.EVENT);
  return events;
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
  const realId = await getRealId(entityId);

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
    .where('entities_role.entity_id', realId);

  return entities_role.map(e => {
    const { photo_url: photoUrl, ...otherProps } = e;

    return { ...otherProps, photoUrl };
  });
}

async function getAllForYouPagePosts() {
  const events = await knex('events_infos')
    .select('*')
    .whereNull('deleted_at');
  const merch = await knex('store_items_all_infos')
    .select('*')
    .leftJoin(
      'stripe_price',
      'stripe_price.stripe_price_id',
      '=',
      'store_items_all_infos.stripe_price_id',
    )
    .where('store_items_all_infos.active', true);

  const fullEvents = await Promise.all(
    events.map(async event => {
      const { creator_id: creatorId } = event;
      const creator = await getEntity(creatorId);
      return {
        type: GLOBAL_ENUM.EVENT,
        cardType: CARD_TYPE_ENUM.EVENT,
        eventId: event.id,
        photoUrl: event.photo_url,
        startDate: event.start_date,
        endDate: event.end_date,
        quickDescription: event.quick_description,
        description: event.description,
        location: event.location,
        name: event.name,
        createdAt: event.created_at,
        creator: {
          id: creator.id,
          type: creator.type,
          name: creator.name,
          surname: creator.surname,
          photoUrl: creator.photoUrl,
        },
      };
    }),
  );
  const fullMerch = merch
    .filter(m => m.metadata.type === GLOBAL_ENUM.EVENT)
    .map(item => ({
      type: GLOBAL_ENUM.SHOP_ITEM,
      cardType: CARD_TYPE_ENUM.SHOP,
      label: item.label,
      amount: item.amount,
      photoUrl: item.photo_url,
      description: item.description,
      stripePriceId: item.stripe_price_id,
      stripeProductId: item.stripe_product_id,
      createdAt: item.created_at,
    }));

  return [...fullEvents, ...fullMerch].sort(
    (a, b) => b.createdAt - a.createdAt,
  );
}
async function getScoreSuggestion(
  event_id,
  id,
  start_time,
  name1,
  rosterId1,
  name2,
  rosterId2,
) {
  let realTime = new Date(start_time);
  const suggestions1 = await knex('score_suggestion')
    .select('*')
    .where({
      event_id,
      start_time: realTime,
      your_roster_id: rosterId1,
      opposing_roster_id: rosterId2,
    });
  const suggestions2 = await knex('score_suggestion')
    .select('*')
    .where({
      event_id,
      start_time: realTime,
      your_roster_id: rosterId2,
      opposing_roster_id: rosterId1,
    });
  return suggestions1.concat(suggestions2);
}

async function getRealId(id) {
  const [res] = await knex('alias')
    .select('id')
    .where({ alias: id });
  if (res) {
    return res.id;
  }
  return id;
}

async function getEntity(id, userId) {
  const realId = await getRealId(id);
  const [entity] = await knex('entities')
    .select(
      'id',
      'type',
      'name',
      'surname',
      'photo_url',
      'description',
      'quick_description',
    )
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
      'entities_general_infos',
      'entities_general_infos.entity_id',
      '=',
      'entities.id',
    )
    .whereNull('deleted_at')
    .andWhere({ id: realId });

  const role = await getEntityRole(realId, userId);
  return {
    description: entity.description,
    id: entity.id,
    type: entity.type,
    name: entity.name,
    quickDescription: entity.quick_description,
    surname: entity.surname,
    photoUrl: entity.photo_url,
    role,
  };
}

async function getCreator(id) {
  const realId = await getRealId(id);
  const [creator] = await knex('entities_role')
    .select('*')
    .where({ entity_id: realId, role: 1 });

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
    quickDescription: infos.quickDescription,
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
  const realId = await getRealId(entityId);
  const entities = await knex('entities_role')
    .select('*')
    .leftJoin(
      'entities',
      'entities.id',
      '=',
      'entities_role.entity_id',
    )
    .whereNull('entities.deleted_at')
    .where({ entity_id_admin: realId });

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
  const realId = await getRealId(entityId);
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
        return findRole(entity.entity_id, realId, entity.role, 0);
      }
    }),
  );
  return Math.min(...roles);
}

async function getMembers(personsString, organizationId) {
  const realId = await getRealId(organizationId);
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
    .andWhere({ organization_id: realId });
  return members.map(m => ({
    organizationId: m.organization_id,
    personId: m.person_id,
    memberType: m.member_type,
    expirationDate: m.expiration_date,
    id: m.id,
  }));
}

async function getOptions(eventId) {
  const realId = await getRealId(eventId);

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
    .where({ event_id: realId });

  return res.map(r => ({
    ...r,
    start_time: new Date(r.start_time).getTime(),
    end_time: new Date(r.end_time).getTime(),
  }));
}

async function getMemberships(entityId) {
  const realId = await getRealId(entityId);
  return knex('entity_memberships')
    .select('*')
    .where({ entity_id: realId });
}

async function getRegistered(teamId, eventId) {
  const realTeamId = await getRealId(teamId);
  const realEventId = await getRealId(eventId);
  const rosters = await knex('team_rosters')
    .select('id')
    .where({ team_id: realTeamId });
  const rostersId = rosters.map(roster => roster.id);
  return knex('event_rosters')
    .select('*')
    .where({ event_id: realEventId })
    .whereIn('roster_id', rostersId);
}

async function getTeamCaptains(teamId, userId) {
  const realId = await getRealId(teamId);
  const caps = await knex('entities_role')
    .select('entity_id_admin')
    .where('role', '=', ENTITIES_ROLE_ENUM.ADMIN)
    .andWhere('entity_id', '=', realId);

  const captainIds = caps.map(c => c.entity_id_admin);

  const captains = await Promise.all(
    captainIds.map(async id => {
      return getEntity(id, userId);
    }),
  );
  return captains;
}
async function getPaymentOption(rosterId) {
  const realId = await getRealId(rosterId);
  const [option] = await knex('event_payment_options')
    .select('id', 'name', 'price')
    .leftJoin(
      'event_rosters',
      'event_rosters.payment_option_id',
      '=',
      'event_payment_options.id',
    )
    .where('roster_id', '=', realId);
  return option;
}

async function getAllRegistered(eventId) {
  const realId = await getRealId(eventId);
  const teams = await knex('event_rosters')
    .select('*')
    .where({ event_id: realId });
  return teams;
}

async function getAllRegisteredInfos(eventId, userId) {
  const teams = await getAllRegistered(eventId);

  const props = await Promise.all(
    teams.map(async t => {
      const entity = await getEntity(t.team_id, userId);
      const emails = await getEmailsEntity(t.team_id);
      const players = await getRoster(t.roster_id);
      const captains = await getTeamCaptains(t.team_id, userId);
      const option = await getPaymentOption(t.roster_id);
      const role = await getRole(captains, t.roster_id, userId);
      const registrationStatus = await getRegistrationStatus(
        eventId,
        t.roster_id,
      );
      return {
        name: entity.name,
        surname: entity.surname,
        photoUrl: entity.photoUrl,
        rosterId: t.roster_id,
        teamId: t.team_id,
        invoiceItemId: t.invoice_item_id,
        status: t.status,
        emails,
        players,
        captains,
        option,
        role,
        registrationStatus,
      };
    }),
  );
  return props;
}
async function getRemainingSpots(eventId) {
  const realId = await getRealId(eventId);
  const [{ count }] = await knex('event_rosters')
    .count('team_id')
    .where({ event_id: realId });

  const [event] = await knex('events')
    .select('maximum_spots')
    .where({ id: realId });

  if (!event.maximum_spots) {
    return null;
  }
  return event.maximum_spots - Number(count);
}

async function getRegistrationStatus(eventId, rosterId) {
  const realEventId = await getRealId(eventId);
  const realRosterId = await getRealId(rosterId);
  const [registration] = await knex('event_rosters')
    .select('registration_status')
    .where({ roster_id: realRosterId, event_id: realEventId });

  return registration.registration_status;
}

async function getRoster(rosterId) {
  const realId = await getRealId(rosterId);
  const roster = await knex('team_players')
    .select('*')
    .where({ roster_id: realId });

  //TODO: Make a call to know if has created an account or is child account
  const status = TAG_TYPE_ENUM.REGISTERED;

  const props = roster.map(player => ({
    id: player.id,
    name: player.name,
    personId: player.person_id,
    isSub: player.is_sub,
    status: status,
  }));

  return props;
}

async function getRole(captains, rosterId, userId) {
  const realId = await getRealId(rosterId);
  if (!userId) {
    return ROSTER_ROLE_ENUM.VIEWER;
  }
  const basicInfo = await getBasicUserInfoFromId(userId);

  const personId = basicInfo.persons[0].entity_id;

  if (captains.some(c => c.id === personId)) {
    return ROSTER_ROLE_ENUM.CAPTAIN;
  }

  const [role] = await knex('team_players')
    .select('*')
    .where({ roster_id: realId, person_id: personId });

  if (!role) return ROSTER_ROLE_ENUM.VIEWER;
  return ROSTER_ROLE_ENUM.PLAYER;
}

const getRosterInvoiceItem = async body => {
  const { eventId, rosterId } = body;
  const realRosterId = await getRealId(rosterId);
  const realEventId = await getRealId(eventId);

  const [{ invoice_item_id: invoiceItemId, status }] = await knex(
    'event_rosters',
  )
    .select(['invoice_item_id', 'status'])
    .where({ roster_id: realRosterId, event_id: realEventId });

  return { invoiceItemId, status };
};

const unregister = async body => {
  const { rosterId, eventId } = body;
  const realRosterId = await getRealId(rosterId);
  const realEventId = await getRealId(eventId);
  await deleteRegistration(realRosterId, realEventId);
};

async function getEmailsEntity(entity_id) {
  const realId = await getRealId(entity_id);
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
    .where('entities_role.entity_id', realId);
  return emails;
}

async function getEvent(eventId) {
  const realId = await getRealId(eventId);
  const [res] = await knex('events')
    .select('*')
    .where({ id: realId });
  return res;
}

async function getAlias(entityId) {
  const realId = await getRealId(entityId);
  const [res] = await knex('alias')
    .select('*')
    .where({ id: realId });
  return res;
}

async function getPhases(eventId) {
  const realId = await getRealId(eventId);
  const res = await knex('phase')
    .select('*')
    .where({ event_id: realId });
  return res;
}

async function getGames(eventId) {
  const realId = await getRealId(eventId);
  const games = await knex('games')
    .select('*')
    .where({ event_id: realId });

  const res = await Promise.all(
    games.map(async game => {
      const teams = await getTeams(game.id);
      let phaseName = null;
      if (game.phase_id) {
        phaseName = await getPhaseName(game.phase_id);
      }
      return { ...game, phaseName, teams };
    }),
  );
  return res;
}

const getPhaseName = async phaseId => {
  const [{ name }] = await knex('phase')
    .select('name')
    .where({ id: phaseId });
  return name;
};

const getTeams = async gameId => {
  const teams = await knex('game_teams')
    .select('*')
    .where({ game_id: gameId });
  return teams;
};

async function getSlots(eventId) {
  const realId = await getRealId(eventId);
  const res = await knex('event_time_slots')
    .select('*')
    .where({ event_id: realId })
    .orderBy('date');
  return res;
}

async function getTeamsSchedule(eventId) {
  const realId = await getRealId(eventId);
  const res = await knex('schedule_teams')
    .select('*')
    .where({ event_id: realId });
  return res;
}

async function getFields(eventId) {
  const realId = await getRealId(eventId);
  const res = await knex('event_fields')
    .select('*')
    .where({ event_id: realId });
  return res;
}

async function getGeneralInfos(entityId) {
  const realId = await getRealId(entityId);
  const [res] = await knex('entities_general_infos')
    .select('*')
    .where({ entity_id: realId });
  return {
    entityId: res.entity_id,
    description: res.description,
    quickDescription: res.quick_description,
  };
}

async function updateEntityRole(entityId, entityIdAdmin, role) {
  const realEntityId = await getRealId(entityId);
  const realAdminId = await getRealId(entityIdAdmin);
  const [entity] = await knex('entities_role')
    .update({ role })
    .where({ entity_id: realEntityId, entity_id_admin: realAdminId })
    .returning(['role']);
  return entity;
}

async function updateEvent(
  eventId,
  maximumSpots,
  eventStart,
  eventEnd,
) {
  const realId = await getRealId(eventId);
  const maximum_spots = Number(maximumSpots);
  const [entity] = await knex('events')
    .update({
      maximum_spots,
      start_date: eventStart,
      end_date: eventEnd,
    })
    .where({ id: realId })
    .returning('*');
  return entity;
}

async function updateGeneralInfos(entityId, body) {
  const { description, quickDescription } = body;
  const realId = await getRealId(entityId);

  const updateQuery = {};

  if (description) {
    updateQuery.description = description;
  }

  if (quickDescription) {
    updateQuery.quick_description = quickDescription;
  }

  const [entity] = await knex('entities_general_infos')
    .update(updateQuery)
    .where({ entity_id: realId })
    .returning('*');
  return entity;
}

async function updateEntityName(entityId, name, surname) {
  const realId = await getRealId(entityId);
  return knex('entities_name')
    .update({ name, surname })
    .where({ entity_id: realId });
}

async function updateEntityPhoto(entityId, photo_url) {
  const realId = await getRealId(entityId);
  return knex('entities_photo')
    .update({ photo_url })
    .where({ entity_id: realId });
}

const deleteRegistration = async (rosterId, eventId) => {
  const realEventId = await getRealId(eventId);
  const realRosterId = await getRealId(rosterId);
  return knex.transaction(async trx => {
    await knex('event_rosters')
      .where({
        roster_id: realRosterId,
        event_id: realEventId,
      })
      .del()
      .transacting(trx);

    await knex('team_players')
      .where({ roster_id: realRosterId })
      .del()
      .transacting(trx);

    await knex('team_rosters')
      .where({
        id: realRosterId,
      })
      .del()
      .transacting(trx);
  });
};

const removeEventCartItem = async ({ rosterId }) => {
  const realId = await getRealId(rosterId);
  const res = await knex
    .select('id')
    .from(
      knex
        .select(knex.raw("id, metadata ->> 'rosterId' AS rosterId"))
        .from('cart_items')
        .as('cartItems'),
    )
    .where('cartItems.rosterid', realId);

  const ids = res.map(r => r.id);

  await knex('cart_items')
    .whereIn('id', ids)
    .del();

  return ids;
};

async function updateRegistration(
  rosterId,
  eventId,
  invoiceItemId,
  status,
) {
  const realRosterId = await getRealId(rosterId);
  const realEventId = await getRealId(eventId);
  return knex('event_rosters')
    .update({
      invoice_item_id: invoiceItemId,
      status,
    })
    .where({
      event_id: realEventId,
      roster_id: realRosterId,
    });
}

async function addEntityRole(entityId, entityIdAdmin, role) {
  const realEntityId = await getRealId(entityId);
  const realAdminId = await getRealId(entityIdAdmin);
  const [res] = await knex('entities_role')
    .insert({
      entity_id: realEntityId,
      entity_id_admin: realAdminId,
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
  const realId = await getRealId(organizationId);
  const [res] = await knex('memberships')
    .insert({
      member_type: memberType,
      organization_id: realId,
      person_id: personId,
      expiration_date: expirationDate,
    })
    .returning('*');
  return res;
}

async function addAlias(entityId, alias) {
  const realId = await getRealId(entityId);
  const [res] = await knex('alias')
    .insert({
      id: realId,
      alias,
    })
    .returning('*');
  return res;
}
async function getTeamName(team) {
  const [res] = await knex('team_rosters')
    .select('*')
    .leftJoin(
      'entities_name',
      'entities_name.entity_id',
      '=',
      'team_rosters.team_id',
    )
    .where({ id: team });
  return res.name;
}

async function addGame(
  eventId,
  phaseId,
  field,
  time,
  rosterId1,
  rosterId2,
  name1,
  name2,
) {
  const realId = await getRealId(eventId);
  let realTime = new Date(time);
  if (!time) {
    realTime = null;
  }
  const [res] = await knex('games')
    .insert({
      start_time: realTime,
      event_id: realId,
      field,
      phase_id: phaseId,
    })
    .returning('*');

  if (name1) {
    await knex('game_teams').insert({
      game_id: res.id,
      name: name1,
    });
  } else {
    const teamName = await getTeamName(rosterId1);
    await knex('game_teams').insert({
      game_id: res.id,
      name: teamName,
      roster_id: rosterId1,
    });
  }
  if (name2) {
    await knex('game_teams').insert({
      game_id: res.id,
      name: name2,
    });
  } else {
    const teamName = await getTeamName(rosterId2);
    await knex('game_teams').insert({
      game_id: res.id,
      name: teamName,
      roster_id: rosterId2,
    });
  }
  return res;
}

async function addScoreAndSpirit(props) {
  const { score, spirit, teamId, gameId } = props;
  const res = await knex('game_teams')
    .where({
      id: teamId,
      game_id: gameId,
    })
    .update({
      score: score,
      spirit: spirit,
    })
    .returning('*');
  return res;
}

async function addScoreSuggestion(
  eventId,
  startTime,
  yourTeamName,
  yourTeamId,
  yourScore,
  opposingTeamName,
  opposingTeamId,
  opposingTeamScore,
  opposingTeamSpirit,
  players,
  comments,
  suggestedBy,
) {
  let yourName = yourTeamName;
  if (yourTeamId) {
    yourName = await getTeamName(yourTeamId);
  }
  let opposingName = opposingTeamName;
  if (opposingTeamId) {
    opposingName = await getTeamName(opposingTeamId);
  }
  const realEventId = await getRealId(eventId);

  const res = await knex('score_suggestion')
    .insert({
      event_id: realEventId,
      start_time: new Date(startTime),
      your_team: yourName,
      your_roster_id: yourTeamId,
      your_score: yourScore,
      opposing_team: opposingName,
      opposing_roster_id: opposingTeamId,
      opposing_team_score: opposingTeamScore,
      opposing_team_spirit: opposingTeamSpirit,
      players,
      comments,
      created_by: suggestedBy,
    })
    .returning('*');
  return res;
}

async function addField(field, eventId) {
  const realId = await getRealId(eventId);
  const [res] = await knex('event_fields')
    .insert({
      field,
      event_id: realId,
    })
    .returning('*');
  return res;
}

async function addTeamToSchedule(eventId, name, rosterId) {
  const realId = await getRealId(eventId);
  if (
    !(await isInSchedule(realId, rosterId)) &&
    (await isAcceptedToEvent(realId, rosterId))
  ) {
    if (rosterId) {
      const [res] = await knex('schedule_teams')
        .insert({
          event_id: realId,
          name,
          roster_id: rosterId,
        })
        .returning('*');
      return res;
    }
    const [res] = await knex('schedule_teams')
      .insert({
        event_id: realId,
        name,
      })
      .returning('*');
    return res;
  }
}

async function isInSchedule(eventId, rosterId) {
  const [team] = await knex('schedule_teams')
    .select('*')
    .where({
      event_id: eventId,
      roster_id: rosterId,
    });
  return Boolean(team);
}

async function isAcceptedToEvent(eventId, rosterId) {
  const [status] = await knex('event_rosters')
    .select('registration_status')
    .where({
      event_id: eventId,
      roster_id: rosterId,
    });
  return (
    status.registration_status === REGISTRATION_STATUS_ENUM.ACCEPTED
  );
}

async function addRegisteredToSchedule(eventId) {
  const teams = await getAllRegistered(eventId);
  await Promise.all(
    teams.map(async t => {
      const name = await getEntitiesName(t.team_id);
      await addTeamToSchedule(eventId, name.name, t.roster_id);
    }),
  );
  return teams;
}

async function addPhase(phase, eventId) {
  const realId = await getRealId(eventId);
  const [res] = await knex('phase')
    .insert({ name: phase, event_id: realId })
    .returning('*');
  return res;
}

async function addTimeSlot(date, eventId) {
  const realId = await getRealId(eventId);
  const [res] = await knex('event_time_slots')
    .insert({ date: new Date(date), event_id: realId })
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
  const realId = await getRealId(eventId);
  const entity = await getEntity(eventId, userId);

  const stripeProduct = {
    name,
    active: true,
    description: entity.name,

    // TODO: Add entity seller id
    metadata: { type: GLOBAL_ENUM.EVENT, id: realId },
  };
  const product = await addProduct({ stripeProduct });
  const stripePrice = {
    currency: 'cad',
    unit_amount: price,
    active: true,
    product: product.id,
    metadata: { type: GLOBAL_ENUM.EVENT, id: realId },
  };
  const priceStripe = await addPrice({
    stripePrice,
    entityId: realId,
    photoUrl: entity.photoUrl,
  });
  const [res] = await knex('event_payment_options')
    .insert({
      id: priceStripe.id,
      event_id: realId,
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
  const realId = await getRealId(entityId);
  const entity = await getEntity(entityId, userId);

  const stripeProduct = {
    name: getMembershipName(membershipType),
    active: true,
    description: entity.name,
    metadata: { type: GLOBAL_ENUM.MEMBERSHIP, id: realId },
  };
  const product = await addProduct({ stripeProduct });
  const stripePrice = {
    currency: 'cad',
    unit_amount: price,
    active: true,
    product: product.id,
    metadata: { type: GLOBAL_ENUM.MEMBERSHIP, id: realId },
  };
  const priceStripe = await addPrice({
    stripePrice,
    realId,
    photoUrl: entity.photoUrl,
  });

  const [res] = await knex('entity_memberships')
    .insert({
      stripe_price_id: priceStripe.id,
      entity_id: realId,
      membership_type: membershipType,
      length,
      fixed_date: fixedDate,
      price,
    })
    .returning('*');
  return res;
}

async function addTeamToEvent(body) {
  const {
    teamId,
    eventId,
    status,
    registrationStatus,
    paymentOption,
  } = body;
  const realTeamId = await getRealId(teamId);
  const realEventId = await getRealId(eventId);

  return knex.transaction(async trx => {
    const [roster] = await knex('team_rosters')
      .insert({ team_id: realTeamId })
      .returning('*')
      .transacting(trx);

    const [res] = await knex('event_rosters')
      .insert({
        roster_id: roster.id,
        team_id: realTeamId,
        event_id: realEventId,
        status,
        registration_status: registrationStatus,
        payment_option_id: paymentOption,
      })
      .returning('*')
      .transacting(trx);
    return res.roster_id;
  });
}

async function addRoster(rosterId, roster) {
  const realId = await getRealId(rosterId);
  const players = await knex('team_players')
    .insert(
      roster.map(person => ({
        roster_id: realId,
        person_id: person.person_id,
        name: person.name,
      })),
    )
    .returning('*');

  return players;
}
async function updateMember(
  memberType,
  organizationId,
  personId,
  expirationDate,
) {
  const realId = await getRealId(organizationId);
  const [res] = await knex('memberships')
    .where({
      member_type: memberType,
      organization_id: realId,
      person_id: personId,
    })
    .update({
      expiration_date: expirationDate,
    })
    .returning('*');
  return res;
}

async function updateAlias(entityId, alias) {
  const realId = await getRealId(entityId);
  const res = await knex('alias')
    .where({
      id: realId,
    })
    .update({
      alias,
    })
    .returning('*');
  return res;
}

async function updateGame(
  gameId,
  phaseId,
  field,
  time,
  rosterId1,
  rosterId2,
  name1,
  name2,
  teamId1,
  teamId2,
) {
  let realTime = new Date(time);
  if (!time) {
    realTime = null;
  }
  const res = [];
  if (phaseId.length) {
    const [r] = await knex('games')
      .where({
        id: gameId,
      })
      .update({
        phase_id: phaseId,
      })
      .returning('*');
    res.push(r);
  }

  if (field.length) {
    const [r] = await knex('games')
      .where({
        id: gameId,
      })
      .update({
        field,
      })
      .returning('*');
    res.push(r);
  }

  if (realTime) {
    const [r] = await knex('games')
      .where({
        id: gameId,
      })
      .update({
        start_time: realTime,
      })
      .returning('*');
    res.push(r);
  }

  if (name1) {
    const [r] = await knex('game_teams')
      .where({
        id: teamId1,
      })
      .update({
        name: team1,
      })
      .returning('*');
    res.push(r);
  }

  if (name2) {
    const [r] = await knex('game_teams')
      .where({
        id: teamId2,
      })
      .update({
        name: team2,
      })
      .returning('*');
    res.push(r);
  }
  if (rosterId1) {
    const teamName = await getTeamName(rosterId1);
    const [r] = await knex('game_teams')
      .where({
        id: teamId1,
      })
      .update({
        name: teamName,
        roster_id: rosterId1,
      })
      .returning('*');
    res.push(r);
  }

  if (rosterId2) {
    const teamName = await getTeamName(rosterId2);
    const [r] = await knex('game_teams')
      .where({
        id: teamId2,
      })
      .update({
        name: teamName,
        roster_id: rosterId2,
      })
      .returning('*');
    res.push(r);
  }
  return Promise.all(res);
}

async function removeEntityRole(entityId, entityIdAdmin) {
  const realEntityId = await getRealId(entityId);
  const realAdminId = await getRealId(entityIdAdmin);
  return knex('entities_role')
    .where({ entity_id: realEntityId, entity_id_admin: realAdminId })
    .del();
}

const deleteEntity = async (entityId, userId) => {
  const realId = await getRealId(entityId);
  const [{ role } = {}] = await knex('user_entity_role')
    .select('entities_role.role')
    .leftJoin(
      'entities_role',
      'entities_role.entity_id_admin',
      '=',
      'user_entity_role.entity_id',
    )
    .where('entities_role.entity_id', realId)
    .andWhere('user_entity_role.user_id', userId);
  if (role !== ENTITIES_ROLE_ENUM.ADMIN) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  } else {
    await knex('entities')
      .where({ id: realId })
      .del();
  }
};

const deleteEntityMembership = async (
  entityId,
  membershipTypeProps,
  lengthProps,
  fixedDate,
) => {
  const realId = await getRealId(entityId);
  const membershipType = Number(membershipTypeProps);
  const length = Number(lengthProps);

  await knex('entity_memberships')
    .where({
      entity_id: realId,
      membership_type: membershipType,
      length,
      fixed_date: fixedDate,
    })
    .del();
};

const deleteOption = async id => {
  return await knex('event_payment_options')
    .where({ id })
    .del();
};

const addPlayerToRoster = async (body, userId) => {
  const { personId, name, id, rosterId, isSub } = body;
  //TODO: Make sure userId adding is team Admin
  let player = {};
  if (personId) {
    player = await knex('team_players')
      .insert({
        roster_id: rosterId,
        person_id: personId,
        name: name,
        id,
        is_sub: isSub,
      })
      .returning('*');
  } else {
    const person = await addEntity(
      {
        name,
        type: GLOBAL_ENUM.PERSON,
      },
      userId,
    );
    player = await knex('team_players')
      .insert({
        roster_id: rosterId,
        person_id: person.id,
        name: name,
        id,
        is_sub: isSub,
      })
      .returning('*');
  }
  return player;
};

const deletePlayerFromRoster = async id => {
  //TODO: Make sure userId deleting is team Admin
  const realId = await getRealId(id);
  await knex('team_players')
    .where({
      id: realId,
    })
    .del();
  return null;
};

const deleteGame = async id => {
  const [game] = await knex.transaction(async trx => {
    await knex('game_teams')
      .where('game_id', id)
      .del()
      .transacting(trx);
    return knex('games')
      .where({ id })
      .del()
      .returning('*')
      .transacting(trx);
  });
  return game;
};

module.exports = {
  addEntity,
  addEntityRole,
  addMember,
  addAlias,
  addMembership,
  addGame,
  addScoreSuggestion,
  addScoreAndSpirit,
  addField,
  addTeamToSchedule,
  addRegisteredToSchedule,
  addPhase,
  addTimeSlot,
  addOption,
  addRoster,
  addTeamToEvent,
  deleteEntity,
  deleteEntityMembership,
  deleteOption,
  deleteRegistration,
  getAllEntities,
  getAllForYouPagePosts,
  getScoreSuggestion,
  getAllOwnedEntities,
  getOwnedEvents,
  getAllRolesEntity,
  getAllTypeEntities,
  getCreator,
  getEntity,
  getEntityRole,
  getEmailsEntity,
  getMembers,
  getMemberships,
  getRegistered,
  getAllRegistered,
  getAllRegisteredInfos,
  getRemainingSpots,
  getRoster,
  getEvent,
  getAlias,
  getPhases,
  getGames,
  getSlots,
  getTeamsSchedule,
  getFields,
  getGeneralInfos,
  getOptions,
  removeEntityRole,
  removeEventCartItem,
  unregister,
  getRosterInvoiceItem,
  updateEntityName,
  updateEntityPhoto,
  updateEntityRole,
  updateEvent,
  updateGeneralInfos,
  updateMember,
  updateAlias,
  updateGame,
  updateRegistration,
  eventInfos,
  addPlayerToRoster,
  deletePlayerFromRoster,
  deleteGame,
};
