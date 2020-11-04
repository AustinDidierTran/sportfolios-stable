const knex = require('../connection');

const { getMembershipName } = require('../../../../common/functions');
const {
  ENTITIES_ROLE_ENUM,
  GLOBAL_ENUM,
  ROSTER_ROLE_ENUM,
  TAG_TYPE_ENUM,
  CARD_TYPE_ENUM,
  PERSON_TRANSFER_STATUS_ENUM,
  STATUS_ENUM,
  MEMBERSHIP_LENGTH_TYPE_ENUM,
  INVOICE_STATUS_ENUM,
} = require('../../../../common/enums');
const { addProduct, addPrice } = require('./stripe/shop');
const { ERROR_ENUM } = require('../../../../common/errors');
const moment = require('moment');
const { sendTransferAddNewPlayer } = require('../helpers/index');
const {
  formatPrice,
} = require('../../../../common/utils/stringFormat');

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
        const [id] = await knex('user_entity_role')
          .insert({
            user_id: userId,
            entity_id: entityId,
            role: ENTITIES_ROLE_ENUM.ADMIN,
          })
          .returning('entity_id')
          .transacting(trx);
        return { id };
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

        await knex('divisions')
          .insert({ event_id: event.id })
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
  const events = await knex('events_infos')
    .select('*')
    .leftJoin(
      'entities_role',
      'events_infos.id',
      '=',
      'entities_role.entity_id',
    )
    .where('entities_role.entity_id_admin', '=', realId)
    .whereNull('deleted_at');

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
  return fullEvents;
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
    .where('entities_role.entity_id', realId)
    .orderBy('entities_role.role');

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
  start_time,
  rosterId1,
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
  const suggestions = suggestions1.concat(suggestions2);
  const res = suggestions.sort(
    (a, b) => moment(a.created_at) - moment(b.created_at),
  );

  return res;
}
async function getSameSuggestions(
  eventId,
  startTime,
  yourRosterId,
  opposingRosterId,
  yourScore,
  opposingTeamScore,
) {
  const suggestion = {
    eventId,
    startTime,
    yourRosterId,
    opposingRosterId,
    yourScore: Number(yourScore),
    opposingTeamScore: Number(opposingTeamScore),
  };
  const suggestions = await getScoreSuggestion(
    eventId,
    startTime,
    yourRosterId,
    opposingRosterId,
  );
  return keepSameSuggestions(suggestions, suggestion);
}

async function getRealId(id) {
  const [res] = await knex('alias')
    .select('id')
    .where({ reduced_alias: id.replace(/\./g, '').toLowerCase() });
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

async function getMembers(personId, organizationId) {
  const realId = await getRealId(organizationId);
  const members = await knex('memberships')
    .select('*')
    .rightJoin(
      'entities',
      'entities.id',
      '=',
      'memberships.person_id',
    )
    .where('entities.id', '=', personId)
    .andWhere('entities.type', '=', GLOBAL_ENUM.PERSON)
    .andWhere({ organization_id: realId });
  return members.map(m => ({
    organizationId: m.organization_id,
    personId: m.person_id,
    memberType: m.member_type,
    expirationDate: m.expiration_date,
    id: m.id,
    status: m.status,
  }));
}
async function getOrganizationMembers(organizationId) {
  const realId = await getRealId(organizationId);
  const members = await knex('memberships')
    .select('*')
    .rightJoin(
      'entities',
      'entities.id',
      '=',
      'memberships.person_id',
    )
    .whereNull('deleted_at')
    .andWhere('entities.type', '=', GLOBAL_ENUM.PERSON)
    .andWhere({ organization_id: realId });

  const res = await Promise.all(
    members.map(async m => ({
      organizationId: m.organization_id,
      person: await getEntity(m.person_id),
      memberType: m.member_type,
      expirationDate: m.expiration_date,
      id: m.id,
      createdAt: m.created_at,
      status: m.status,
    })),
  );
  return res;
}

async function getOptions(eventId) {
  const realId = await getRealId(eventId);

  const res = await knex('event_payment_options')
    .select(
      'event_payment_options.name',
      'team_price',
      'individual_price',
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
    .whereNull('event_payment_options.deleted_at')
    .andWhere({ event_id: realId })
    .orderBy('event_payment_options.created_at');

  return res.map(r => ({
    ...r,
    start_time: new Date(r.start_time).getTime(),
    end_time: new Date(r.end_time).getTime(),
  }));
}

async function getMemberships(entityId) {
  const realId = await getRealId(entityId);
  const memberships = await knex('entity_memberships')
    .select('*')
    .where({ entity_id: realId });

  return memberships.map(m => ({
    ...m,
    price: formatPrice(m.price),
  }));
}

async function getMembership(membershipId) {
  const [membership] = await knex('entity_memberships')
    .select('*')
    .where({ id: membershipId });
  return membership;
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
    .where({
      event_id: realEventId,
      registration_status: STATUS_ENUM.ACCEPTED,
    })
    .whereIn('roster_id', rostersId);
}

async function getRegistrationTeamPaymentOption(paymentOptionId) {
  const [teamPaymentOption] = await knex('event_payment_options')
    .select('team_price', 'team_stripe_price_id')
    .where({ id: paymentOptionId });

  return teamPaymentOption;
}

async function getIndividualPaymentOptionFromRosterId(rosterId) {
  const [roster] = await knex('event_rosters')
    .select('payment_option_id', 'team_id')
    .where({ roster_id: rosterId });

  const [option] = await knex('event_payment_options')
    .select(
      'individual_price',
      'individual_stripe_price_id',
      'event_id',
    )
    .where({ id: roster.payment_option_id });

  return {
    individual_price: option.individual_price,
    individual_stripe_price_id: option.individual_stripe_price_id,
    event_id: option.event_id,
    teamId: roster.team_id,
  };
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
    .select('id', 'name', 'team_price')
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
    .where({
      event_id: realId,
    });
  return teams;
}

async function getAllAcceptedRegistered(eventId) {
  const realId = await getRealId(eventId);
  const teams = await knex('event_rosters')
    .select('*')
    .whereIn('registration_status', [
      STATUS_ENUM.ACCEPTED,
      STATUS_ENUM.ACCEPTED_FREE,
    ])
    .andWhere({
      event_id: realId,
    });
  return teams;
}

async function getAllRegisteredInfos(eventId, userId) {
  const teams = await getAllRegistered(eventId);

  const props = await Promise.all(
    teams.map(async t => {
      const entity = await getEntity(t.team_id, userId);
      const emails = await getEmailsEntity(t.team_id);
      const players = await getRosterWithSub(t.roster_id);
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
    .where({
      event_id: realId,
      registration_status: STATUS_ENUM.ACCEPTED,
    });

  const [event] = await knex('events')
    .select('maximum_spots')
    .where({ id: realId });

  if (!event.maximum_spots) {
    return null;
  }
  return event.maximum_spots - Number(count);
}

async function getRankings(eventId) {
  const realId = await getRealId(eventId);
  const teams = await knex('division_ranking')
    .select('*')
    .where({ event_id: realId });
  const res = await Promise.all(
    teams.map(async team => {
      const name = await getEntitiesName(team.team_id);
      return { ...team, name: name.name, surname: name.surname };
    }),
  );

  return res;
}

async function getRegistrationStatus(eventId, rosterId) {
  const realEventId = await getRealId(eventId);
  const realRosterId = await getRealId(rosterId);
  const [registration] = await knex('event_rosters')
    .select('registration_status')
    .where({
      roster_id: realRosterId,
      event_id: realEventId,
    });

  return registration.registration_status;
}

async function getRoster(rosterId) {
  const realId = await getRealId(rosterId);
  const roster = await knex('team_players')
    .select('*')
    .where({ roster_id: realId, is_sub: false });

  //TODO: Make a call to know if has created an account or is child account
  const status = TAG_TYPE_ENUM.REGISTERED;

  const props = roster.map(player => ({
    id: player.id,
    name: player.name,
    personId: player.person_id,
    isSub: player.is_sub,
    status: status,
    paymentStatus: player.payment_status,
    invoiceItemId: player.invoice_item_id,
  }));

  return props;
}

async function getRosterWithSub(rosterId) {
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
    paymentStatus: player.payment_status,
    invoiceItemId: player.invoice_item_id,
  }));

  return props;
}

const getPrimaryPerson = async user_id => {
  const [{ primary_person: id }] = await knex('user_primary_person')
    .select('primary_person')
    .where({ user_id });
  const primaryPerson = await getEntity(id);
  return primaryPerson;
};

async function getRole(captains, rosterId, userId) {
  const realId = await getRealId(rosterId);
  if (!userId) {
    return ROSTER_ROLE_ENUM.VIEWER;
  }

  const person = await getPrimaryPerson(userId);
  const personId = person.id;

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

const getPlayerInvoiceItem = async id => {
  const [
    {
      invoice_item_id: invoiceItemId,
      payment_status: status,
      person_id: personId,
      roster_id: rosterId,
    },
  ] = await knex('team_players')
    .select([
      'invoice_item_id',
      'payment_status',
      'person_id',
      'roster_id',
    ])
    .where({ id });

  return { invoiceItemId, status, personId, rosterId };
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
  if (!res) {
    return { alias: entityId };
  }
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

async function getTeamGames(eventId) {
  const games = await getGames(eventId);

  const res = await Promise.all(
    games.map(async game => {
      const teams = await knex('game_teams')
        .select('*')
        .leftJoin(
          'team_rosters',
          'team_rosters.id',
          '=',
          'game_teams.roster_id',
        )
        .where({ game_id: game.id });
      return { id: game.id, phaseId: game.phase_id, eventId, teams };
    }),
  );
  return res;
}

async function getPhasesGameAndTeams(eventId, phaseId) {
  const realId = await getRealId(eventId);
  const games = await knex('games')
    .select('*')
    .where({ event_id: realId, phase_id: phaseId });

  const res = await Promise.all(
    games.map(async game => {
      const teams = await knex('game_teams')
        .select('*')
        .leftJoin(
          'team_rosters',
          'team_rosters.id',
          '=',
          'game_teams.roster_id',
        )
        .where({ game_id: game.id });
      return { id: game.id, phaseId: game.phase_id, eventId, teams };
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

async function getPersonInfos(entityId) {
  const realId = await getRealId(entityId);
  const [res] = await knex('person_all_infos')
    .select('*')
    .where({ id: realId });

  let resObj = {
    photoUrl: res.photo_url,
    name: res.name,
    surname: res.surname,
    birthDate: res.birth_date,
    gender: res.gender,
    formattedAddress: res.address,
  };

  const [fullAddress] = await knex('entities_address')
    .select('*')
    .where({ entity_id: realId });

  if (fullAddress) {
    resObj.address = {
      street_address: fullAddress.street_address,
      city: fullAddress.city,
      state: fullAddress.state,
      zip: fullAddress.zip,
      country: fullAddress.country,
    };
  }

  return resObj;
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

async function updatePreRanking(eventId, ranking) {
  const realId = await getRealId(eventId);
  const res = await Promise.all(
    ranking.map(async (r, index) => {
      const [rank] = await knex('division_ranking')
        .update({ initial_position: index + 1 })
        .where({ event_id: realId, team_id: r.id })
        .returning('*');
      return rank;
    }),
  );
  return res;
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

async function updatePersonInfosHelper(entityId, body) {
  const { personInfos } = body;
  const realId = await getRealId(entityId);

  let fullname;
  let birthDateRes;
  let genderRes;
  let fullAddress;
  let outputPersonInfos = {};

  if (personInfos.name || personInfos.surname) {
    fullname = await knex('entities_name')
      .update({
        name: personInfos.name,
        surname: personInfos.surname,
      })
      .where({ entity_id: realId })
      .returning('*');

    outputPersonInfos.name = fullname[0].name;
    outputPersonInfos.surname = fullname[0].surname;
  }

  if (personInfos.birthDate) {
    birthDateRes = await knex.raw(
      `? ON CONFLICT (entity_id)
        DO UPDATE SET
          birth_date = '${personInfos.birthDate}'
        RETURNING birth_date;`,
      [
        knex('entities_birth_date').insert({
          entity_id: realId,
          birth_date: personInfos.birthDate,
        }),
      ],
    );

    outputPersonInfos.birthDate = birthDateRes.rows[0].birth_date;
  }

  if (personInfos.gender) {
    genderRes = await knex.raw(
      `? ON CONFLICT (entity_id)
        DO UPDATE SET
          gender = '${personInfos.gender}'
        RETURNING gender;`,
      [
        knex('entities_gender').insert({
          entity_id: realId,
          gender: personInfos.gender,
        }),
      ],
    );

    outputPersonInfos.gender = genderRes.rows[0].gender;
  }

  if (personInfos.address.length != 0) {
    fullAddress = await knex.raw(
      `? ON CONFLICT (entity_id)
        DO UPDATE SET
        street_address = '${personInfos.address.street_address}',
        city = '${personInfos.address.city}',
        state = '${personInfos.address.state}',
        zip = '${personInfos.address.zip}',
        country = '${personInfos.address.country}'
        RETURNING CONCAT_WS(', ', street_address, city, state, zip, country);`,
      [
        knex('entities_address').insert({
          entity_id: realId,
          street_address: personInfos.address.street_address,
          city: personInfos.address.city,
          state: personInfos.address.state,
          zip: personInfos.address.zip,
          country: personInfos.address.country,
        }),
      ],
    );

    outputPersonInfos.address = fullAddress.rows[0].concat_ws;
  }

  return outputPersonInfos;
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

async function updateOption(body) {
  const { id, start_time, end_time } = body;

  return knex('event_payment_options')
    .update({
      start_time: new Date(start_time),
      end_time: new Date(end_time),
    })
    .where({ id });
}

const getWichTeamsCanUnregister = async (rosterIds, eventId) => {
  var list = [];
  for (const rosterId of rosterIds) {
    if (await canUnregisterTeam(rosterId, eventId)) {
      list.push(rosterId);
    }
  }

  return list;
};

const canUnregisterTeam = async (rosterId, eventId) => {
  const realEventId = await getRealId(eventId);
  const realRosterId = await getRealId(rosterId);

  const games = await knex('game_teams')
    .whereIn(
      'game_id',
      knex('games')
        .select('id')
        .where({ event_id: realEventId }),
    )
    .andWhere({ roster_id: realRosterId });

  if (games) {
    return games.length == 0;
  }
  return true;
};

const deleteRegistration = async (rosterId, eventId) => {
  const realEventId = await getRealId(eventId);
  const realRosterId = await getRealId(rosterId);
  const [res] = await knex('team_rosters')
    .select('team_id')
    .where({ id: realRosterId });

  return knex.transaction(async trx => {
    // temporary, table will probably be removed
    await knex('schedule_teams')
      .where({
        event_id: realEventId,
        roster_id: realRosterId,
      })
      .del()
      .transacting(trx);

    await knex('event_rosters')
      .where({
        roster_id: realRosterId,
        event_id: realEventId,
      })
      .del()
      .transacting(trx);

    await knex('division_ranking')
      .where({ team_id: res.team_id })
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

const removeIndividualPaymentCartItem = async ({
  buyerId,
  rosterId,
}) => {
  const realBuyerId = await getRealId(buyerId);
  const realRosterId = await getRealId(rosterId);
  const [res] = await knex
    .select('id')
    .from(
      knex
        .select(
          knex.raw(
            "id, metadata ->> 'buyerId' AS buyerId, metadata ->> 'rosterId' AS rosterId, metadata ->> 'isIndividualOption' AS isIndividualOption",
          ),
        )
        .from('cart_items')
        .as('cartItems'),
    )
    .where({
      'cartItems.buyerid': realBuyerId,
      'cartItems.rosterid': realRosterId,
      'cartItems.isindividualoption': true,
    });

  if (res) {
    await knex('cart_items')
      .where({ id: res.id })
      .del();
  }

  return res ? res.id : null;
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

async function updatePlayerPaymentStatus(body) {
  const {
    metadata: { buyerId: buyerPersonId },
    rosterId,
    status,
    invoiceItemId,
  } = body;
  const realRosterId = await getRealId(rosterId);
  return knex('team_players')
    .update({
      payment_status: status,
      invoice_item_id: invoiceItemId,
    })
    .where({
      person_id: buyerPersonId,
      roster_id: realRosterId,
    });
}

async function updateMembershipInvoice(body) {
  const {
    metadata: { person, organization, membership_type },
    invoiceItemId,
  } = body;
  const res = knex('memberships')
    .update({
      invoice_item_id: invoiceItemId,
      status: INVOICE_STATUS_ENUM.PAID,
    })
    .where({
      person_id: person.id,
      organization_id: organization.id,
      member_type: membership_type,
    });
  return res;
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

async function addMemberManually(
  memberType,
  organizationId,
  personId,
  expirationDate,
) {
  const realId = await getRealId(organizationId);
  const [member] = await knex('memberships')
    .select('*')
    .where({
      member_type: memberType,
      organization_id: realId,
      person_id: personId,
    });
  if (member) {
    const [res] = await knex('memberships')
      .update({
        expiration_date: expirationDate,
        status: INVOICE_STATUS_ENUM.FREE,
      })
      .where({
        member_type: memberType,
        organization_id: realId,
        person_id: personId,
      })
      .returning('*');
    return res;
  } else {
    const [res] = await knex('memberships')
      .insert({
        member_type: memberType,
        organization_id: realId,
        person_id: personId,
        expiration_date: expirationDate,
        status: INVOICE_STATUS_ENUM.FREE,
      })
      .returning('*');
    return res;
  }
}
async function addMember(
  memberType,
  organizationId,
  personId,
  expirationDate,
) {
  const realId = await getRealId(organizationId);
  const [member] = await knex('memberships')
    .select('*')
    .where({
      member_type: memberType,
      organization_id: realId,
      person_id: personId,
    });
  if (member) {
    const [res] = await knex('memberships')
      .update({
        expiration_date: expirationDate,
        status: INVOICE_STATUS_ENUM.OPEN,
      })
      .where({
        member_type: memberType,
        organization_id: realId,
        person_id: personId,
      })
      .returning('*');
    return res;
  } else {
    const [res] = await knex('memberships')
      .insert({
        member_type: memberType,
        organization_id: realId,
        person_id: personId,
        expiration_date: expirationDate,
        status: INVOICE_STATUS_ENUM.OPEN,
      })
      .returning('*');
    return res;
  }
}

async function addAlias(entityId, alias) {
  const realId = await getRealId(entityId);
  const [res] = await knex('alias')
    .insert({
      id: realId,
      alias,
      reduced_alias: alias.replace(/\./g, '').toLowerCase(),
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

async function getUserIdFromPersonId(personId) {
  const [user] = await knex('user_entity_role')
    .select('user_id')
    .where({ entity_id: personId, role: ENTITIES_ROLE_ENUM.ADMIN });
  return user.user_id;
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
  gameId,
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
      game_id: gameId,
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
    status.registration_status === STATUS_ENUM.ACCEPTED ||
    status.registration_status === STATUS_ENUM.ACCEPTED_FREE
  );
}

async function addRegisteredToSchedule(eventId) {
  const teams = await getAllAcceptedRegistered(eventId);
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
  teamPrice,
  playerPrice,
  endTime,
  startTime,
  userId,
) {
  const realId = await getRealId(eventId);
  const entity = await getEntity(eventId, userId);

  let teamPriceStripe;
  let individualPriceStripe;

  if (teamPrice > 0) {
    const stripeProductTeam = {
      name: `${name} - Paiement d'équipe`, // ${t('payment_team')}
      active: true,
      description: entity.name,

      // TODO: Add entity seller id
      metadata: { type: GLOBAL_ENUM.EVENT, id: realId },
    };
    const productTeam = await addProduct({
      stripeProduct: stripeProductTeam,
    });
    const stripePriceTeam = {
      currency: 'cad',
      unit_amount: teamPrice,
      active: true,
      product: productTeam.id,
      metadata: { type: GLOBAL_ENUM.EVENT, id: realId },
    };
    teamPriceStripe = await addPrice({
      stripePrice: stripePriceTeam,
      entityId: realId,
      photoUrl: entity.photoUrl,
    });
  }

  if (playerPrice > 0) {
    const stripeProductIndividual = {
      name: `${name} - Paiement individuel`, // ${t('payment_individual')}
      active: true,
      description: entity.name,

      // TODO: Add entity seller id
      metadata: { type: GLOBAL_ENUM.EVENT, id: realId },
    };
    const productIndividual = await addProduct({
      stripeProduct: stripeProductIndividual,
    });
    const stripePriceIndividual = {
      currency: 'cad',
      unit_amount: playerPrice,
      active: true,
      product: productIndividual.id,
      metadata: { type: GLOBAL_ENUM.EVENT, id: realId },
    };
    individualPriceStripe = await addPrice({
      stripePrice: stripePriceIndividual,
      entityId: realId,
      photoUrl: entity.photoUrl,
    });
  }

  const [res] = await knex('event_payment_options')
    .insert({
      event_id: realId,
      name,
      team_stripe_price_id: teamPriceStripe
        ? teamPriceStripe.id
        : null,
      team_price: teamPrice,
      individual_stripe_price_id: individualPriceStripe
        ? individualPriceStripe.id
        : null,
      individual_price: playerPrice,
      end_time: new Date(endTime),
      start_time: new Date(startTime),
    })
    .returning('*');
  return res;
}

async function addMembership(
  entityId,
  membership,
  length,
  date,
  type,
  price,
  userId,
) {
  const realId = await getRealId(entityId);
  const entity = await getEntity(entityId, userId);
  const stripeProduct = {
    name: getMembershipName(membership),
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
    entityId,
    photoUrl: entity.photoUrl,
  });
  if (type === MEMBERSHIP_LENGTH_TYPE_ENUM.FIXED) {
    const [res] = await knex('entity_memberships')
      .insert({
        stripe_price_id: priceStripe.id,
        entity_id: realId,
        membership_type: membership,
        fixed_date: date,
        price,
      })
      .returning('*');
    return res;
  }
  if (type === MEMBERSHIP_LENGTH_TYPE_ENUM.LENGTH) {
    const [res] = await knex('entity_memberships')
      .insert({
        stripe_price_id: priceStripe.id,
        entity_id: realId,
        membership_type: membership,
        length,
        price,
      })
      .returning('*');
    return res;
  }
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

    await knex('division_ranking')
      .insert({
        team_id: roster.team_id,
        event_id: res.event_id,
      })
      .transacting(trx);
    return res.roster_id;
  });
}

async function addRoster(rosterId, roster, userId) {
  const players = await Promise.all(
    roster.map(async r => {
      if (r.email) {
        const res = await addNewPersonToRoster(
          {
            ...r,
            rosterId,
          },
          userId,
        );
        return res;
      } else {
        const res = await addPlayerToRoster(
          {
            ...r,
            rosterId,
          },
          userId,
        );
        return res;
      }
    }),
  );
  return players;
}

async function addNewPersonToRoster(body, userId) {
  const {
    addedByEventAdmin,
    name,
    surname,
    email,
    isSub,
    rosterId,
  } = body;
  const person = await addEntity(
    { name, surname, type: GLOBAL_ENUM.PERSON },
    userId,
  );

  await addPlayerToRoster(
    {
      personId: person.id,
      name: `${name} ${surname}`,
      rosterId,
      isSub,
    },
    userId,
  );

  const teamName = await getTeamName(rosterId);
  await sendTransferAddNewPlayer(userId, {
    email,
    senderIsEventAdmin: addedByEventAdmin,
    sendedPersonId: person.id,
    teamName,
  });

  return { is_sub: isSub, name: `${name} ${surname}`, id: person.id };
}

const addPlayerToRoster = async (body, userId) => {
  const { personId, name, id, rosterId, isSub } = body;
  let paymentStatus = INVOICE_STATUS_ENUM.FREE;
  let cartItem;

  if (!isSub) {
    const paymentOption = await getIndividualPaymentOptionFromRosterId(
      rosterId,
    );

    if (paymentOption.individual_price > 0) {
      cartItem = {
        stripePriceId: paymentOption.individual_stripe_price_id,
        metadata: {
          sellerEntityId: paymentOption.event_id,
          isIndividualOption: true,
          name,
          buyerId: personId,
          rosterId,
          team: await getEntity(paymentOption.teamId, userId),
        },
      };

      paymentStatus = INVOICE_STATUS_ENUM.OPEN;
      await addEventCartItem(
        cartItem,
        await getUserIdFromPersonId(personId),
      );
    }
  }

  //TODO: Make sure userId adding is team Admin
  const player = await knex('team_players')
    .insert({
      roster_id: rosterId,
      person_id: personId,
      name,
      id,
      is_sub: isSub,
      payment_status: paymentStatus,
    })
    .returning('*');

  return player;
};

const addEventCartItem = async (body, userId) => {
  const { stripePriceId, metadata } = body;
  await knex('cart_items').insert({
    stripe_price_id: stripePriceId,
    user_id: userId,
    metadata: { ...metadata, type: GLOBAL_ENUM.EVENT },
  });
};

const deletePlayerFromRoster = async id => {
  //TODO: Make sure userId deleting is team Admin
  const realId = await getRealId(id);
  await knex('team_players')
    .where({
      id: realId,
    })
    .del();
  return id;
};

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
      reduced_alias: alias.replace(/\./g, '').toLowerCase(),
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
async function keepSameSuggestions(suggestions, suggestion) {
  return suggestions.filter(s => {
    return (
      (s.your_roster_id === suggestion.yourRosterId &&
        s.opposing_roster_id === suggestion.opposingRosterId &&
        s.your_score === suggestion.yourScore &&
        s.opposing_team_score === suggestion.opposingTeamScore) ||
      (s.your_roster_id === suggestion.opposingRosterId &&
        s.opposing_roster_id === suggestion.yourRosterId &&
        s.yourScore === suggestion.opposingTeamScore &&
        s.opposing_team_score === suggestion.your_score)
    );
  });
}
async function keepDifferentSuggestions(suggestions, suggestion) {
  return suggestions.filter(s => {
    return (
      (s.your_roster_id != suggestion.yourRosterId ||
        s.opposing_roster_id != suggestion.opposingRosterId ||
        s.your_score != suggestion.yourScore ||
        s.opposing_team_score != suggestion.opposingTeamScore) &&
      (s.your_roster_id != suggestion.opposingRosterId ||
        s.opposing_roster_id != suggestion.yourRosterId ||
        s.your_score != suggestion.opposingTeamScore ||
        s.opposing_team_score != suggestion.yourScore)
    );
  });
}

async function updateSuggestionStatus(
  gameId,
  eventId,
  startTime,
  yourRosterId,
  opposingRosterId,
  yourScore,
  opposingTeamScore,
  status,
) {
  const suggestions = await getScoreSuggestion(
    eventId,
    startTime,
    yourRosterId,
    opposingRosterId,
  );
  const suggestion = {
    gameId,
    eventId,
    startTime,
    yourRosterId,
    opposingRosterId,
    yourScore: Number(yourScore),
    opposingTeamScore: Number(opposingTeamScore),
    status,
  };

  const same = await keepSameSuggestions(suggestions, suggestion);
  const different = await keepDifferentSuggestions(
    suggestions,
    suggestion,
  );

  const [res] = await Promise.all(
    same.map(async s => {
      const res = await knex('score_suggestion')
        .where({
          start_time: s.start_time,
          your_roster_id: s.your_roster_id,
          your_score: s.your_score,
          opposing_roster_id: s.opposing_roster_id,
          opposing_team_score: s.opposing_team_score,
        })
        .update({
          status,
        })
        .returning('*');
      return res;
    }),
  );

  if (status === STATUS_ENUM.ACCEPTED) {
    await knex('game_teams')
      .where({
        game_id: gameId,
        roster_id: yourRosterId,
      })
      .update({
        score: yourScore,
      });
    await knex('game_teams')
      .where({
        game_id: gameId,
        roster_id: opposingRosterId,
      })
      .update({
        score: opposingTeamScore,
      });
    different.map(async d => {
      await knex('score_suggestion')
        .where({
          start_time: d.start_time,
          your_roster_id: d.your_roster_id,
          your_score: d.your_score,
          opposing_roster_id: d.opposing_roster_id,
          opposing_team_score: d.opposing_team_score,
        })
        .update({
          status: STATUS_ENUM.REFUSED,
        })
        .returning('*');
    });
  }

  return res;
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
  const role = await getEntityRole(entityId, userId);
  if (role !== ENTITIES_ROLE_ENUM.ADMIN) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  } else {
    await knex('alias')
      .where({ id: realId })
      .del();
    await knex('entities')
      .where({ id: realId })
      .del();
  }
};

const deleteEntityMembership = async membershipId => {
  await knex('entity_memberships')
    .where({
      id: membershipId,
    })
    .del();
};

const deleteMembership = async (
  memberType,
  organizationId,
  personId,
) => {
  const [res] = await knex('memberships')
    .where({
      member_type: memberType,
      organization_id: organizationId,
      person_id: personId,
    })
    .del()
    .returning('*');
  if (!res.status) {
    const res2 = await knex
      .select('*')
      .from(
        knex
          .select(
            knex.raw(
              "id, metadata ->> 'membership_type' AS membership_type, metadata ->> 'entity_id' AS entity_id, metadata ->> 'organization' AS organization, metadata ->> 'person' AS person",
            ),
          )
          .from('cart_items')
          .as('cartItems'),
      )
      .where('cartItems.membership_type', memberType)
      .andWhere('cartItems.entity_id', organizationId);
    const res3 = res2.map(r => ({
      organizationId: JSON.parse(r.organization).id,
      personId: JSON.parse(r.person).id,
      id: r.id,
    }));
    const res4 = res3.filter(r => {
      return (
        r.organizationId === organizationId && r.personId === personId
      );
    });
    await Promise.all(
      res4.map(async r => {
        await knex('cart_items')
          .where({ id: r.id })
          .del();
      }),
    );
  }
};

const deleteOption = async id => {
  return knex('event_payment_options')
    .where({ id })
    .del();
};

const getGame = async id => {
  const [game] = await knex('games')
    .select('*')
    .where({ id });
  const teams = await getTeams(id);
  return { ...game, teams };
};

const deleteGame = async id => {
  const game = await getGame(id);
  const [res] = await knex.transaction(async trx => {
    await knex('score_suggestion')
      .where({
        event_id: game.event_id,
        start_time: game.start_time,
        your_roster_id: game.teams[0].roster_id,
        opposing_roster_id: game.teams[1].roster_id,
      })
      .del()
      .transacting(trx);
    await knex('score_suggestion')
      .where({
        event_id: game.event_id,
        start_time: game.start_time,
        your_roster_id: game.teams[1].roster_id,
        opposing_roster_id: game.teams[0].roster_id,
      })
      .del()
      .transacting(trx);
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
  return res;
};

const personIsAwaitingTransfer = async personId => {
  return (
    await knex.first(
      knex.raw(
        'exists ?',
        knex('transfered_person')
          .select('*')
          .where('person_id', personId)
          .andWhere('expires_at', '>', 'now()')
          .andWhere('status', PERSON_TRANSFER_STATUS_ENUM.PENDING),
      ),
    )
  ).exists;
};

module.exports = {
  addEntity,
  addEntityRole,
  addMember,
  addMemberManually,
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
  addNewPersonToRoster,
  addTeamToEvent,
  addEventCartItem,
  canUnregisterTeam,
  deleteEntity,
  deleteEntityMembership,
  deleteMembership,
  deleteOption,
  deleteRegistration,
  getAllEntities,
  getAllForYouPagePosts,
  getScoreSuggestion,
  getSameSuggestions,
  getAllOwnedEntities,
  getOwnedEvents,
  getAllRolesEntity,
  getAllTypeEntities,
  getCreator,
  getEntity,
  getEntityRole,
  getEmailsEntity,
  getMembers,
  getOrganizationMembers,
  getMemberships,
  getMembership,
  getRegistered,
  getRegistrationTeamPaymentOption,
  getAllAcceptedRegistered,
  getAllRegistered,
  getAllRegisteredInfos,
  getRemainingSpots,
  getRankings,
  getRoster,
  getRosterWithSub,
  getEvent,
  getAlias,
  getPhases,
  getGames,
  getTeamGames,
  getPhasesGameAndTeams,
  getSlots,
  getTeamsSchedule,
  getFields,
  getGeneralInfos,
  getOptions,
  getPrimaryPerson,
  getPlayerInvoiceItem,
  getRosterInvoiceItem,
  getWichTeamsCanUnregister,
  getPersonInfos,
  removeEntityRole,
  removeEventCartItem,
  removeIndividualPaymentCartItem,
  unregister,
  updateEntityName,
  updateEntityPhoto,
  updateEntityRole,
  updateEvent,
  updateOption,
  updatePreRanking,
  updateGeneralInfos,
  updatePersonInfosHelper,
  updateMember,
  updateAlias,
  updateGame,
  updateSuggestionStatus,
  updateRegistration,
  updatePlayerPaymentStatus,
  updateMembershipInvoice,
  eventInfos,
  addPlayerToRoster,
  deletePlayerFromRoster,
  deleteGame,
  personIsAwaitingTransfer,
};
