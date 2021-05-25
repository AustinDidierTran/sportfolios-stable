const knex = require('../connection');

const { getMembershipName } = require('../../../../common/functions');
const {
  EVENT_TYPE,
  ENTITIES_ROLE_ENUM,
  GLOBAL_ENUM,
  ROSTER_ROLE_ENUM,
  TAG_TYPE_ENUM,
  CARD_TYPE_ENUM,
  PERSON_TRANSFER_STATUS_ENUM,
  STATUS_ENUM,
  MEMBERSHIP_LENGTH_TYPE_ENUM,
  INVOICE_STATUS_ENUM,
  REPORT_TYPE_ENUM,
  PLAYER_ATTENDANCE_STATUS,
  PHASE_STATUS_ENUM,
} = require('../../../../common/enums');
const { v1: uuidv1 } = require('uuid');
const { addProduct, addPrice } = require('./stripe/shop');
const { ERROR_ENUM } = require('../../../../common/errors');
const moment = require('moment');
const validator = require('validator');

const _ = require('lodash');
const { EXPIRATION_TIMES } = require('../../../../common/constants');
const generateToken = () => {
  return uuidv1();
};

const generateAuthToken = async userId => {
  const token = generateToken();
  await knex('user_token').insert({
    user_id: userId,
    token_id: token,
    expires_at: new Date(Date.now() + EXPIRATION_TIMES.AUTH_TOKEN),
  });
  return token;
};

const addEntity = async (body, userId) => {
  const {
    name,
    creator,
    surname,
    type,
    startDate,
    endDate,
    maximumSpots,
  } = body;

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

    await knex('entities_general_infos')
      .insert({
        entity_id: entityId,
        name,
        surname,
      })
      .transacting(trx);

    let creatorId;
    if (creator) {
      creatorId = creator;
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

      creatorId = entityIdAdmin;
    }

    switch (Number(type)) {
      case GLOBAL_ENUM.PERSON: {
        const [id] = await knex('user_entity_role')
          .insert({
            user_id: userId,
            entity_id: entityId,
            role: ENTITIES_ROLE_ENUM.ADMIN,
          })
          .returning('entity_id')
          .transacting(trx);
        const [res] = await knex('person_infos')
          .insert({})
          .returning('id')
          .transacting(trx);
        await knex('entities_general_infos')
          .update({ infos_supp_id: res })
          .where({ entity_id: entityId })
          .transacting(trx);

        return { id };
      }
      case GLOBAL_ENUM.TEAM:
      case GLOBAL_ENUM.ORGANIZATION: {
        await knex('entities_role')
          .insert({
            entity_id: entityId,
            entity_id_admin: creatorId,
            role: ENTITIES_ROLE_ENUM.ADMIN,
          })
          .transacting(trx);
        return { id: entityId };
      }
      case GLOBAL_ENUM.EVENT: {
        await knex('entities_role')
          .insert({
            entity_id: entityId,
            role: ENTITIES_ROLE_ENUM.ADMIN,
            entity_id_admin: creatorId,
          })
          .transacting(trx);

        const [{ id: event_id, maximum_spots: spots }] = await knex(
          'events',
        )
          .insert({
            id: entityId,
            start_date: startDate,
            start_varchar: startDate,
            end_date: endDate,
            end_varchar: endDate,
            maximum_spots: maximumSpots,
          })
          .returning('*')
          .transacting(trx);

        const [prerank] = await knex('phase')
          .insert({
            event_id: event_id,
            name: 'prerank',
            spots: spots,
            phase_order: 0,
            status: PHASE_STATUS_ENUM.NOT_STARTED,
          })
          .returning('*')
          .transacting(trx);

        for (let i = 0; i < spots; ++i) {
          await knex('phase_rankings')
            .insert({
              current_phase: prerank.id,
              initial_position: i + 1,
            })
            .transacting(trx);
        }
        return { id: event_id };
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
        'entities_general_infos',
        'entities.id',
        '=',
        'entities_general_infos.entity_id',
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
      'entities_general_infos',
      'entities.id',
      '=',
      'entities_general_infos.entity_id',
    );

  return entities.map(e => ({
    id: e.id,
    name: e.name,
    photoUrl: e.photo_url,
    surname: e.surname,
    type: e.type,
  }));
}

async function getAllOwnedEntities(
  type,
  userId,
  query = '',
  onlyAdmin = false,
) {
  // getPersons
  let entityIds = (
    await knex('user_entity_role')
      .select('entity_id')
      .where({
        user_id: userId,
      })
      .andWhere(
        'role',
        '<=',
        onlyAdmin
          ? ENTITIES_ROLE_ENUM.ADMIN
          : ENTITIES_ROLE_ENUM.EDITOR,
      )
  ).map(person => ({
    entity_id: person.entity_id,
    role: ENTITIES_ROLE_ENUM.ADMIN,
  }));

  let count = 0;
  let newEntityIds = [];

  // get all entities owned by persons and sub persons
  do {
    entityIds = [...newEntityIds, ...entityIds];
    entityIds = entityIds.filter(
      (entity, index) =>
        entityIds.findIndex(e => e.entity_id === entity.entity_id) ===
        index,
    );

    newEntityIds = (
      await knex('entities_role')
        .select('entity_id', 'entity_id_admin', 'role')
        .whereIn(
          'entity_id_admin',
          entityIds.map(e => e.entity_id),
        )
        .andWhere(
          'role',
          '<=',
          onlyAdmin
            ? ENTITIES_ROLE_ENUM.ADMIN
            : ENTITIES_ROLE_ENUM.EDITOR,
        )
    ).map(entity => ({
      ...entity,
      role: Math.max(
        entity.role,
        entityIds.find(e => e.entity_id === entity.entity_id_admin)
          .role,
      ),
    }));

    count++;
  } while (
    newEntityIds.some(
      id => !entityIds.find(e => e.entity_id === id),
    ) &&
    count < 5
  );

  const entities = await knex
    .select('*')
    .from(
      knex
        .select(
          'id',
          'type',
          'name',
          'surname',
          knex.raw(
            "string_agg(entities_all_infos.name || ' ' || entities_all_infos.surname, ' ') AS complete_name",
          ),
          'photo_url',
        )
        .from('entities_all_infos')
        .whereNull('deleted_at')
        .whereIn(
          'entities_all_infos.id',
          entityIds.map(e => e.entity_id),
        )

        .groupBy(
          'entities_all_infos.id',
          'entities_all_infos.type',
          'entities_all_infos.name',
          'entities_all_infos.surname',
          'entities_all_infos.photo_url',
        )
        .as('res'),
    )
    .where('complete_name', 'ILIKE', `%${query || ''}%`)
    .where({ type });

  return entities.map(entity => ({
    ...entity,
    role: entityIds.find(e => e.entity_id === entity.id).role,
    photo_url: undefined,
    photoUrl: entity.photo_url,
    entity_id_admin: undefined,
  }));
}

async function getEmailsLandingPage() {
  const emails = await knex('landing_page_emails').select('email');
  return emails.map(e => e.email);
}

async function getOwnedEvents(organizationId) {
  const events = await knex('events_infos')
    .select('*')
    .leftJoin(
      'entities_role',
      'events_infos.id',
      '=',
      'entities_role.entity_id',
    )
    .where('entities_role.entity_id_admin', '=', organizationId)
    .whereNull('deleted_at');

  const fullEvents = await Promise.all(
    events.map(async event => {
      const { creator_id: creatorId } = event;
      const creator = (await getEntity(creatorId)).basicInfos;
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
async function getEntityOwners(
  entity_id,
  minimumRole = ENTITIES_ROLE_ENUM.ADMIN,
) {
  return knex('user_entity_role')
    .select()
    .where({ entity_id })
    .andWhere('role', '<=', minimumRole);
}
async function getAllTypeEntities(type) {
  const entities = await knex('entities')
    .select('id', 'type', 'name', 'surname', 'photo_url')
    .leftJoin(
      'entities_general_infos',
      'entities.id',
      '=',
      'entities_general_infos.entity_id',
    )
    .whereNull('deleted_at')
    .where({ type });

  return entities.map(e => {
    const { photo_url: photoUrl, ...otherProps } = e;

    return { ...otherProps, photoUrl };
  });
}

async function getEntitiesTypeById(entityId) {
  const [data] = await knex('entities')
    .select('type')
    .where('id', entityId);

  return data.type;
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
      'entities_general_infos',
      'entities_role.entity_id_admin',
      '=',
      'entities_general_infos.entity_id',
    )
    .leftJoin(
      'entities',
      'entities_role.entity_id_admin',
      '=',
      'entities.id',
    )
    .where('entities_role.entity_id', entityId)
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
      const creator = (await getEntity(creatorId)).basicInfos;
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

async function getNbOfTeamsInEvent(eventId) {
  const [{ count: countRosters }] = await knex('event_rosters')
    .count('team_id')
    .where({
      event_id: eventId,
    })
    .whereIn('registration_status', [
      STATUS_ENUM.ACCEPTED,
      STATUS_ENUM.ACCEPTED_FREE,
    ]);
  const [{ count: countPersons }] = await knex('event_persons')
    .count('person_id')
    .where({
      event_id: eventId,
    })
    .whereIn('registration_status', [
      STATUS_ENUM.ACCEPTED,
      STATUS_ENUM.ACCEPTED_FREE,
    ]);

  return Number(countRosters) + Number(countPersons);
}

async function getLastRankedTeam(eventId) {
  const prerank = await getPrerankPhase(eventId);
  const [{ max: lastTeamRanked }] = await knex('phase_rankings')
    .max('initial_position')
    .where({ current_phase: prerank.id })
    .whereNot({ roster_id: null });
  return lastTeamRanked;
}

async function getScoreSuggestion(gameId) {
  const suggestions = await knex('score_suggestion')
    .select('*')
    .where({
      game_id: gameId,
    })
    .leftJoin(
      knex('game_teams')
        .select('roster_id', 'name')
        .where({ game_id: gameId })
        .as('team'),
      'team.roster_id',
      'score_suggestion.submitted_by_roster',
    )
    .orderBy('created_at', 'asc');

  return suggestions;
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
  const [entity] = await knex('entities')
    .select(
      'entities.id',
      'type',
      'name',
      'city',
      'surname',
      'photo_url',
      'description',
      'quick_description',
    )
    .leftJoin(
      'entities_general_infos',
      'entities.id',
      '=',
      'entities_general_infos.entity_id',
    )
    .leftJoin(
      'person_infos',
      'entities_general_infos.infos_supp_id',
      '=',
      'person_infos.id',
    )
    .leftJoin(
      'addresses',
      'addresses.id',
      '=',
      'person_infos.address_id',
    )
    .where('entities.id', '=', id);

  let role = -1;
  if (userId !== -1) {
    role = await getEntityRole(id, userId);
  }

  return {
    basicInfos: {
      description: entity.description,
      id: entity.id,
      city: entity.city,
      type: entity.type,
      name: entity.name,
      quickDescription: entity.quick_description,
      surname: entity.surname,
      photoUrl: entity.photo_url,
      role,
    },
  };
}

async function getPersonGames(id) {
  const gameIds = (
    await knex('team_players')
      .select('games.id')
      .leftJoin(
        'game_teams',
        'game_teams.roster_id',
        '=',
        'team_players.roster_id',
      )
      .leftJoin('games', 'games.id', '=', 'game_teams.game_id')
      .where({ person_id: id })
  ).map(game => game.id);

  const gamesInfos = await knex('games_all_infos')
    .select(
      'games_all_infos.event_id',
      'games_all_infos.event_name',
      'games_all_infos.id',
      'games_all_infos.timeslot',
      'games_all_infos.field',
      'team_names',
      'team_scores',
      'teams.playersinfos',
    )
    .leftJoin(
      knex('game_teams')
        .select(
          knex.raw('array_agg(game_teams.name) AS team_names'),
          knex.raw('array_agg(game_teams.score) AS team_scores'),
          knex.raw('array_agg(players.playerInfo) AS playersInfos'),
          'game_id',
        )
        .leftJoin(
          knex
            .select(
              knex.raw(
                "json_agg(json_build_object('name', person.name, 'surname', person.surname, 'photo', person.photo_url)) AS playerInfo",
              ),
              'person.roster_id',
            )
            .from(
              knex('game_teams')
                .select(
                  'entities_all_infos.name',
                  'entities_all_infos.surname',
                  'entities_all_infos.photo_url',
                  'game_teams.roster_id',
                )
                .leftJoin(
                  'team_players',
                  'team_players.roster_id',
                  '=',
                  'game_teams.roster_id',
                )
                .leftJoin(
                  'entities_all_infos',
                  ' entities_all_infos.id',
                  '=',
                  'team_players.person_id',
                )
                .where('entities_all_infos.id', id)
                .groupBy(
                  'game_teams.roster_id',
                  'entities_all_infos.name',
                  'entities_all_infos.surname',
                  'entities_all_infos.photo_url',
                )
                .as('person'),
            )
            .groupBy('person.roster_id')
            .as('players'),
          'players.roster_id',
          '=',
          'game_teams.roster_id',
        )
        .whereIn('game_id', gameIds)
        .groupBy('game_id')
        .as('teams'),
      'teams.game_id',
      '=',
      'games_all_infos.id',
    )
    .whereIn('games_all_infos.id', gameIds)
    .andWhere(
      'games_all_infos.timeslot',
      '>',
      knex.raw("NOW() - '12 HOUR'::INTERVAL"),
    )
    .orderBy('games_all_infos.timeslot', 'asc');

  return gamesInfos;
}
async function getTeamGamesInfos(id) {
  const gameIds = (
    await knex('team_rosters')
      .select('games.id')
      .leftJoin(
        'game_teams',
        'game_teams.roster_id',
        '=',
        'team_rosters.id',
      )
      .leftJoin('games', 'games.id', '=', 'game_teams.game_id')
      .where({ team_id: id })
  ).map(game => game.id);

  const gamesInfos = await knex('games_all_infos')
    .select(
      'games_all_infos.event_id',
      'games_all_infos.event_name',
      'games_all_infos.id',
      'games_all_infos.timeslot',
      'games_all_infos.field',
      'team_names',
      'team_scores',
    )
    .leftJoin(
      knex('game_teams')
        .select(
          knex.raw('array_agg(game_teams.name) AS team_names'),
          knex.raw('array_agg(game_teams.score) AS team_scores'),
          'game_id',
        )
        .whereIn('game_id', gameIds)
        .groupBy('game_id')
        .as('teams'),
      'teams.game_id',
      '=',
      'games_all_infos.id',
    )
    .whereIn('games_all_infos.id', gameIds)
    .andWhere(
      'games_all_infos.timeslot',
      '>',
      knex.raw("NOW() - '12 HOUR'::INTERVAL"),
    )
    .orderBy('games_all_infos.timeslot', 'asc');

  return gamesInfos;
}

async function getCreator(id) {
  const [creator] = await knex('entities_role')
    .select('*')
    .where({ entity_id: id, role: 1 });

  const data = (await getEntity(creator.entity_id_admin)).basicInfos;
  return data;
}
async function getCreators(id) {
  const creators = await knex('entities_role')
    .select('*')
    .where({ entity_id: id, role: 1 });

  const data = await Promise.all(
    creators.map(async c => {
      return (await getEntity(c.entity_id_admin)).basicInfos;
    }),
  );
  return data;
}

async function getCreatorsEmails(id) {
  //Could be done in one query
  const creators = await knex('entities_role')
    .select('*')
    .where({ entity_id: id, role: 1 });

  const emails = await Promise.all(
    creators.map(async c => {
      const res = await getEmailsEntity(c.entity_id_admin);
      return res.map(r => r.email);
    }),
  );
  const uniqueEmails = emails.reduce((prev, curr) => {
    curr.forEach(c => {
      if (!prev.find(p => p === c)) {
        prev.push(c);
      }
    });
    return prev;
  }, []);
  return uniqueEmails;
}
async function getTeamCreatorEmail(teamId) {
  //Could be done in one query
  const [creator] = await knex('entities_role')
    .select('*')
    .where({ entity_id: teamId, role: 1 });

  const email = await getEmailPerson(creator.entity_id_admin);
  return email;
}

async function eventInfos(id, userId) {
  const entity = (await getEntity(id)).basicInfos;
  let role = -1;
  if (userId !== -1) {
    role = await getEntityRole(id, userId);
  }
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

async function getMostRecentMember(personId, organizationId) {
  const [member] = await knex('memberships_infos')
    .select('*')
    .rightJoin(
      'entities',
      'entities.id',
      '=',
      'memberships_infos.person_id',
    )
    .whereIn('status', ['paid', 'free'])
    .andWhere('entities.id', '=', personId)
    .andWhere('entities.type', '=', GLOBAL_ENUM.PERSON)
    .andWhere({ organization_id: organizationId })
    .orderBy('memberships_infos.created_at', 'desc');
  return member;
}

async function getMembers(personId, organizationId) {
  const members = await knex('memberships_infos')
    .select('*')
    .rightJoin(
      'entities',
      'entities.id',
      '=',
      'memberships_infos.person_id',
    )
    .where('entities.id', '=', personId)
    .andWhere('entities.type', '=', GLOBAL_ENUM.PERSON)
    .andWhere({ organization_id: organizationId });

  const reduce = members.reduce((prev, curr) => {
    let addCurr = true;
    const filter = prev.filter(p => {
      if (p.member_type != curr.member_type) {
        return true;
      } else {
        if (
          moment(p.expiration_date) > moment(curr.expiration_date)
        ) {
          addCurr = false;
          return true;
        } else {
          return false;
        }
      }
    });
    if (addCurr) {
      return [...filter, curr];
    }
    return filter;
  }, []);
  const res = reduce.map(m => ({
    membershipId: m.membership_id,
    organizationId: m.organization_id,
    personId: m.person_id,
    memberType: m.member_type,
    expirationDate: m.expiration_date,
    id: m.id,
    status: m.status,
  }));
  return res;
}

// NOT USED FOR THE MOMENT
// async function getPriceFromInvoice(invoiceItemId) {
//   const [{ amount: price }] = await knex('stripe_invoice_item')
//     .select('amount')
//     .leftJoin(
//       'stripe_price',
//       'stripe_price.stripe_price_id',
//       '=',
//       'stripe_invoice_item.stripe_price_id',
//     )
//     .where({ invoice_item_id: invoiceItemId });
//   return price;
// }

async function getReports(entityId) {
  const reports = await knex('reports')
    .select('*')
    .where({ entity_id: entityId });

  const sorted = reports.sort((a, b) => {
    return moment(b.created_at) - moment(a.created_at);
  });
  return sorted;
}

async function generateReport(reportId) {
  const [report] = await knex('reports')
    .select('*')
    .where({ report_id: reportId });

  const ReportMap = {
    [REPORT_TYPE_ENUM.MEMBERS]: generateMembersReport,
    [REPORT_TYPE_ENUM.SALES]: generateSalesReport,
  };
  const getReport = ReportMap[report.type];

  const res = await getReport(report);
  return res;
}

async function getPrerankPhase(eventId) {
  const [res] = await knex('phase')
    .select('*')
    .where({
      event_id: eventId,
      phase_order: 0,
      name: 'prerank',
    });
  return res;
}

async function generateMembersReport(report) {
  const { date } = report.metadata;
  const members = await knex('memberships_infos')
    .select('*')
    .where({ organization_id: report.entity_id });
  const active = members.filter(m => {
    return (
      moment(m.created_at).isSameOrBefore(moment(date), 'day') &&
      moment(m.expiration_date).isSameOrAfter(moment(date), 'day')
    );
  });

  const reduce = active.reduce((prev, curr) => {
    let addCurr = true;
    const filter = prev.filter(p => {
      if (
        p.member_type === curr.member_type &&
        p.person_id === curr.person_id
      ) {
        if (
          moment(p.expiration_date) > moment(curr.expiration_date)
        ) {
          addCurr = false;
          return true;
        } else {
          return false;
        }
      }
      return true;
    });
    if (addCurr) {
      return [...filter, curr];
    }
    return filter;
  }, []);
  const res = await Promise.all(
    reduce.map(async a => {
      const person = await getPersonInfos(a.person_id);
      const email = await getEmailPerson(a.person_id);
      const price = await getPriceFromMembershipId(a.membership_id);
      return {
        ...a,
        name: person.name,
        surname: person.surname,
        price,
        email,
      };
    }),
  );
  return res;
}

const getPriceFromMembershipId = async membershipId => {
  const [{ price }] = await knex('entity_memberships')
    .select('price')
    .where({ id: membershipId });
  return price;
};

const getTaxRates = async stripe_price_id => {
  const taxRates = await knex('tax_rates')
    .select('*')
    .leftJoin(
      'tax_rates_stripe_price',
      'tax_rates_stripe_price.tax_rate_id',
      '=',
      'tax_rates.id',
    )
    .where(
      'tax_rates_stripe_price.stripe_price_id',
      '=',
      stripe_price_id,
    );
  return taxRates;
};

async function generateSalesReport(report) {
  const { date } = report.metadata;
  const sales = await knex('store_items_paid')
    .select('*')
    .where({ seller_entity_id: report.entity_id });
  const active = sales.filter(
    s =>
      moment(s.created_at)
        .set('hour', 0)
        .set('minute', 0)
        .set('second', 0) <
      moment(date)
        .set('hour', 0)
        .set('minute', 0)
        .set('second', 0)
        .add(1, 'day'),
  );
  const res = await Promise.all(
    active.map(async a => {
      const person = await getPrimaryPerson(a.buyer_user_id);
      const email = await getEmailUser(a.buyer_user_id);
      const taxes = await getTaxRates(a.stripe_price_id);
      const subtotal = a.amount;
      const totalTax = taxes.reduce((prev, curr) => {
        return prev + (curr.percentage / 100) * a.amount;
      }, 0);
      const total = subtotal + totalTax;
      const plateformFees = a.transaction_fees;
      const totalNet = total - plateformFees;
      if (a.metadata.type === GLOBAL_ENUM.EVENT) {
        const event = await getEntity(a.metadata.id);
        a.metadata.event = event;
      }
      return {
        ...a,
        person,
        email,
        total,
        subtotal,
        totalTax,
        plateformFees,
        totalNet,
      };
    }),
  );
  return res;
}

async function getOrganizationMembers(organizationId) {
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
    .andWhere({ organization_id: organizationId });
  const reduce = members.reduce((prev, curr) => {
    let addCurr = true;
    const filter = prev.filter(p => {
      if (
        p.member_type != curr.member_type ||
        p.person_id != curr.person_id
      ) {
        return true;
      } else {
        if (
          moment(p.expiration_date) > moment(curr.expiration_date)
        ) {
          addCurr = false;
          return true;
        } else {
          return false;
        }
      }
    });
    if (addCurr) {
      return [...filter, curr];
    }
    return filter;
  }, []);

  const res = await Promise.all(
    reduce.map(async m => ({
      organizationId: m.organization_id,
      person: (await getEntity(m.person_id)).basicInfos,
      memberType: m.member_type,
      expirationDate: m.expiration_date,
      id: m.id,
      createdAt: m.created_at,
      status: m.status,
    })),
  );
  return res;
}

async function getOrganizationTokenPromoCode(organizationId) {
  const res = await knex('token_promo_code')
    .select('token_id', 'expires_at', 'used', 'email')
    .where(
      knex.raw(`metadata ->> 'organizationId' = '${organizationId}'`),
    )
    .orderBy('created_at');

  return res;
}

async function getOptions(eventId) {
  const res = await knex('event_payment_options')
    .select(
      'event_payment_options.name',
      'team_price',
      'team_stripe_price_id',
      'individual_price',
      'individual_stripe_price_id',
      'start_time',
      'end_time',
      'id',
      'team_activity',
      'team_acceptation',
      'player_acceptation',
      'informations',
    )
    .leftJoin(
      'entities_general_infos',
      'entities_general_infos.entity_id',
      '=',
      'event_payment_options.event_id',
    )
    .whereNull('event_payment_options.deleted_at')
    .andWhere({ event_id: eventId })
    .orderBy('event_payment_options.created_at');

  return Promise.all(
    res.map(async r => {
      let individualTaxRates = [];
      let teamTaxRates = [];
      let individualTransactionFees = 0;
      let teamTransactionFees = 0;
      let owner = {};
      if (r.team_stripe_price_id) {
        teamTaxRates = await getTaxRates(r.team_stripe_price_id);
        teamTransactionFees = await getTransactionFeesFromStripePriceId(
          r.team_stripe_price_id,
        );
        const ownerId = await getOwnerStripePrice(
          r.team_stripe_price_id,
        );
        owner = await getEntity(ownerId);
      }
      if (r.individual_stripe_price_id) {
        individualTaxRates = await getTaxRates(
          r.individual_stripe_price_id,
        );
        individualTransactionFees = await getTransactionFeesFromStripePriceId(
          r.individual_stripe_price_id,
        );
        const ownerId = await getOwnerStripePrice(
          r.individual_stripe_price_id,
        );
        owner = await getEntity(ownerId);
      }

      return {
        ...r,
        owner,
        teamTaxRates,
        individualTaxRates,
        individualTransactionFees,
        teamTransactionFees,
        startTime: new Date(r.start_time).getTime(),
        endTime: new Date(r.end_time).getTime(),
      };
    }),
  );
}

async function getMemberships(entityId) {
  const memberships = await knex('entity_memberships')
    .select('*')
    .where({ entity_id: entityId });

  return Promise.all(
    memberships.map(async m => {
      const taxRates = await getTaxRates(m.stripe_price_id);
      const transactionFees = await getTransactionFeesFromStripePriceId(
        m.stripe_price_id,
      );
      return {
        ...m,
        transactionFees,
        taxRates,
        price: m.price,
      };
    }),
  );
}

async function getPartners(entityId) {
  const partners = await knex('partners')
    .select('*')
    .where({ organization_id: entityId })
    .orderBy('created_at');
  return partners;
}

async function getTransactionFeesFromStripePriceId(stripePriceId) {
  const [{ transaction_fees: transactionFees }] = await knex(
    'stripe_price',
  )
    .select('*')
    .where({ stripe_price_id: stripePriceId });
  return transactionFees;
}

async function hasMemberships(organizationId) {
  const memberships = await knex('entity_memberships')
    .select('*')
    .where({ entity_id: organizationId });
  return Boolean(memberships.length);
}

async function getMembership(membershipId) {
  const [membership] = await knex('entity_memberships')
    .select('*')
    .where({ id: membershipId });
  return membership;
}

async function getRegistered(teamId, eventId) {
  const rosters = await knex('team_rosters')
    .select('id')
    .where({ team_id: teamId });
  const rostersId = rosters.map(roster => roster.id);
  return knex('event_rosters')
    .select('*')
    .where({
      event_id: eventId,
      registration_status: STATUS_ENUM.ACCEPTED,
    })
    .whereIn('roster_id', rostersId);
}

async function getRegistrationTeamPaymentOption(paymentOptionId) {
  const [teamPaymentOption] = await knex('event_payment_options')
    .select('team_price', 'team_stripe_price_id', 'team_acceptation')
    .where({ id: paymentOptionId });

  return teamPaymentOption;
}
async function getRegistrationIndividualPaymentOption(
  paymentOptionId,
) {
  const [individualPaymentOption] = await knex(
    'event_payment_options',
  )
    .select(
      'individual_price',
      'individual_stripe_price_id',
      'player_acceptation',
    )
    .where({ id: paymentOptionId });

  return individualPaymentOption;
}

async function getOwnerStripePrice(stripePriceId) {
  const [{ owner_id: ownerId }] = await knex('stripe_price')
    .select('owner_id')
    .where({ stripe_price_id: stripePriceId });
  return ownerId;
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
async function getTeamPaymentOptionFromRosterId(rosterId, eventId) {
  const [roster] = await knex('event_rosters')
    .select('payment_option_id', 'team_id')
    .where({ roster_id: rosterId, event_id: eventId });

  const [option] = await knex('event_payment_options')
    .select('team_price', 'team_stripe_price_id')
    .where({ id: roster.payment_option_id });

  return {
    teamPrice: option.team_price,
    teamStripePriceId: option.team_stripe_price_id,
    teamId: roster.team_id,
  };
}

async function getPersonPaymentOption(personId, eventId) {
  const [person] = await knex('event_persons')
    .select('payment_option_id')
    .where({ person_id: personId, event_id: eventId });

  const [option] = await knex('event_payment_options')
    .select('individual_price', 'individual_stripe_price_id')
    .where({ id: person.payment_option_id });

  return {
    individualPrice: option.individual_price,
    individualStripePriceId: option.individual_stripe_price_id,
  };
}

async function getTeamCaptains(teamId, userId) {
  const caps = await knex('entities_role')
    .select('entity_id_admin')
    .where('role', '=', ENTITIES_ROLE_ENUM.ADMIN)
    .andWhere('entity_id', '=', teamId);

  const captainIds = caps.map(c => c.entity_id_admin);

  const captains = await Promise.all(
    captainIds.map(async id => {
      return (await getEntity(id, userId)).basicInfos;
    }),
  );
  return captains;
}
async function getPaymentOption(paymentOptionId) {
  const [option] = await knex('event_payment_options')
    .select('*')
    .where({ id: paymentOptionId });
  return option;
}

async function getAllTeamsRegistered(eventId) {
  const teams = await knex('event_rosters')
    .select('*')
    .where({
      event_id: eventId,
    });
  return teams;
}

async function getAllPeopleRegistered(eventId) {
  const people = await knex('event_persons')
    .select('*')
    .where({
      event_id: eventId,
    });
  return people;
}

async function getAllTeamsAcceptedRegistered(eventId) {
  const teams = await knex('event_rosters')
    .select('*')
    .whereIn('registration_status', [
      STATUS_ENUM.ACCEPTED,
      STATUS_ENUM.ACCEPTED_FREE,
    ])
    .andWhere({
      event_id: eventId,
    });
  return teams;
}

async function getAllPlayersAcceptedRegistered(eventId) {
  const people = await knex('event_persons')
    .select('*')
    .whereIn('registration_status', [
      STATUS_ENUM.ACCEPTED,
      STATUS_ENUM.ACCEPTED_FREE,
    ])
    .andWhere({
      event_id: eventId,
    });
  return people;
}

async function getStripeInvoiceItem(invoiceItemId) {
  const [res] = await knex('stripe_invoice_item')
    .select('*')
    .where({ invoice_item_id: invoiceItemId });
  return res;
}
async function getAllTeamsRegisteredInfos(eventId, userId) {
  const teams = await getAllTeamsRegistered(eventId);

  const res = await Promise.all(
    teams.map(async t => {
      let invoice = null;
      if (t.invoice_item_id) {
        invoice = await getStripeInvoiceItem(t.invoice_item_id);
      }
      const entity = (await getEntity(t.team_id, userId)).basicInfos;
      const email = await getTeamCreatorEmail(t.team_id);
      const players = await getRoster(t.roster_id, true);
      const captains = await getTeamCaptains(t.team_id, userId);
      const option = await getPaymentOption(t.payment_option_id);
      const role = await getRoleRoster(t.roster_id, userId);
      const registrationStatus = await getRegistrationStatus(
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
        registeredOn: t.created_at,
        informations: t.informations,
        email,
        players,
        captains,
        option,
        invoice,
        role,
        registrationStatus,
      };
    }),
  );

  res.sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  });

  res.sort((a, b) => {
    if (
      a.registrationStatus === STATUS_ENUM.REFUSED ||
      (a.registrationStatus === STATUS_ENUM.PENDING &&
        b.registrationStatus !== STATUS_ENUM.REFUSED)
    ) {
      return 1;
    }
    if (
      b.registrationStatus === STATUS_ENUM.REFUSED ||
      (b.registrationStatus === STATUS_ENUM.PENDING &&
        a.registrationStatus !== STATUS_ENUM.REFUSED)
    ) {
      return -1;
    }
    return 0;
  });
  return res;
}
async function getAllTeamsAcceptedInfos(eventId, userId) {
  const teams = await getAllTeamsAcceptedRegistered(eventId);

  const res = await Promise.all(
    teams.map(async t => {
      const entity = (await getEntity(t.team_id, userId)).basicInfos;
      const emails = await getEmailsEntity(t.team_id);
      const players = await getRoster(t.roster_id, true);
      const captains = await getTeamCaptains(t.team_id, userId);
      const option = await getPaymentOption(t.payment_option_id);
      const role = await getRoleRoster(t.roster_id, userId);
      const registrationStatus = await getRegistrationStatus(
        t.roster_id,
      );
      return {
        name: entity.name,
        surname: entity.surname,
        photoUrl: entity.photoUrl,
        rosterId: t.roster_id,
        teamId: t.team_id,
        invoiceItemId: t.invoice_item_id,
        informations: t.informations,
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

  res.sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  });

  return res;
}

async function getAllPeopleRegisteredInfos(eventId, userId) {
  const people = await getAllPeopleRegistered(eventId);

  const res = await Promise.all(
    people.map(async p => {
      let invoice = null;
      if (p.invoice_item_id) {
        invoice = await getStripeInvoiceItem(p.invoice_item_id);
      }
      const entity = (await getEntity(p.person_id, userId))
        .basicInfos;
      const email = await getEmailPerson(p.person_id);
      const option = await getPaymentOption(p.payment_option_id);
      return {
        personId: p.person_id,
        name: entity.name,
        surname: entity.surname,
        completeName: `${entity.name} ${entity.surname}`,
        photoUrl: entity.photoUrl,
        invoiceItemId: p.invoice_item_id,
        status: p.status,
        registeredOn: p.created_at,
        informations: p.informations,
        invoice,
        email,
        option,
        registrationStatus: p.registration_status,
      };
    }),
  );

  res.sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  });
  res.sort((a, b) => {
    if (
      a.registrationStatus === STATUS_ENUM.REFUSED ||
      (a.registrationStatus === STATUS_ENUM.PENDING &&
        b.registrationStatus !== STATUS_ENUM.REFUSED)
    ) {
      return 1;
    }
    if (
      b.registrationStatus === STATUS_ENUM.REFUSED ||
      (b.registrationStatus === STATUS_ENUM.PENDING &&
        a.registrationStatus !== STATUS_ENUM.REFUSED)
    ) {
      return -1;
    }
    return 0;
  });
  return res;
}

async function getRemainingSpots(eventId) {
  const [{ count: countRosters }] = await knex('event_rosters')
    .count('team_id')
    .where({
      event_id: eventId,
    })
    .whereIn('registration_status', [
      STATUS_ENUM.ACCEPTED,
      STATUS_ENUM.ACCEPTED_FREE,
    ]);

  const [{ count: countPersons }] = await knex('event_persons')
    .count('person_id')
    .where({
      event_id: eventId,
    })
    .whereIn('registration_status', [
      STATUS_ENUM.ACCEPTED,
      STATUS_ENUM.ACCEPTED_FREE,
    ]);

  const [event] = await knex('events')
    .select('maximum_spots')
    .where({ id: eventId });

  if (!event.maximum_spots) {
    return null;
  }
  return (
    event.maximum_spots - Number(countRosters) - Number(countPersons)
  );
}

async function getPreranking(eventId) {
  const prerankPhase = await getPrerankPhase(eventId);

  const preranking = await knex('phase_rankings')
    .select('*')
    .where({ current_phase: prerankPhase.id });

  const res = await Promise.all(
    preranking.map(async r => {
      if (r.roster_id) {
        const name = await getTeamName(r.roster_id);
        const teamId = await getTeamIdFromRosterId(r.roster_id);
        return {
          position: r.initial_position,
          name,
          rankingId: r.ranking_id,
          phaseId: prerankPhase.id,
          rosterId: r.roster_id,
          teamId,
          noTeam: false,
        };
      } else {
        return {
          position: r.initial_position,
          rankingId: r.ranking_id,
          phaseId: prerankPhase.id,
          noTeam: true,
        };
      }
    }),
  );
  res.sort((a, b) => a.position - b.position);
  return { preranking: res, prerankPhaseId: prerankPhase.id };
}

async function getRegistrationStatus(rosterId) {
  const [registration] = await knex('event_rosters')
    .select('registration_status')
    .where({
      roster_id: rosterId,
    });

  return registration.registration_status;
}

async function getRoster(rosterId, withSub) {
  let whereCond = { roster_id: rosterId };
  if (!withSub) {
    whereCond.is_sub = false;
  }

  const roster = await knex('team_players')
    .select('*')
    .where(whereCond)
    .orderByRaw(
      `array_position(array['${ROSTER_ROLE_ENUM.COACH}'::varchar, '${ROSTER_ROLE_ENUM.CAPTAIN}'::varchar, '${ROSTER_ROLE_ENUM.ASSISTANT_CAPTAIN}'::varchar, '${ROSTER_ROLE_ENUM.PLAYER}'::varchar], role)`,
    );

  //TODO: Make a call to know if has created an account or is child account
  const status = TAG_TYPE_ENUM.REGISTERED;

  const props = roster.map(player => ({
    id: player.id,
    name: player.name,
    personId: player.person_id,
    role: player.role,
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
  const primaryPerson = (await getEntity(id)).basicInfos;
  return primaryPerson;
};

async function getRoleRoster(rosterId, userId) {
  const [{ role } = {}] = await knex('team_players')
    .select('team_players.role')
    .join(
      'user_entity_role',
      'user_entity_role.entity_id',
      'team_players.person_id',
    )
    .where({ roster_id: rosterId, user_id: userId })
    .orderByRaw(
      `array_position(array['${ROSTER_ROLE_ENUM.COACH}'::varchar, '${ROSTER_ROLE_ENUM.CAPTAIN}'::varchar, '${ROSTER_ROLE_ENUM.ASSISTANT_CAPTAIN}'::varchar, '${ROSTER_ROLE_ENUM.PLAYER}'::varchar], team_players.role)`,
    )
    .limit(1);
  if (role) {
    return role;
  } else {
    return ROSTER_ROLE_ENUM.VIEWER;
  }
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
const getPersonInvoiceItem = async body => {
  const { eventId, personId } = body;

  const [{ invoice_item_id: invoiceItemId, status }] = await knex(
    'event_persons',
  )
    .select(['invoice_item_id', 'status'])
    .where({ person_id: personId, event_id: eventId });

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
async function getEmailUser(userId) {
  const [{ email }] = await knex('user_email')
    .select('email')
    .where({ user_id: userId });
  return email;
}

async function getEmailPerson(person_id) {
  const [{ email }] = await knex('user_entity_role')
    .select('email')
    .leftJoin(
      'user_email',
      'user_email.user_id',
      '=',
      'user_entity_role.user_id',
    )
    .where('user_entity_role.entity_id', person_id);
  if (!email) {
    return getEmailsEntity(person_id);
  }
  return email;
}

async function getEvent(eventId) {
  const [res] = await knex('events')
    .select('*')
    .where({ id: eventId });
  return res;
}

async function getEventAdmins(eventId) {
  const admins = await knex('entities_role')
    .select('user_entity_role.user_id')
    .leftJoin(
      'user_entity_role',
      'user_entity_role.entity_id',
      '=',
      'entities_role.entity_id_admin',
    )
    .where('entities_role.entity_id', '=', eventId)
    .andWhere('entities_role.role', '<=', ENTITIES_ROLE_ENUM.EDITOR);

  const res = await admins.reduce(async (prev, curr) => {
    if (curr.user_id) {
      return prev.concat(curr.user_id);
    }
    const currIteration = await curr;
    const res = await getEventAdmins(currIteration.entity_id_admin);
    return prev.concat(res);
  }, []);
  return res;
}

async function getAlias(entityId) {
  const [res] = await knex('alias')
    .select('*')
    .where({ id: entityId });
  if (!res) {
    return { entityId };
  }
  return res;
}

async function getPhasesWithoutPrerank(eventId) {
  //order 0 indicates prerank of the event
  const phases = await knex('phase')
    .select('*')
    .where({ event_id: eventId })
    .whereNot({ phase_order: 0 });

  const res = await Promise.all(
    phases.map(async phase => {
      const ranking = await getPhaseRanking(phase.id);
      return { ...phase, ranking };
    }),
  );
  return res;
}

async function getAllPhases(eventId) {
  const res = await knex('phase')
    .select('*')
    .where({ event_id: eventId });
  return res;
}

async function getPhaseRanking(phaseId) {
  const rankings = await knex('phase_rankings')
    .select('*')
    .where({ current_phase: phaseId });
  rankings.sort((a, b) => a.initial_position - b.initial_position);

  const rankingsWithName = await Promise.all(
    rankings.map(async r => {
      if (r.roster_id) {
        const phaseName = await getPhaseName(r.origin_phase);
        const name = await getRosterName(r.roster_id);
        return { ...r, name, teamName: name, phaseName };
      }
      if (r.origin_phase && r.origin_position && !r.roster_id) {
        const phaseName = await getPhaseName(r.origin_phase);
        return { ...r, phaseName };
      } else {
        return { ...r };
      }
    }),
  );
  return rankingsWithName;
}

async function getPositions(gameId) {
  let positions = await knex('game_teams')
    .select('*')
    .where({ game_id: gameId });

  await Promise.all(
    positions.map(async (p, index) => {
      if (p.roster_id) {
        positions[index].teamName = p.name;
        const photoUrl = await getPhotoFromRosterId(p.roster_id);
        if (photoUrl) {
          positions[index].photoUrl = photoUrl;
        }
      }
    }),
  );

  return positions;
}

async function getPhotoFromRosterId(rosterId) {
  const teamId = await getTeamIdFromRosterId(rosterId);
  const [{ photo_url: photoUrl }] = await knex(
    'entities_general_infos',
  )
    .select('photo_url')
    .where({ entity_id: teamId });
  return photoUrl;
}

async function getGames(eventId) {
  const games = await knex('games')
    .select('*')
    .whereNotNull('timeslot_id', 'field_id')
    .andWhere({ event_id: eventId });

  const res = await Promise.all(
    games.map(async game => {
      const positions = await getPositions(game.id);
      let phaseName = null;
      if (game.phase_id) {
        phaseName = await getPhaseName(game.phase_id);
      }
      const [r1] = await knex('event_fields')
        .select('field')
        .where({ id: game.field_id });
      const [r2] = await knex('event_time_slots')
        .select('date')
        .where({ id: game.timeslot_id });
      // field and start_time are temporary, this will change when all the schedule logic will be handled in backend.
      // For now this is so it can still works even after adding the new ids to these fields.
      return {
        ...game,
        phaseName,
        positions,
        field: r1.field,
        start_time: r2.date,
      };
    }),
  );
  return res;
}

async function getRosterByEventAndUser(eventId, userId) {
  const [{ primary_person: id }] = await knex('user_primary_person')
    .select('primary_person')
    .where({ user_id: userId });

  const res = await knex('team_players')
    .select('entities_general_infos.name', 'event_rosters.roster_id')
    .leftJoin(
      'event_rosters',
      'event_rosters.roster_id',
      '=',
      'team_players.roster_id',
    )
    .leftJoin(
      'team_rosters',
      'event_rosters.roster_id',
      '=',
      'team_rosters.id',
    )
    .leftJoin(
      'entities_general_infos',
      'team_rosters.team_id',
      '=',
      'entities_general_infos.entity_id',
    )
    .where({ person_id: id, event_id: eventId });

  return res;
}

async function getRostersNames(rostersArray) {
  const res = await knex
    .queryBuilder()
    .select('name', 'roster_id')
    .from('event_rosters')
    .join(
      'entities_general_infos',
      'entities_general_infos.entity_id',
      'event_rosters.team_id',
    )
    .whereIn('roster_id', rostersArray);
  return res;
}
async function getRosterName(roster_id) {
  const [res] = await knex
    .queryBuilder()
    .select('name')
    .from('event_rosters')
    .join(
      'entities_general_infos',
      'entities_general_infos.entity_id',
      'event_rosters.team_id',
    )
    .where({ roster_id });
  if (!res) {
    return;
  }
  return res.name;
}

async function getAttendanceSheet(infos) {
  return knex('game_players_attendance')
    .select()
    .where(infos);
}

async function getGamePlayersWithRole(game_id) {
  return knex('game_players_view')
    .select(
      'player_id',
      'event_id',
      'player_owner',
      'event_name',
      'roster_id',
    )
    .where({ game_id })
    .whereNot({ player_role: ROSTER_ROLE_ENUM.PLAYER });
}

async function getGameTeams(game_id, player_id) {
  if (!player_id)
    return knex('game_teams')
      .select()
      .where({ game_id });
  else {
    //Will return the player id in player_id column if player is in team, null if he isn't
    const players = knex('game_players_view')
      .select('player_id', 'roster_id')
      .where({ game_id, player_id })
      .as('players');
    return knex
      .select(
        'game_id',
        'game_teams.roster_id',
        'players.player_id',
        'name',
      )
      .from('game_teams')
      .where({ game_id })
      .leftJoin(players, 'game_teams.roster_id', 'players.roster_id');
  }
}

async function getMyPersonsAdminsOfTeam(rosterId, userId) {
  const res = await knex('user_entity_role')
    .select(
      'user_entity_role.entity_id',
      'entities_general_infos.name',
      'entities_general_infos.surname',
    )
    .leftJoin(
      'team_players',
      'team_players.person_id',
      '=',
      'user_entity_role.entity_id',
    )
    .leftJoin(
      'entities_general_infos',
      'entities_general_infos.entity_id',
      '=',
      'user_entity_role.entity_id',
    )
    .where({ user_id: userId })
    .whereIn('team_players.role', [
      ROSTER_ROLE_ENUM.COACH,
      ROSTER_ROLE_ENUM.CAPTAIN,
      ROSTER_ROLE_ENUM.ASSISTANT_CAPTAIN,
    ])
    .andWhere('team_players.roster_id', '=', rosterId);

  return res.length
    ? res.map(p => ({
        entityId: p.entity_id,
        completeName: `${p.name} ${p.surname}`,
      }))
    : undefined;
}

async function getGameSubmissionInfos(gameId, myRosterId) {
  const scoreSuggestions = await knex('score_suggestion')
    .select('*')
    .where({ game_id: gameId });

  const [spiritSubmission] = await knex('spirit_submission')
    .select('spirit_score', 'comment')
    .where({ game_id: gameId, submitted_by_roster: myRosterId });

  const presences = await knex('game_players_attendance')
    .select(
      knex.raw(
        "string_agg(entities_general_infos.name || ' ' || entities_general_infos.surname, ' ') AS complete_name",
      ),
      'game_players_attendance.player_id',
      'game_players_attendance.is_sub',
    )
    .leftJoin(
      'entities_general_infos',
      'entities_general_infos.entity_id',
      '=',
      'game_players_attendance.player_id',
    )
    .where({ game_id: gameId, roster_id: myRosterId })
    .andWhere('status', '=', PLAYER_ATTENDANCE_STATUS.PRESENT)
    .groupBy(
      'entities_general_infos.name',
      'entities_general_infos.surname',
      'game_players_attendance.player_id',
      'game_players_attendance.is_sub',
    );

  return {
    scoreSuggestions,
    spiritSubmission,
    presences: presences.map(p => ({
      value: p.player_id,
      display: p.complete_name,
      isSub: p.is_sub,
    })),
  };
}

async function isPlayerInRoster(player_id, roster_id) {
  const [res] = await knex('team_players').where({
    roster_id,
    person_id: player_id,
  });
  return Boolean(res);
}

const isTeamRegisteredInEvent = async (teamId, eventId) => {
  const [res] = await knex('event_rosters')
    .select('roster_id')
    .where({ event_id: eventId, team_id: teamId });
  return Boolean(res);
};

async function getUnplacedGames(eventId) {
  const unplacedGames = await knex('games')
    .select('*')
    .where({ event_id: eventId, timeslot_id: null, field_id: null });

  const res = await Promise.all(
    unplacedGames.map(async game => {
      const teams = await getTeams(game.id);
      let phaseName = null;
      if (game.phase_id) {
        phaseName = await getPhaseName(game.phase_id);
      }
      return {
        ...game,
        phaseName,
        teams,
      };
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

async function getTeamsPhase(phaseId) {
  const rankings = await knex('phase_rankings')
    .select('*')
    .whereNotNull('roster_id')
    .where({ current_phase: phaseId });

  rankings.sort((a, b) => a.initial_position - b.initial_position);

  const rankingsWithName = await Promise.all(
    rankings.map(async r => {
      const phaseName = await getPhaseName(r.origin_phase);
      const name = await getRosterName(r.roster_id);
      const teamId = await getTeamIdFromRosterId(r.roster_id);
      return { ...r, teamId, name, phaseName };
    }),
  );
  return rankingsWithName;
}

async function getPhasesGameAndTeams(eventId, phaseId) {
  const games = await knex('games')
    .select('*')
    .where({ event_id: eventId, phase_id: phaseId });

  const teams = await getTeamsPhase(phaseId);

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
  return { games: res, teams };
}

async function getPhaseGames(phaseId) {
  const games = await knex('games')
    .select('*')
    .where({ phase_id: phaseId });

  return games;
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

  const teamInfo = await Promise.all(
    teams.map(async team => {
      if (team.roster_id) {
        const realTeamId = await getTeamIdFromRosterId(
          team.roster_id,
        );
        const [entities_photo] = await knex('entities_general_infos')
          .select('photo_url')
          .where('entity_id', realTeamId);

        const roster = await getRoster(team.roster_id);
        return {
          game_id: team.game_id,
          roster_id: team.roster_id,
          score: team.score,
          position: team.position,
          name: team.name,
          id: realTeamId,
          spirit: team.spirit,
          created_at: team.created_at,
          updated_at: team.updated_at,
          photo_url: entities_photo.photo_url,
          ranking_id: team.ranking_id,
          roster,
        };
      } else {
        return {
          game_id: team.game_id,
          score: team.score,
          name: team.name,
          spirit: team.spirit,
          ranking_id: team.ranking_id,
        };
      }
    }),
  );

  return teamInfo;
};

async function getSlots(eventId) {
  const res = await knex('event_time_slots')
    .select('*')
    .where({ event_id: eventId })
    .orderBy('date');
  return res;
}

async function getTeamsSchedule(eventId) {
  const res = await knex('event_rosters')
    .select('team_id', 'roster_id', 'event_id', 'name')
    .leftJoin(
      'entities_general_infos',
      'entities_general_infos.entity_id',
      '=',
      'event_rosters.team_id',
    )
    .whereIn('registration_status', [
      STATUS_ENUM.ACCEPTED_FREE,
      STATUS_ENUM.ACCEPTED,
    ])
    .andWhere({ event_id: eventId });
  return res;
}

async function getFields(eventId) {
  const res = await knex('event_fields')
    .select('*')
    .where({ event_id: eventId });
  return res;
}

async function getGeneralInfos(entityId) {
  const [res] = await knex('entities_general_infos')
    .select('*')
    .where({ entity_id: entityId });
  return {
    name: res.name,
    entityId: res.entity_id,
    description: res.description,
    quickDescription: res.quick_description,
  };
}

async function getGraphAmountGeneratedByEvent(
  eventPaymentId,
  language,
  date,
) {
  const [ids] = await knex('event_payment_options')
    .select(
      'name',
      'team_stripe_price_id',
      'individual_stripe_price_id',
    )
    .where('id', eventPaymentId);

  const graphIncomeData = await knex.select(
    knex.raw(`
    sum(s.quantity* ((stripe_price.amount + (stripe_price.amount*(COALESCE(percentage,0) / 100))) - COALESCE(stripe_price.transaction_fees,0))) as total,
    COALESCE(sum(s.quantity* ((stripe_price.amount + (stripe_price.amount*(COALESCE(percentage,0) / 100))) - COALESCE(stripe_price.transaction_fees,0))) - COALESCE(lag(sum(s.quantity* ((stripe_price.amount + (stripe_price.amount*(COALESCE(percentage,0) / 100))) - COALESCE(stripe_price.transaction_fees,0)))) over(order by date), 0), 0) as new, date
    FROM (select * ,generate_series
        ( ('${date}'::timestamp - interval '30' day )::timestamp
        , '${date}'::timestamp
        , interval '1 day')::date AS date
	      FROM store_items_paid
	      ) s
    left join stripe_price on s.stripe_price_id = stripe_price.stripe_price_id
    left join tax_rates_stripe_price on s.stripe_price_id =tax_rates_stripe_price.stripe_price_id
    left join tax_rates on tax_rates_stripe_price.tax_rate_id = tax_rates.id
      where s.created_at::date <= date and stripe_price.stripe_price_id in ('${ids.team_stripe_price_id}', '${ids.individual_stripe_price_id}')
      group by date
      order by date asc
      `),
  );

  const graphFeeData = await knex.select(
    knex.raw(`
    sum(s.quantity* (COALESCE(stripe_price.transaction_fees,0))) as total,
    COALESCE(sum(s.quantity* (COALESCE(stripe_price.transaction_fees,0))) - COALESCE(lag(sum(s.quantity* (COALESCE(stripe_price.transaction_fees,0)))) over(order by date), 0), 0) as new, date
    FROM (select * ,generate_series
        ( ('${date}'::timestamp - interval '30' day )::timestamp
        , '${date}'::timestamp
        , interval '1 day')::date AS date
	      FROM store_items_paid
	      ) s
    left join stripe_price on s.stripe_price_id = stripe_price.stripe_price_id
    left join tax_rates_stripe_price on s.stripe_price_id =tax_rates_stripe_price.stripe_price_id
    left join tax_rates on tax_rates_stripe_price.tax_rate_id = tax_rates.id
      where s.created_at::date <= date and stripe_price.stripe_price_id in ('${ids.team_stripe_price_id}', '${ids.individual_stripe_price_id}')
      group by date
      order by date asc
      `),
  );

  const dataIncome = graphIncomeData.map(o => {
    return {
      incomeDate: moment(o.date)
        .locale(language)
        .format('ll'),
      totalIncomeAmount: Number(o.total) / 100,
    };
  });

  const dataFee = graphFeeData.map(o => {
    return {
      date: moment(o.date)
        .locale(language)
        .format('ll'),
      totalFeeTransaction: Number(o.total) / 100,
    };
  });

  var data = dataIncome.map(function(v, i) {
    return {
      incomeDate: v.incomeDate,
      totalIncomeAmount: v.totalIncomeAmount,
      date: dataFee[i].date,
      totalFeeTransaction: dataFee[i].totalFeeTransaction,
    };
  });

  const lines = [
    {
      stroke: '#008A6C',
      strokeWidth: 2,
      name: 'income',
      nameSingular: 'income',
      dataKey: 'totalIncomeAmount',
      dot: false,
    },
    {
      stroke: '#00478a',
      strokeWidth: 2,
      name: 'fees',
      nameSingular: 'fees',
      dataKey: 'totalFeeTransaction',
      dot: false,
    },
  ];

  const [date2] = await knex('store_items_paid')
    .min('created_at')
    .whereIn('stripe_price_id', [
      ids.team_stripe_price_id,
      ids.individual_stripe_price_id,
    ]);

  return {
    name: ids.name,
    lines: lines,
    data: data,
    minDate: date2.min,
  };
}

async function getGraphUserCount(date, language) {
  const graphData = await knex.select(
    knex.raw(
      `count(*) as total, COALESCE(count(*) - COALESCE(lag(count(*)) over(order by date), 0) , 0) as new,date
      FROM (select * ,generate_series
      ( ('${date}'::timestamp - interval '30' day )::timestamp
      , '${date}'::timestamp
      , interval '1 day')::date AS date
      FROM users e
      ) s
    where created_at::date <= date
    group by date
    order by date asc`,
    ),
  );

  const [data2] = await knex('users').min('created_at');

  const data = graphData.map(o => {
    return {
      name: moment(o.date)
        .locale(language)
        .format('ll'),
      totalMember: Number(o.total),
    };
  });

  const lines = [
    {
      stroke: '#008A6C',
      strokeWidth: 2,
      name: 'member.members',
      nameSingular: 'member.member',
      dataKey: 'totalMember',
      dot: false,
    },
  ];

  return {
    lines: lines,
    data: data,
    minDate: data2.min,
  };
}

async function getGraphMemberCount(organizationId, date) {
  const graphData = await knex.select(
    knex.raw(
      `count(*) as total, date
      FROM (select * ,generate_series
      ( ('${date}'::timestamp - interval '30' day )::timestamp
      , '${date}'::timestamp
      , interval '1 day')::date AS date
      FROM memberships e
      ) s
    where organization_id = '${organizationId}' and created_at::date <= date and expiration_date::date >= date
    group by date
    order by date asc`,
    ),
  );

  const data = graphData.map(o => {
    return {
      name: moment(o.date).format('DD/MM'),
      totalMember: Number(o.total),
    };
  });

  const lines = [
    {
      stroke: '#008A6C',
      strokeWidth: 2,
      name: 'member.members',
      nameSingular: 'member.member',
      dataKey: 'totalMember',
      dot: false,
    },
  ];

  const [data2] = await knex('memberships')
    .min('created_at')
    .where({ organization_id: organizationId });

  return {
    lines: lines,
    data: data,
    minDate: data2.min,
  };
}

async function getPersonInfos(entityId) {
  const [res] = await knex('person_all_infos')
    .select('*')
    .where({ id: entityId });

  let resObj = {
    photoUrl: res.photo_url,
    name: res.name,
    surname: res.surname,
    birthDate: res.birth_date,
    gender: res.gender,
    phoneNumber: res.phone_number,
    formattedAddress: res.address,
    emergencyName: res.emergency_name,
    emergencySurname: res.emergency_surname,
    emergencyPhoneNumber: res.emergency_phone_number,
    medicalConditions: res.medical_conditions,
  };

  const [fullAddress] = await knex('addresses')
    .select('*')
    .where({ id: res.address_id });

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

async function getAllTeamsPending(eventId) {
  const teams = await knex('event_rosters')
    .select('*')
    .where({
      event_id: eventId,
      registration_status: STATUS_ENUM.PENDING,
    });
  const res = await Promise.all(
    teams.map(async t => {
      const team = (await getEntity(t.team_id)).basicInfos;
      const event = (await getEntity(eventId)).basicInfos;
      const roster = await getRoster(t.roster_id);
      const paymentOption = await getPaymentOption(
        t.payment_option_id,
      );
      return {
        id: t.roster_id,
        name: team.name,
        photoUrl: team.photoUrl,
        team: t,
        roster,
        paymentOption,
        event,
        registrationStatus: STATUS_ENUM.PENDING,
      };
    }),
  );
  return res;
}
async function getAllTeamsRefused(eventId) {
  const teams = await knex('event_rosters')
    .select('*')
    .where({
      event_id: eventId,
      registration_status: STATUS_ENUM.REFUSED,
    });
  const res = await Promise.all(
    teams.map(async t => {
      const team = (await getEntity(t.team_id)).basicInfos;
      const event = (await getEntity(eventId)).basicInfos;
      const roster = await getRoster(t.roster_id);
      const paymentOption = await getPaymentOption(
        t.payment_option_id,
      );
      return {
        id: t.roster_id,
        name: team.name,
        photoUrl: team.photoUrl,
        team: t,
        roster,
        paymentOption,
        event,
        registrationStatus: STATUS_ENUM.REFUSED,
      };
    }),
  );
  return res;
}

async function getAllPlayersRefused(eventId) {
  const registeredPlayers = await knex('event_persons')
    .select('*')
    .where({
      event_id: eventId,
      registration_status: STATUS_ENUM.REFUSED,
    });

  const res = await Promise.all(
    registeredPlayers.map(async p => {
      const person = await getPersonInfos(p.person_id);
      const event = (await getEntity(eventId)).basicInfos;
      const paymentOption = await getPaymentOption(
        p.payment_option_id,
      );
      return {
        id: p.person_id,
        name: person.name,
        surname: person.surname,
        birthDate: person.birthDate,
        fullAddress: person.fullAddress,
        gender: person.gender,
        photoUrl: person.photoUrl,
        paymentOption,
        player: p,
        event,
        registrationStatus: STATUS_ENUM.REFUSED,
      };
    }),
  );
  return res;
}

async function getAllPlayersPending(eventId) {
  const registeredPlayers = await knex('event_persons')
    .select('*')
    .where({
      event_id: eventId,
      registration_status: STATUS_ENUM.PENDING,
    });

  //Get all the team players that their payment status is pending
  //Dont need this for now but maybe for later
  // const rosters = await knex('event_rosters')
  //   .select('roster_id')
  //   .where({ event_id: eventId });

  // const teamPlayers = await Promise.all(
  //   rosters.map(async r => {
  //     const players = await knex('team_players')
  //       .select('*')
  //       .where({
  //         roster_id: r.roster_id,
  //         payment_status: STATUS_ENUM.PENDING,
  //       });
  //     return players;
  //   }, []),
  // );

  // const teamPlayersConcat = teamPlayers.reduce((prev, curr) => [
  //   ...prev,
  //   ...curr,
  // ]);

  // const allPlayers = registeredPlayers.concat(teamPlayersConcat);

  const res = await Promise.all(
    registeredPlayers.map(async p => {
      const person = await getPersonInfos(p.person_id);
      const event = (await getEntity(eventId)).basicInfos;
      const paymentOption = await getPaymentOption(
        p.payment_option_id,
      );

      return {
        id: p.person_id,
        name: person.name,
        surname: person.surname,
        birthDate: person.birthDate,
        fullAddress: person.fullAddress,
        gender: person.gender,
        photoUrl: person.photoUrl,
        paymentOption,
        player: p,
        event,
        registrationStatus: STATUS_ENUM.PENDING,
      };
    }),
  );
  return res;
}

async function getRankingRoster(
  eventId,
  originPhase,
  originPosition,
) {
  const prerankPhase = await getPrerankPhase(eventId);
  if (originPhase === prerankPhase.id) {
    const res = await knex('phase_rankings')
      .select('*')
      .where({
        current_phase: prerankPhase.id,
        initial_position: originPosition,
      })
      .whereNot({ roster_id: null });
    return res;
  } else {
    const res = await knex('phase_rankings')
      .select('*')
      .where({
        current_phase: originPhase,
        final_position: originPosition,
      })
      .whereNot({ roster_id: null });
    return res;
  }
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
  startDate,
  endDate,
) {
  const [entity] = await knex('events')
    .update({
      maximum_spots: maximumSpots,
      start_date: startDate,
      end_date: endDate,
      start_varchar: startDate,
      end_varchar: endDate,
    })
    .where({ id: eventId })
    .returning('*');
  await updatePrerankSpots(eventId, maximumSpots);

  return entity;
}

async function addSpotsPreranking(spotsToAdd, nbOfSpots, prerankId) {
  for (let i = 0; i < spotsToAdd; ++i) {
    await knex('phase_rankings').insert({
      current_phase: prerankId,
      initial_position: Number(nbOfSpots + i + 1),
    });
  }
}

async function updatePrerankSpots(eventId, newSpots) {
  const prerank = await getPrerankPhase(eventId);
  if (!newSpots) {
    const [totalSpot] = await knex('phase_rankings')
      .count('initial_position')
      .where({
        current_phase: prerank.id,
      });
    const deleted = await knex('phase_rankings')
      .where({
        current_phase: prerank.id,
        roster_id: null,
      })
      .del()
      .returning('*');

    const res = await knex('phase_rankings')
      .select(
        'initial_position',
        'current_phase',
        'roster_id',
        'ranking_id',
      )
      .where({
        current_phase: prerank.id,
      });

    res.sort((a, b) => a.initial_position - b.initial_position);

    await Promise.all(
      res.map(async (r, index) => {
        await knex('phase_rankings')
          .update({ initial_position: index + 1 })
          .where({
            roster_id: r.roster_id,
            current_phase: prerank.id,
          });
      }),
    );

    for (let i = 0; i < deleted.length; ++i) {
      await knex('phase_rankings')
        .update({
          roster_id: null,
          origin_phase: null,
          origin_position: null,
        })
        .where({
          origin_phase: prerank.id,
          origin_position: Number(totalSpot.count) - i,
        });
    }
  } else if (!prerank.spots) {
    const [{ count: countSpots }] = await knex('phase_rankings')
      .count('roster_id')
      .where({
        current_phase: prerank.id,
      });

    const spotsToAdd = Number(newSpots - countSpots);

    await addSpotsPreranking(
      spotsToAdd,
      Number(countSpots),
      prerank.id,
    );
  } else if (newSpots > Number(prerank.spots)) {
    const spotsToAdd = Number(newSpots - prerank.spots);

    await addSpotsPreranking(
      spotsToAdd,
      Number(prerank.spots),
      prerank.id,
    );
  } else if (newSpots < Number(prerank.spots)) {
    const spotsToDelete = Number(prerank.spots - newSpots);

    const emptyRankings = await knex('phase_rankings')
      .select('*')
      .where({ current_phase: prerank.id, roster_id: null });

    emptyRankings.sort(
      (a, b) => a.initial_position - b.initial_position,
    );

    for (let i = 0; i < spotsToDelete; ++i) {
      const [rank] = await knex('phase_rankings')
        .where({
          ranking_id:
            emptyRankings[emptyRankings.length - 1 - i].ranking_id,
        })
        .del()
        .returning('*');

      //update origin phase & position if used in another phase
      await knex('phase_rankings')
        .update({ origin_phase: null, origin_position: null })
        .where({
          origin_phase: rank.current_phase,
          origin_position: rank.initial_position,
        });
    }
  } else if (newSpots === Number(prerank.spots)) {
    return;
  }
  await knex('phase')
    .update({ spots: newSpots })
    .where({ id: prerank.id });
}

async function updatePreRanking(eventId, ranking) {
  const prerankPhase = await getPrerankPhase(eventId);
  const res = await Promise.all(
    ranking.map(async (r, index) => {
      const [rank] = await knex('phase_rankings')
        .update({ roster_id: r.rosterId })
        .where({
          initial_position: index + 1,
          current_phase: prerankPhase.id,
        })
        .returning('*');
      return rank;
    }),
  );
  return res;
}

async function updatePreRankingRosterId(prerank, rosterId, eventId) {
  const [{ maximum_spots: maximumSpots }] = await knex('events')
    .select('maximum_spots')
    .where({ id: eventId });

  let res = {};
  let lastPos = 0;

  if (maximumSpots) {
    const [lastPosition] = await knex('phase_rankings')
      .min('initial_position')
      .where({ current_phase: prerank.id, roster_id: null });

    lastPos = Number(lastPosition.min);

    res = await knex('phase_rankings')
      .update({ roster_id: rosterId })
      .where({
        current_phase: prerank.id,
        initial_position: lastPos,
      });
  } else {
    const [lastPosition] = await knex('phase_rankings')
      .max('initial_position')
      .where({ current_phase: prerank.id });

    if (!lastPosition.max) {
      lastPos = 1;
    } else {
      lastPos = Number(lastPosition.max) + 1;
    }

    res = await knex('phase_rankings')
      .insert({
        roster_id: rosterId,
        current_phase: prerank.id,
        initial_position: lastPos,
      })
      .returning('*');
  }

  const [dependantRanking] = await knex('phase_rankings')
    .update({ roster_id: rosterId })
    .where({
      origin_phase: prerank.id,
      origin_position: lastPos,
    })
    .returning('*');

  if (dependantRanking !== undefined) {
    await updateGameTeamName(rosterId, dependantRanking);
  }
  return res;
}

async function updateGameTeamName(roster_id, ranking) {
  const teamName = await getTeamName(roster_id);
  const phaseName = await getPhaseName(ranking.current_phase);

  const fullName = `${ranking.initial_position}. ${phaseName} (${teamName})`;
  await knex('game_teams')
    .update({ name: fullName })
    .where({ ranking_id: ranking.ranking_id });
}

async function updatePhase(body) {
  const { eventId, phaseId, spots, status } = body;
  if (!spots && !status) {
    return;
  }
  const res = await knex('phase')
    .update({ spots, status })
    .where({ event_id: eventId, id: phaseId })
    .returning('*');
  return res;
}

async function updatePhaseOrder(orderedPhases, eventId) {
  const res = await Promise.all(
    orderedPhases.map(async (p, index) => {
      const [order] = await knex('phase')
        .update({ phase_order: index + 1 })
        .where({ event_id: eventId, id: p.id })
        .returning('*');
      return order;
    }),
  );
  return res;
}

async function updatePhaseGamesRosterId(phaseId) {
  const games = await getPhaseGames(phaseId);

  const gamePositions = await Promise.all(
    games.map(async g => {
      const res = await updateGameTeamsRosterId(g);
      return res;
    }),
  );

  return gamePositions;
}

async function updateGameTeamsRosterId(game) {
  const positions = await knex('game_teams')
    .select('*')
    .where({ game_id: game.id });

  const [ranking1] = await knex('phase_rankings')
    .select('*')
    .where({ ranking_id: positions[0].ranking_id });

  const [ranking2] = await knex('phase_rankings')
    .select('*')
    .where({ ranking_id: positions[1].ranking_id });

  const teamName1 = await getTeamName(ranking1.roster_id);
  const teamName2 = await getTeamName(ranking2.roster_id);

  const [rosterId1] = await knex('game_teams')
    .update({ roster_id: ranking1.roster_id, name: teamName1 })
    .where({ ranking_id: ranking1.ranking_id })
    .returning('*');

  const [rosterId2] = await knex('game_teams')
    .update({ roster_id: ranking2.roster_id, name: teamName2 })
    .where({ ranking_id: ranking2.ranking_id })
    .returning('*');

  return [rosterId1, rosterId2];
}

async function updateInitialPositionPhase(phaseId, teams) {
  const res = await Promise.all(
    teams.map(async (t, index) => {
      const [ranking] = await knex('phase_rankings')
        .update({
          roster_id: t.roster_id,
          origin_phase: t.origin_phase,
          origin_position: t.origin_position,
        })
        .where({
          current_phase: phaseId,
          initial_position: index + 1,
        })
        .returning('*');

      return ranking;
    }),
  );
  await Promise.all(
    res.map(async r => {
      const phaseName = await getPhaseName(r.current_phase);
      let teamName = '';
      if (r.roster_id) {
        teamName = await getTeamName(r.roster_id);
      }
      const fullName = r.roster_id
        ? `${r.initial_position}. ${phaseName} (${teamName})`
        : `${r.initial_position}. ${phaseName}`;
      await knex('game_teams')
        .update({ name: fullName })
        .where({ ranking_id: r.ranking_id });
    }),
  );

  return res;
}

async function updateFinalPositionPhase(phaseId, teams) {
  const res = await Promise.all(
    teams.map(async t => {
      await knex('phase_rankings')
        .update({ roster_id: t.rosterId })
        .where({
          current_phase: phaseId,
          final_position: t.finalPosition,
        })
        .returning('*');
    }),
  );
  return res;
}

async function updateOriginPhase(body) {
  const {
    phaseId,
    eventId,
    originPhase,
    originPosition,
    initialPosition,
  } = body;
  const [roster] = await getRankingRoster(
    eventId,
    originPhase,
    originPosition,
  );
  const phaseName = await getPhaseName(phaseId);

  if (roster !== undefined) {
    const [res] = await knex('phase_rankings')
      .update({
        roster_id: roster.roster_id,
        origin_phase: originPhase,
        origin_position: originPosition,
      })
      .where({
        current_phase: phaseId,
        initial_position: initialPosition,
      })
      .returning('*');

    const teamName = await getTeamName(roster.roster_id);
    await knex('game_teams')
      .where({ ranking_id: res.ranking_id })
      .update({
        name: `${initialPosition}. ${phaseName} (${teamName})`,
      });
    return res;
  } else {
    const [res] = await knex('phase_rankings')
      .update({
        origin_phase: originPhase,
        origin_position: originPosition,
      })
      .where({
        current_phase: phaseId,
        initial_position: initialPosition,
      })
      .returning('*');
    return res;
  }
}

async function updatePhaseRankingsSpots(body) {
  const { phaseId, spots } = body;

  const actualSpots = await getNbOfSpotsInPhase(phaseId);

  if (actualSpots === spots) {
    return;
  }

  if (actualSpots < spots) {
    let added = [];
    for (let i = actualSpots; i < spots; ++i) {
      const ranking = await knex('phase_rankings')
        .insert({
          current_phase: phaseId,
          initial_position: i + 1,
        })
        .returning('*');
      added.push(ranking);
    }
    return added;
  }

  if (actualSpots > spots) {
    let deleted = [];
    for (let i = actualSpots; i > spots; --i) {
      const [ranking] = await knex('phase_rankings')
        .where({
          current_phase: phaseId,
          initial_position: i,
        })
        .del()
        .returning('*');

      await knex('phase_rankings')
        .update({
          roster_id: null,
          origin_phase: null,
          origin_position: null,
        })
        .where({
          origin_phase: ranking.current_phase,
          origin_position: ranking.initial_position,
        });

      deleted.push(ranking);
    }
    return deleted;
  }
}

async function updatePhaseFinalRanking(phaseId, finalRanking) {
  let dependantRankings = [];

  const res = await Promise.all(
    finalRanking.map(async (r, index) => {
      const finalPosition = await knex('phase_rankings')
        .update({ final_position: index + 1 })
        .where({ current_phase: phaseId, roster_id: r.rosterId })
        .returning('*');
      const [dependantRanking] = await knex('phase_rankings')
        .update({ roster_id: r.rosterId })
        .where({ origin_phase: phaseId, origin_position: index + 1 })
        .returning('*');
      if (dependantRanking) {
        dependantRankings.push(dependantRanking);
      }
      return finalPosition;
    }),
  );

  if (dependantRankings.length) {
    await Promise.all(
      dependantRankings.map(async r => {
        await updateGameTeamName(r.roster_id, r);
      }),
    );
  }

  return res;
}

async function updateManualRanking(phaseId, manualRanking) {
  const res = await Promise.all(
    manualRanking.map(async (r, index) => {
      const [finalPosition] = await knex('phase_rankings')
        .update({ final_position: index + 1 })
        .where({ current_phase: phaseId, roster_id: r.rosterId })
        .returning('*');
      return finalPosition;
    }),
  );
  return res;
}

async function getNbOfSpotsInPhase(phaseId) {
  const [res] = await knex('phase_rankings')
    .count('initial_position')
    .where({ current_phase: phaseId });
  return Number(res.count);
}
async function getNbOfTeamsInPhase(phaseId) {
  const [res] = await knex('phase_rankings')
    .count('initial_position')
    .whereNotNull('roster_id')
    .andWhere({ current_phase: phaseId });
  return Number(res.count);
}

async function deleteTeamPhase(phaseId, initialPosition) {
  const [deleted] = await knex('phase_rankings')
    .update({
      roster_id: null,
      origin_phase: null,
      origin_position: null,
    })
    .where({
      current_phase: phaseId,
      initial_position: initialPosition,
    })
    .returning('*');

  const phaseName = await getPhaseName(deleted.current_phase);

  await knex('game_teams')
    .where({
      ranking_id: deleted.ranking_id,
    })
    .update({ name: `${deleted.initial_position}. ${phaseName}` });

  return deleted;
}

async function updateGeneralInfos(entityId, body) {
  const { description, quickDescription } = body;

  const updateQuery = {};

  if (description) {
    updateQuery.description = description;
  }

  if (quickDescription) {
    updateQuery.quick_description = quickDescription;
  }

  const [entity] = await knex('entities_general_infos')
    .update(updateQuery)
    .where({ entity_id: entityId })
    .returning('*');
  return entity;
}

async function updatePersonInfosHelper(entityId, body) {
  const { personInfos } = body;
  const {
    name,
    surname,
    birthDate,
    phoneNumber,
    gender,
    emergencyName,
    emergencySurname,
    emergencyPhoneNumber,
    medicalConditions,
  } = personInfos;

  let outputPersonInfos = {};
  let addressId = null;

  if (personInfos.address.length != 0) {
    let {
      street_address,
      city,
      state,
      zip,
      country,
    } = personInfos.address;

    const [res] = await knex('addresses')
      .insert({
        street_address,
        city,
        state,
        zip,
        country,
      })
      .returning('*');

    addressId = res.id;

    outputPersonInfos.address = `${res.street_address} ${res.city} ${res.state} ${res.zip} ${res.country}`;
  }

  const [res] = await knex('person_infos')
    .insert({
      gender: gender,
      birth_date: birthDate,
      phone_number: phoneNumber,
      emergency_name: emergencyName,
      emergency_surname: emergencySurname,
      emergency_phone_number: emergencyPhoneNumber,
      medical_conditions: medicalConditions,
      address_id: addressId,
    })
    .returning('*');

  outputPersonInfos.gender = res.gender;
  outputPersonInfos.emergencyName = res.emergency_name;
  outputPersonInfos.emergencySurname = res.emergency_surname;
  outputPersonInfos.emergencyPhoneNumber = res.emergency_phone_number;
  outputPersonInfos.medicalConditions = res.medical_conditions;
  outputPersonInfos.birthDate = res.birth_date;
  outputPersonInfos.phoneNumber = res.phone_number;

  const [res2] = await knex('entities_general_infos')
    .update({
      name: name,
      surname: surname,
      infos_supp_id: res.id,
    })
    .where({ entity_id: entityId })
    .returning('*');

  outputPersonInfos.name = res2.name;
  outputPersonInfos.surname = res2.surname;

  return outputPersonInfos;
}

async function updateEntityName(entityId, name, surname) {
  const type = await getEntitiesTypeById(entityId);

  if (type === GLOBAL_ENUM.TEAM) {
    const rosterIds = await knex('team_rosters')
      .select('id')
      .where({ team_id: entityId });

    const rankings = await rosterIds.reduce(async (memo, curr) => {
      const memoIteration = await memo;
      const ranking = await knex('phase_rankings')
        .select('*')
        .where({ roster_id: curr.id })
        .whereNot({ origin_phase: null, origin_position: null });
      return memoIteration.concat(ranking);
    }, []);

    //if phase is not started ranking_id is used to change the name in game_teams
    if (rankings.length) {
      await Promise.all(
        rankings.map(async r => {
          const phaseName = await getPhaseName(r.current_phase);
          const fullName = `${r.initial_position}. ${phaseName} (${name})`;
          return await knex('game_teams')
            .update({ name: fullName })
            .where({ ranking_id: r.ranking_id });
        }),
      );
    }

    //if phase is either started or done, the roster_id is used to update
    if (rosterIds.length) {
      await Promise.all(
        rosterIds.map(
          async r =>
            await knex('game_teams')
              .update({ name: name })
              .where({ roster_id: r.id }),
        ),
      );
    }
  }
  return knex('entities_general_infos')
    .update({ name, surname })
    .where({ entity_id: entityId });
}

async function updateEntityPhoto(entityId, photo_url) {
  return knex('entities_general_infos')
    .update({ photo_url })
    .where({ entity_id: entityId });
}

async function updateOption(body) {
  const { id, startTime, endTime } = body;

  return knex('event_payment_options')
    .update({
      start_time: new Date(startTime),
      end_time: new Date(endTime),
    })
    .where({ id });
}

async function updateMembershipTermsAndConditions(body) {
  const { id, description, fileName, fileUrl } = body;

  return knex('entity_memberships')
    .update({
      description: description,
      file_name: fileName,
      file_url: fileUrl,
    })
    .where({ id });
}

async function updatePartner(body) {
  const { id, description, name, website, photoUrl } = body;

  return knex('partners')
    .update({
      name,
      description,
      website,
      photo_url: photoUrl,
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

const canRemovePlayerFromRoster = async (rosterId, personId) => {
  const presentRoles = await knex('team_players')
    .select('person_id', 'role')
    .where(
      'roster_id',
      knex('team_players')
        .select('roster_id')
        .where({ roster_id: rosterId, person_id: personId }),
    );

  return (
    presentRoles.filter(
      item =>
        item.person_id !== personId &&
        item.role !== ROSTER_ROLE_ENUM.PLAYER,
    ).length >= 1
  );
};

const getSubmissionerInfos = async gameInfos => {
  const [{ role: myRole }] = await knex('team_players')
    .select('role')
    .where({
      roster_id: gameInfos.myRosterId,
      person_id: gameInfos.myEntityId,
    });

  return {
    gameInfos,
    canSubmitScore:
      myRole &&
      (myRole === ROSTER_ROLE_ENUM.COACH ||
        myRole === ROSTER_ROLE_ENUM.CAPTAIN ||
        myRole === ROSTER_ROLE_ENUM.ASSISTANT_CAPTAIN),
  };
};

const canUnregisterTeam = async (rosterId, eventId) => {
  const games = await knex('game_teams')
    .whereIn(
      'game_id',
      knex('games')
        .select('id')
        .where({ event_id: eventId }),
    )
    .andWhere({ roster_id: rosterId });

  const startedPhasesWithRosterId = await knex('phase_rankings')
    .select('current_phase')
    .leftJoin(
      'phase',
      'phase.id',
      '=',
      'phase_rankings.current_phase',
    )
    .where({ roster_id: rosterId })
    .whereNot({ status: 'not_started' });

  if (startedPhasesWithRosterId.length) {
    return false;
  }

  if (games) {
    return games.length == 0;
  }
  return true;
};

const deleteRegistration = async (rosterId, eventId) => {
  const prerankPhase = await getPrerankPhase(eventId);
  let ranking;
  let dependantRanking;

  const res = await knex.transaction(async trx => {
    await knex('event_rosters')
      .where({
        roster_id: rosterId,
        event_id: eventId,
      })
      .del()
      .transacting(trx);

    //delete from prerank
    [ranking] = await knex('phase_rankings')
      .update({ roster_id: null })
      .where({
        roster_id: rosterId,
        current_phase: prerankPhase.id,
      })
      .returning('*')
      .transacting(trx);

    //update from phase_rankings if used elsewhere
    [dependantRanking] = await knex('phase_rankings')
      .where({ roster_id: rosterId })
      .whereNot({ current_phase: prerankPhase.id })
      .update({
        roster_id: null,
      })
      .returning('*')
      .transacting(trx);

    if (dependantRanking !== undefined) {
      // update name in game_teams if it was in a game
      const phaseName = await getPhaseName(
        dependantRanking.current_phase,
      );

      await knex('game_teams')
        .where({
          ranking_id: dependantRanking.ranking_id,
        })
        .update({
          roster_id: null,
          name: `${ranking.initial_position}. ${phaseName}`,
        })
        .transacting(trx);
    }

    await knex('token_roster_invite')
      .where({ roster_id: rosterId })
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

    return trx;
  });
  return res;
};

const removeEventCartItem = async ({ rosterId }) => {
  const res = await knex
    .select('id')
    .from(
      knex
        .select(knex.raw("id, metadata ->> 'rosterId' AS rosterId"))
        .from('cart_items')
        .as('cartItems'),
    )
    .where('cartItems.rosterid', rosterId);

  const ids = res.map(r => r.id);

  await knex('cart_items')
    .whereIn('id', ids)
    .del();

  return ids;
};

const removeIndividualEventCartItem = async ({
  personId,
  eventId,
  stripePrice,
}) => {
  const res = await knex
    .select('*')
    .from(
      knex
        .select(
          knex.raw(
            "id, stripe_price_id, metadata ->> 'person' AS person, metadata ->> 'eventId' AS eventId",
          ),
        )
        .from('cart_items')
        .as('cartItems'),
    )
    .where('cartItems.eventid', eventId)
    .andWhere('cartItems.stripe_price_id', stripePrice);

  const ids = res
    .filter(r => {
      const person = JSON.parse(r.person);
      return person.id === personId;
    })
    .map(r => r.id);

  await knex('cart_items')
    .whereIn('id', ids)
    .del();
  return ids;
};

const removeIndividualPaymentCartItem = async ({
  buyerId,
  rosterId,
}) => {
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
      'cartItems.buyerid': buyerId,
      'cartItems.rosterid': rosterId,
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

async function updateRegistrationPerson(
  personId,
  eventId,
  invoiceItemId,
  status,
) {
  return knex('event_persons')
    .update({
      invoice_item_id: invoiceItemId,
      status,
    })
    .where({
      event_id: eventId,
      person_id: personId,
    });
}

async function updateRosterRole(playerId, role) {
  if (role === ROSTER_ROLE_ENUM.PLAYER) {
    const presentRoles = await knex('team_players')
      .select('id', 'role')
      .where(
        'roster_id',
        knex('team_players')
          .select('roster_id')
          .where({ id: playerId }),
      );

    if (
      !presentRoles.some(
        p => p.role !== ROSTER_ROLE_ENUM.PLAYER && p.id !== playerId,
      )
    ) {
      return ERROR_ENUM.VALUE_IS_INVALID;
    }
  }

  return knex('team_players')
    .update({ role })
    .where({ id: playerId });
}

async function updatePlayerPaymentStatus(body) {
  const {
    metadata: { buyerId: buyerPersonId },
    rosterId,
    status,
    invoiceItemId,
  } = body;
  return knex('team_players')
    .update({
      payment_status: status,
      invoice_item_id: invoiceItemId,
    })
    .where({
      person_id: buyerPersonId,
      roster_id: rosterId,
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
      paid_on: new Date(),
    })
    .where({
      person_id: person.id,
      organization_id: organization.id,
      member_type: membership_type,
    });
  return res;
}

async function addAllFields(eventId, fieldsArray) {
  const fields = fieldsArray.map(f => ({
    event_id: eventId,
    field: f.field,
    id: f.id,
  }));

  const res = await knex.transaction(async trx => {
    const queries = await knex('event_fields')
      .insert(fields)
      .returning('*')
      .transacting(trx);

    return Promise.all(queries)
      .then(trx.commit)
      .catch(trx.rollback);
  });

  return res;
}

async function addAllTimeslots(eventId, timeslotsArray) {
  const timeslots = timeslotsArray.map(t => ({
    event_id: eventId,
    date: new Date(t.date),
    id: t.id,
  }));

  const res = await knex.transaction(async trx => {
    const queries = await knex('event_time_slots')
      .insert(timeslots)
      .returning('*')
      .transacting(trx);

    return Promise.all(queries)

      .then(trx.commit)
      .catch(trx.rollback);
  });
  return res;
}

async function addAllGames(eventId, gamesArray) {
  let games;
  const rankingsArray = await gamesArray.reduce(async (memo, g) => {
    const memoIteration = await memo;
    const [phase] = await getPhase(g.phase_id);
    //if phase is started, there will be a roster id otherwise it's null
    const res = [
      ...memoIteration,
      {
        game_id: g.id,
        ranking_id: g.rankings[0].ranking_id,
        roster_id:
          phase.status !== PHASE_STATUS_ENUM.NOT_STARTED
            ? g.rankings[0].roster_id
            : null,
        name: g.rankings[0].name,
      },
      {
        game_id: g.id,
        ranking_id: g.rankings[1].ranking_id,
        roster_id:
          phase.status !== PHASE_STATUS_ENUM.NOT_STARTED
            ? g.rankings[1].roster_id
            : null,
        name: g.rankings[1].name,
      },
    ];
    return res;
  }, []);

  const res = await knex.transaction(async trx => {
    games = await Promise.all(
      gamesArray.map(async g => {
        const [{ id: entityId }] = await knex('entities')
          .insert({ type: GLOBAL_ENUM.GAME })
          .returning(['id'])
          .transacting(trx);
        return {
          event_id: eventId,
          phase_id: g.phase_id,
          field_id: g.field_id,
          timeslot_id: g.timeslot_id,
          id: g.id,
          entity_id: entityId,
        };
      }),
    );

    await knex('games')
      .insert(games)
      .returning('*')
      .transacting(trx);

    await knex('game_teams')
      .insert(rankingsArray)
      .returning('*')
      .transacting(trx);

    return trx;
  });

  return res;
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

async function getMembershipId(membershipType, organizationId) {
  const [res] = await knex('entity_memberships')
    .select('id')
    .where({
      membership_type: membershipType,
      entity_id: organizationId,
    });
  return res.id;
}

async function addMemberManually(body) {
  const {
    membershipId,
    membershipType,
    organizationId,
    personId,
    birthDate,
    gender,
    address,
    expirationDate,
    phoneNumber,
    emergencyName,
    emergencySurname,
    emergencyPhoneNumber,
    medicalConditions,
  } = body;
  let id = membershipId;

  if (!id) {
    id = await getMembershipId(membershipType, organizationId);
  }

  const [add] = await knex('addresses')
    .insert({
      street_address: address.street_address,
      city: address.city,
      state: address.state,
      zip: address.zip,
      country: address.country,
    })
    .returning('id');

  const [infos] = await knex('person_infos')
    .insert({
      birth_date: birthDate,
      gender,
      phone_number: phoneNumber,
      emergency_name: emergencyName,
      emergency_surname: emergencySurname,
      emergency_phone_number: emergencyPhoneNumber,
      medical_conditions: medicalConditions,
      address_id: add,
    })
    .returning('id');

  const [res] = await knex('memberships')
    .insert({
      membership_id: id,
      member_type: membershipType,
      organization_id: organizationId,
      person_id: personId,
      expiration_date: expirationDate,
      status: INVOICE_STATUS_ENUM.FREE,
      infos_supp_id: infos,
    })
    .returning('*');

  return res;
}

async function addMember(body) {
  const {
    membershipId,
    membershipType,
    organizationId,
    personId,
    birthDate,
    gender,
    address,
    expirationDate,
    phoneNumber,
    emergencyPhoneNumber,
    emergencyName,
    emergencySurname,
    medicalConditions,
  } = body;

  const [add] = await knex('addresses')
    .insert({
      street_address: address.street_address,
      city: address.city,
      state: address.state,
      zip: address.zip,
      country: address.country,
    })
    .returning('id');

  const [infos] = await knex('person_infos')
    .insert({
      birth_date: birthDate,
      gender,
      phone_number: phoneNumber,
      emergency_name: emergencyName,
      emergency_surname: emergencySurname,
      emergency_phone_number: emergencyPhoneNumber,
      medical_conditions: medicalConditions,
      address_id: add,
    })
    .returning('id');

  const [res] = await knex('memberships')
    .insert({
      membership_id: membershipId,
      member_type: membershipType,
      organization_id: organizationId,
      person_id: personId,
      expiration_date: expirationDate,
      status: INVOICE_STATUS_ENUM.OPEN,
      infos_supp_id: infos,
    })
    .returning('*');

  return res;
}

async function addReport(type, organizationId, date) {
  const organization = (await getEntity(organizationId)).basicInfos;
  const [res] = await knex('reports')
    .insert({
      type: type,
      entity_id: organizationId,
      metadata: {
        date,
        organizationName: organization.name,
      },
    })
    .returning('*');
  return res;
}

async function addAlias(entityId, alias) {
  if (!/^[\w.-]+$/.test(alias) || validator.isUUID(alias)) {
    throw Error(ERROR_ENUM.VALUE_IS_INVALID);
  }
  const [res] = await knex('alias')
    .insert({
      id: entityId,
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
      'entities_general_infos',
      'entities_general_infos.entity_id',
      '=',
      'team_rosters.team_id',
    )
    .where({ id: team });
  if (res) {
    return res.name;
  }
}

async function getUserIdFromPersonId(personId) {
  const [user] = await knex('user_entity_role')
    .select('user_id')
    .where({ entity_id: personId, role: ENTITIES_ROLE_ENUM.ADMIN });
  return user.user_id;
}

async function getPhaseRankingWithPhase(rankingId) {
  const [res] = await knex('phase_rankings')
    .select('*')
    .where({ ranking_id: rankingId });

  const [phase] = await getPhase(res.current_phase);

  return { ...res, phase };
}

async function getPhase(phaseId) {
  const phase = await knex('phase')
    .select('*')
    .where({ id: phaseId });

  return phase;
}

async function addGame(
  eventId,
  phaseId,
  fieldId,
  timeslotId,
  rankingId1,
  rankingId2,
) {
  const [{ id: entityId }] = await knex('entities')
    .insert({ type: GLOBAL_ENUM.GAME })
    .returning(['id']);

  const [res] = await knex('games')
    .insert({
      timeslot_id: timeslotId,
      event_id: eventId,
      field_id: fieldId,
      phase_id: phaseId,
      entity_id: entityId,
    })
    .returning('*');

  const phaseRanking1 = await getPhaseRankingWithPhase(rankingId1);
  const phaseRanking2 = await getPhaseRankingWithPhase(rankingId2);
  let name1;
  let name2;
  let position1;
  let position2;

  if (phaseRanking1.phase.status !== PHASE_STATUS_ENUM.NOT_STARTED) {
    name1 = await getTeamName(phaseRanking1.roster_id);
    name2 = await getTeamName(phaseRanking2.roster_id);

    [position1] = await knex('game_teams')
      .insert({
        game_id: res.id,
        ranking_id: rankingId1,
        name: name1,
        roster_id: phaseRanking1.roster_id,
      })
      .returning('*');

    [position2] = await knex('game_teams')
      .insert({
        game_id: res.id,
        ranking_id: rankingId2,
        name: name2,
        roster_id: phaseRanking2.roster_id,
      })
      .returning('*');
  } else {
    const teamName1 = await getTeamName(phaseRanking1.roster_id);
    const teamName2 = await getTeamName(phaseRanking2.roster_id);

    name1 =
      teamName1 !== undefined
        ? `${phaseRanking1.initial_position.toString()}. ${
            phaseRanking1.phase.name
          } (${teamName1})`
        : `${phaseRanking1.initial_position.toString()}. ${
            phaseRanking1.phase.name
          }`;

    name2 =
      teamName2 !== undefined
        ? `${phaseRanking2.initial_position.toString()}. ${
            phaseRanking2.phase.name
          } (${teamName2})`
        : `${phaseRanking2.initial_position.toString()}. ${
            phaseRanking2.phase.name
          }`;

    [position1] = await knex('game_teams')
      .insert({
        game_id: res.id,
        ranking_id: rankingId1,
        name: name1,
      })
      .returning('*');

    [position2] = await knex('game_teams')
      .insert({
        game_id: res.id,
        ranking_id: rankingId2,
        name: name2,
      })
      .returning('*');
  }
  return {
    game: {
      ...res,
      positions: [position1, position2],
    },
  };
}

async function addGameAttendances(body) {
  const { gameId, rosterId, editedBy, attendances } = body;

  // upsert the attendances
  const res = await Promise.all(
    attendances.map(player => {
      return knex('game_players_attendance')
        .insert({
          game_id: gameId,
          roster_id: rosterId,
          edited_by: editedBy,
          player_id: player.value,
          status: player.status,
          is_sub: player.isSub,
        })
        .onConflict(['game_id', 'roster_id', 'player_id'])
        .merge()
        .returning('*');
    }),
  );

  await knex('game_players_attendance')
    .where({ game_id: gameId, roster_id: rosterId })
    .whereNotIn(
      'player_id',
      attendances.map(a => a.value),
    )
    .del();

  return res;
}

async function addSpiritSubmission(infos) {
  const submitted = await isSpiritAlreadySubmitted(infos);
  if (typeof submitted === 'undefined') {
    return;
  }
  if (submitted) {
    throw new Error(ERROR_ENUM.VALUE_ALREADY_EXISTS);
  }
  return knex('spirit_submission').insert(infos);
}

async function isSpiritAlreadySubmitted(infos) {
  const {
    game_id,
    submitted_by_roster,
    submitted_for_roster,
  } = infos;
  const res = await knex('spirit_submission')
    .select()
    .where({ game_id, submitted_by_roster, submitted_for_roster });
  if (!res) {
    return;
  }
  return res.length !== 0;
}

async function acceptScoreSuggestion(infos) {
  const { id, submitted_by_roster, submitted_by_person } = infos;
  const res = await knex('score_suggestion')
    .select('score', 'game_id')
    .where({ id });
  if (!res || res.length === 0) {
    return;
  }
  const { game_id, score } = res[0];
  return addScoreSuggestion({
    submitted_by_roster,
    submitted_by_person,
    game_id,
    score,
  });
}

async function addScoreSuggestion(infos) {
  const submitted = await isScoreSuggestionAlreadySubmitted(infos);
  if (typeof submitted === 'undefined') {
    return;
  }
  if (submitted) {
    throw new Error(ERROR_ENUM.VALUE_ALREADY_EXISTS);
  }
  const newSuggestion = await knex('score_suggestion')
    .insert(infos)
    .returning('*');

  const suggestion = await acceptScoreSuggestionIfPossible(
    infos.game_id,
  );

  return {
    ...newSuggestion,
    status: suggestion.status,
    conflict: suggestion.conflict,
  };
}

async function addMemberDonation(
  amount,
  anonyme,
  note,
  organizationId,
  personId,
  userId,
) {
  const [newDonation] = await knex('donation')
    .insert({
      amount,
      anonyme,
      note,
      organization_id: organizationId,
      user_id: userId,
    })
    .returning('*');

  const entity = (await getEntity(organizationId, userId)).basicInfos;

  const stripeProduct = {
    name: GLOBAL_ENUM.DONATION,
    active: true,
    description: entity.name,
    metadata: { type: GLOBAL_ENUM.DONATION, id: organizationId },
  };
  const product = await addProduct({ stripeProduct });

  const stripePrice = {
    currency: 'cad',
    unit_amount: amount,
    active: true,
    product: product.id,
    metadata: { type: GLOBAL_ENUM.DONATION, id: organizationId },
  };
  const priceStripe = await addPrice({
    stripePrice,
    entityId: organizationId,
    photoUrl: entity.photoUrl,
    ownerId: organizationId,
    taxRatesId: null,
  });

  let person = { name: 'Anonyme' };

  if (!anonyme) {
    const [res] = await knex('person_all_infos')
      .select('*')
      .where({ id: personId });

    person = { name: res.name, surname: res.surname };
  }

  const metadata = {
    donationId: newDonation.id,
    sellerEntityId: organizationId,
    isIndividualOption: true,
    personId,
    name: GLOBAL_ENUM.DONATION,
    buyerId: userId,
    organization: entity,
    person,
    note,
  };

  await knex('cart_items').insert({
    stripe_price_id: priceStripe.id,
    user_id: userId,
    metadata: { ...metadata, type: GLOBAL_ENUM.DONATION },
  });

  return newDonation;
}

async function isScoreSuggestionAlreadySubmitted(infos) {
  const { game_id, submitted_by_roster } = infos;
  const res = await knex('score_suggestion')
    .select()
    .where({ game_id, submitted_by_roster });
  if (!res) {
    return;
  }
  return res.length !== 0;
}

async function acceptScoreSuggestionIfPossible(gameId) {
  const allSuggestions = await knex('score_suggestion')
    .select('*')
    .where({ game_id: gameId });

  const [{ nbOfTeams: numberOfTeams }] = await knex('game_teams')
    .count('roster_id as nbOfTeams')
    .where({ game_id: gameId });

  if (allSuggestions.length === Number(numberOfTeams)) {
    // all score suggestions are made
    const model = allSuggestions[0].score;
    if (allSuggestions.every(s => _.isEqual(s.score, model))) {
      // all score suggestions are the same, accept them
      await knex('score_suggestion')
        .where({ game_id: gameId })
        .update({ status: STATUS_ENUM.ACCEPTED });

      await setGameScore(gameId, model);
      return { status: STATUS_ENUM.ACCEPTED, conflict: false };
    }
    return { status: STATUS_ENUM.PENDING, conflict: true };
  }
  return { status: STATUS_ENUM.PENDING, conflict: false };
}

async function setGameScore(gameId, score, isManualAdd = false) {
  for (let position in score) {
    await knex('game_teams')
      .where({ game_id: gameId, roster_id: position })
      .update({ score: score[position] });
  }

  if (isManualAdd) {
    // update score suggestion status if score was added manually
    const allSuggestions = await knex('score_suggestion')
      .select('*')
      .where({ game_id: gameId });

    for (let suggestion of allSuggestions) {
      await knex('score_suggestion')
        .update({
          status: _.isEqual(suggestion.score, score)
            ? STATUS_ENUM.ACCEPTED
            : STATUS_ENUM.REFUSED,
        })
        .where({ id: suggestion.id });
    }
  }
  return { gameId, score };
}

async function getGamesWithAwaitingScore(user_id, limit = 100) {
  const subquery = knex('score_suggestion')
    .select()
    .whereRaw(
      'SCORE_SUGGESTION.GAME_ID = GAME_PLAYERS_VIEW.GAME_ID AND SCORE_SUGGESTION.SUBMITTED_BY_ROSTER = GAME_PLAYERS_VIEW.ROSTER_ID',
    );
  return knex
    .select(
      'player_id',
      'game_players_view.game_id',
      'game_players_view.roster_id',
      'game_players_view.timeslot',
      'game_players_view.event_id',
      knex.raw('array_agg(name) as opponent_teams_names'),
    )
    .from('user_entity_role')
    .join(
      'game_players_view',
      'user_entity_role.entity_id',
      'game_players_view.player_id',
    )
    .join('game_teams', function() {
      this.on(
        'game_teams.roster_id',
        '!=',
        'game_players_view.roster_id',
      ).andOn('game_teams.game_id', '=', 'game_players_view.game_id');
    })
    .where({ user_id, role: ENTITIES_ROLE_ENUM.ADMIN })
    .whereNot('player_role', ROSTER_ROLE_ENUM.PLAYER)
    .whereNotExists(subquery)
    .where('game_players_view.timeslot', '<', 'now()')
    .orderBy('game_players_view.timeslot', 'desc')
    .groupBy(
      'player_id',
      'game_players_view.game_id',
      'game_players_view.roster_id',
      'game_players_view.timeslot',
      'game_players_view.event_id',
    )
    .limit(limit);
}

async function getUserNextGame(user_id) {
  const [res] = await knex
    .queryBuilder()
    .select(
      'player_id',
      'game_players_view.game_id',
      'game_players_view.roster_id',
      'game_players_view.timeslot',
      'game_players_view.event_name',
      'game_players_view.field',
      knex.raw('ARRAY_AGG(GAME_TEAMS.NAME) AS OPPONENT_TEAMS_NAMES'),
    )
    .from('user_entity_role')
    .join(
      'game_players_view',
      'user_entity_role.entity_id',
      'game_players_view.player_id',
    )
    .join('game_teams', function() {
      this.on(
        'game_teams.roster_id',
        '!=',
        'game_players_view.roster_id',
      ).andOn('game_teams.game_id', '=', 'game_players_view.game_id');
    })
    .where({ user_id, role: ENTITIES_ROLE_ENUM.ADMIN })
    .whereRaw('GAME_PLAYERS_VIEW.timeslot>now()')
    .groupBy(
      'player_id',
      'game_players_view.game_id',
      'game_players_view.roster_id',
      'game_players_view.timeslot',
      'game_players_view.event_name',
      'game_players_view.field',
    )
    .orderBy('game_players_view.timeslot')
    .limit(1);

  return res;
}

async function addField(field, eventId) {
  const [res] = await knex('event_fields')
    .insert({
      field,
      event_id: eventId,
    })
    .returning('*');
  return res;
}

async function addPhase(phase, spots, eventId) {
  const phases = await getAllPhases(eventId);
  const [res] = await knex('phase')
    .insert({
      name: phase,
      event_id: eventId,
      spots,
      phase_order: phases.length ? phases.length : 1,
    })
    .returning('*');

  if (spots && spots !== 0) {
    await addPhaseRanking(res.id, spots);
  }
  return res;
}

async function addPhaseRanking(phaseId, spots) {
  const res = [];
  for (let i = 0; i < spots; ++i) {
    const ranking = await knex('phase_rankings')
      .insert({
        current_phase: phaseId,
        initial_position: i + 1,
      })
      .returning('*');
    res.push(ranking);
  }
  return res;
}

async function addTimeSlot(date, eventId) {
  const [res] = await knex('event_time_slots')
    .insert({ date: new Date(date), event_id: eventId })
    .returning('*');
  return res;
}

async function addOption(
  endTime,
  eventId,
  eventType,
  name,
  ownerId,
  playerPrice,
  playerTaxes,
  startTime,
  teamPrice,
  teamTaxes,
  informations,
  manualAcceptation,
  userId,
) {
  const entity = (await getEntity(eventId, userId)).basicInfos;

  let teamPriceStripe;
  let individualPriceStripe;

  if (teamPrice > 0) {
    const stripeProductTeam = {
      name: `${name} - Paiement d'équipe`, // ${t('payment.payment_team')}
      active: true,
      description: entity.name,

      // TODO: Add entity seller id
      metadata: { type: GLOBAL_ENUM.EVENT, id: eventId },
    };
    const productTeam = await addProduct({
      stripeProduct: stripeProductTeam,
    });
    const stripePriceTeam = {
      currency: 'cad',
      unit_amount: teamPrice,
      active: true,
      product: productTeam.id,
      metadata: { type: GLOBAL_ENUM.EVENT, id: eventId },
    };
    teamPriceStripe = await addPrice({
      stripePrice: stripePriceTeam,
      entityId: eventId,
      photoUrl: entity.photoUrl,
      ownerId,
      taxRatesId: teamTaxes,
    });
  }

  if (playerPrice > 0) {
    const stripeProductIndividual = {
      name: `${name} - Paiement individuel`, // ${t('payment.payment_individual')}
      active: true,
      description: entity.name,

      // TODO: Add entity seller id
      metadata: { type: GLOBAL_ENUM.EVENT, id: eventId },
    };
    const productIndividual = await addProduct({
      stripeProduct: stripeProductIndividual,
    });
    const stripePriceIndividual = {
      currency: 'cad',
      unit_amount: playerPrice,
      active: true,
      product: productIndividual.id,
      metadata: { type: GLOBAL_ENUM.EVENT, id: eventId },
    };
    individualPriceStripe = await addPrice({
      stripePrice: stripePriceIndividual,
      entityId: eventId,
      photoUrl: entity.photoUrl,
      ownerId,
      taxRatesId: playerTaxes,
    });
  }

  const [res] = await knex('event_payment_options')
    .insert({
      event_id: eventId,
      name,
      team_stripe_price_id: teamPriceStripe
        ? teamPriceStripe.id
        : null,
      team_price: teamPrice === null ? 0 : teamPrice,
      individual_stripe_price_id: individualPriceStripe
        ? individualPriceStripe.id
        : null,
      individual_price: playerPrice === null ? 0 : playerPrice,
      end_time: new Date(endTime),
      start_time: new Date(startTime),
      team_activity: eventType === EVENT_TYPE.TEAM,
      team_acceptation:
        manualAcceptation && eventType === EVENT_TYPE.TEAM,
      player_acceptation:
        manualAcceptation && eventType === EVENT_TYPE.PLAYER,
      informations,
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
  description,
  fileName,
  fileUrl,
  taxRatesId,
  userId,
) {
  const entity = (await getEntity(entityId, userId)).basicInfos;
  const stripeProduct = {
    name: getMembershipName(membership),
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
    ownerId: entityId,
    taxRatesId,
  });
  if (type === MEMBERSHIP_LENGTH_TYPE_ENUM.FIXED) {
    const [res] = await knex('entity_memberships')
      .insert({
        stripe_price_id: priceStripe.id,
        entity_id: entityId,
        membership_type: membership,
        fixed_date: date,
        price,
        description,
        file_name: fileName,
        file_url: fileUrl,
      })
      .returning('*');
    return res;
  }
  if (type === MEMBERSHIP_LENGTH_TYPE_ENUM.LENGTH) {
    const [res] = await knex('entity_memberships')
      .insert({
        stripe_price_id: priceStripe.id,
        entity_id: entityId,
        membership_type: membership,
        length,
        price,
        description,
        file_name: fileName,
        file_url: fileUrl,
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
    informations,
  } = body;
  const prerankPhase = await getPrerankPhase(eventId);
  let rosterId;

  const res = await knex.transaction(async trx => {
    const [roster] = await knex('team_rosters')
      .insert({ team_id: teamId })
      .returning('*')
      .transacting(trx);

    rosterId = roster.id;

    const [eventRoster] = await knex('event_rosters')
      .insert({
        roster_id: roster.id,
        team_id: teamId,
        event_id: eventId,
        status,
        registration_status: registrationStatus,
        payment_option_id: paymentOption,
        informations,
      })
      .returning('*')
      .transacting(trx);

    return eventRoster.roster_id;
  });

  if (
    registrationStatus === STATUS_ENUM.ACCEPTED ||
    registrationStatus === STATUS_ENUM.ACCEPTED_FREE
  ) {
    await updatePreRankingRosterId(prerankPhase, rosterId, eventId);
  }

  return res;
}

async function deleteTeamFromEvent(body) {
  const { eventId, rosterId } = body;

  return knex.transaction(async trx => {
    await knex('team_players')
      .del()
      .where({
        roster_id: rosterId,
      })
      .transacting(trx);
    await knex('phase_rankings')
      .update({ roster_id: null })
      .where({
        roster_id: rosterId,
      })
      .transacting(trx);
    await knex('event_rosters')
      .del()
      .where({
        roster_id: rosterId,
        event_id: eventId,
      })
      .transacting(trx);
    await knex('token_roster_invite')
      .del()
      .where({
        roster_id: rosterId,
      })
      .transacting(trx);
    await knex('team_rosters')
      .del()
      .where({ id: rosterId })
      .returning('id')
      .transacting(trx);
  });
}

async function getRegisteredPersons(persons, eventId) {
  const ids = persons.map(p => p.id);
  const registered = await knex('event_persons')
    .select('person_id')
    .whereIn('person_id', ids)
    .andWhere({ event_id: eventId });

  const res = persons.filter(p =>
    registered.some(r => r.person_id === p.id),
  );
  return res;
}

async function addPersonToEvent(body) {
  const {
    personId,
    eventId,
    status,
    registrationStatus,
    paymentOption,
    informations,
  } = body;
  const [res] = await knex('event_persons')
    .insert({
      person_id: personId,
      event_id: eventId,
      status,
      registration_status: registrationStatus,
      payment_option_id: paymentOption,
      informations,
    })
    .returning('*');
  return res;
}

async function deletePersonFromEvent(body) {
  const { personId, eventId } = body;
  await knex('event_persons')
    .del()
    .where({
      person_id: personId,
      event_id: eventId,
    });
}

async function getEventIdFromRosterId(rosterId) {
  const [res] = await knex('event_rosters')
    .select('event_id')
    .where({ roster_id: rosterId });
  return res.event_id;
}
async function addRoster(rosterId, roster) {
  const eventId = await getEventIdFromRosterId(rosterId);
  const rosterInfos = await getRosterEventInfos(rosterId);

  const individualOption = await getRegistrationIndividualPaymentOption(
    rosterInfos.paymentOptionId,
  );
  const players = await Promise.all(
    roster.map(async r => {
      const res = await addPlayerToRoster({
        ...r,
        rosterId,
        eventId,
        individualOption,
      });
      return res;
    }),
  );
  return players;
}

const addPartner = async body => {
  const { entityId, name, description, website, photoUrl } = body;
  const [partner] = await knex('partners')
    .insert({
      organization_id: entityId,
      name,
      description,
      website,
      photo_url: photoUrl,
    })
    .returning('*');
  return partner;
};

const addPlayerToRoster = async body => {
  const {
    personId,
    name,
    id,
    rosterId,
    role,
    isSub,
    individualOption,
  } = body;
  let paymentStatus = INVOICE_STATUS_ENUM.FREE;
  if (individualOption && individualOption.individual_price > 0) {
    paymentStatus = INVOICE_STATUS_ENUM.OPEN;
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
      role,
    })
    .returning('*');

  return player;
};

const addPlayerCartItem = async body => {
  const { personId, rosterId, name, isSub } = body;
  if (isSub) {
    return;
  }

  const paymentOption = await getIndividualPaymentOptionFromRosterId(
    rosterId,
  );
  if (paymentOption.individual_price <= 0) {
    return;
  }

  const eventId = await getEventIdFromRosterId(rosterId);
  const userId = await getUserIdFromPersonId(personId);
  const event = (await getEntity(eventId, userId)).basicInfos;
  const team = (await getEntity(paymentOption.teamId, userId))
    .basicInfos;

  const ownerId = await getOwnerStripePrice(
    paymentOption.individual_stripe_price_id,
  );

  const cartItem = {
    stripePriceId: paymentOption.individual_stripe_price_id,
    metadata: {
      eventId,
      sellerEntityId: ownerId,
      isIndividualOption: true,
      personId,
      name,
      buyerId: personId,
      rosterId,
      team,
    },
  };

  await addEventCartItem(cartItem, userId);

  return { cartItem, event, team };
};

const addEventCartItem = async (body, userId) => {
  const { stripePriceId, metadata } = body;
  await knex('cart_items').insert({
    stripe_price_id: stripePriceId,
    user_id: userId,
    metadata: { ...metadata, type: GLOBAL_ENUM.EVENT },
  });
};

const getTeamIdFromRosterId = async rosterId => {
  const [{ team_id: teamId }] = await knex('team_rosters')
    .select('team_id')
    .where({ id: rosterId });
  return teamId;
};

const deletePlayerFromRoster = async body => {
  const { id, personId, rosterId } = body;
  if (id) {
    const [res] = await knex('team_players')
      .del()
      .where({ id })
      .returning('id');
    return res;
  }
  const [res] = await knex('team_players')
    .del()
    .where({ person_id: personId, roster_id: rosterId })
    .returning('id');
  return res;
};

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

async function updateMemberOptionalField(
  membershipId,
  heardOrganization,
  gettingInvolved,
  frequentedSchool,
  jobTitle,
  employer,
) {
  const [res] = await knex('memberships')
    .where({
      id: membershipId,
    })
    .update({
      heard_organization: heardOrganization,
      getting_involved: gettingInvolved,
      frequented_school: frequentedSchool,
      job_title: jobTitle,
      employer: employer,
    })
    .returning('*');
  return res;
}

async function updateTeamAcceptation(
  eventId,
  rosterId,
  registrationStatus,
) {
  const prerankPhase = await getPrerankPhase(eventId);
  const [res] = await knex('event_rosters')
    .where({
      event_id: eventId,
      roster_id: rosterId,
    })
    .update({
      registration_status: registrationStatus,
    })
    .returning('*');

  if (
    registrationStatus === STATUS_ENUM.ACCEPTED ||
    registrationStatus === STATUS_ENUM.ACCEPTED_FREE
  ) {
    await updatePreRankingRosterId(prerankPhase, rosterId, eventId);
  }
  return res;
}

async function updatePlayerAcceptation(
  eventId,
  personId,
  registrationStatus,
) {
  const [res] = await knex('event_persons')
    .where({
      event_id: eventId,
      person_id: personId,
    })
    .update({
      registration_status: registrationStatus,
    })
    .returning('*');

  return res;
}

async function updateAlias(entityId, alias) {
  if (!/^[\w.-]+$/.test(alias) || validator.isUUID(alias)) {
    throw Error(ERROR_ENUM.VALUE_IS_INVALID);
  }
  const res = await knex('alias')
    .where({
      id: entityId,
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
  fieldId,
  timeslotId,
  rankingId1,
  rankingId2,
  oldRanking1,
  oldRanking2,
  description,
) {
  const res = [];
  const [phase] = await getPhase(phaseId);
  const phaseName = await getPhaseName(phaseId);

  //TODO:  could update every data in game in one call because the parameters will always be defined
  if (phaseId) {
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

  if (fieldId) {
    const [r] = await knex('games')
      .where({
        id: gameId,
      })
      .update({
        field_id: fieldId,
        description,
      })
      .returning('*');
    res.push(r);
  }

  if (timeslotId) {
    const [r] = await knex('games')
      .where({
        id: gameId,
      })
      .update({
        timeslot_id: timeslotId,
      })
      .returning('*');
    res.push(r);
  }

  if (rankingId1) {
    const [ranking] = await knex('phase_rankings')
      .select('*')
      .where({ ranking_id: rankingId1 });

    if (ranking.roster_id) {
      const name = await getTeamName(ranking.roster_id);
      const fullName = `${ranking.initial_position}. ${phaseName} (${name})`;

      if (phase.status !== PHASE_STATUS_ENUM.NOT_STARTED) {
        const [r] = await knex('game_teams')
          .update({
            roster_id: ranking.roster_id,
            name: name,
            ranking_id: rankingId1,
          })
          .where({
            ranking_id: oldRanking1.ranking_id,
            game_id: gameId,
          })
          .returning('*');
        res.push(r);
      } else {
        const [r] = await knex('game_teams')
          .update({
            name: fullName,
            ranking_id: rankingId1,
          })
          .where({
            ranking_id: oldRanking1.ranking_id,
            game_id: gameId,
          })
          .returning('*');
        res.push(r);
      }
    } else {
      const fullName = `${ranking.initial_position}. ${phaseName}`;
      const [r] = await knex('game_teams')
        .update({ name: fullName, ranking_id: rankingId1 })
        .where({
          ranking_id: oldRanking1.ranking_id,
          game_id: gameId,
        })
        .returning('*');

      res.push(r);
    }
  }

  if (rankingId2) {
    const [ranking] = await knex('phase_rankings')
      .select('*')
      .where({ ranking_id: rankingId2 });

    if (ranking.roster_id) {
      const name = await getTeamName(ranking.roster_id);
      const fullName = `${ranking.initial_position}. ${phaseName} (${name})`;

      if (phase.status !== PHASE_STATUS_ENUM.NOT_STARTED) {
        const [r] = await knex('game_teams')
          .update({
            roster_id: ranking.roster_id,
            name: name,
            ranking_id: rankingId2,
          })
          .where({
            ranking_id: oldRanking2.ranking_id,
            game_id: gameId,
          })
          .returning('*');
        res.push(r);
      } else {
        const [r] = await knex('game_teams')
          .update({
            name: fullName,
            ranking_id: rankingId2,
          })
          .where({
            ranking_id: oldRanking2.ranking_id,
            game_id: gameId,
          })
          .returning('*');
        res.push(r);
      }
    } else {
      const fullName = `${ranking.initial_position}. ${phaseName}`;

      const [r] = await knex('game_teams')
        .update({ name: fullName, ranking_id: rankingId2 })
        .where({
          ranking_id: oldRanking2.ranking_id,
          game_id: gameId,
        })
        .returning('*');
      res.push(r);
    }
  }
  return Promise.all(res);
}

async function updateGamesInteractiveTool(games) {
  // TODO: do a real batch update
  return knex.transaction(trx => {
    queries = games.map(game =>
      knex('games')
        .where('id', game.id)
        .update({
          timeslot_id: game.timeslot_id,
          field_id: game.field_id,
        })
        .transacting(trx),
    );

    return Promise.all(queries)
      .then(trx.commit)
      .catch(trx.rollback);
  });
}

async function updateSuggestionStatus(body) {
  const { id, gameId, scores, status } = body;
  let updatedCount = 0;
  // update all suggestions with the same scores to thesame status
  updatedCount += await knex('score_suggestion')
    .update({ status })
    .where({ id });

  // get other suggestions
  const allSuggestions = await knex('score_suggestion')
    .select('*')
    .where({ game_id: gameId })
    .andWhereNot({ id });

  // change status of other suggestions
  const toBeUpdatedSame = [];
  const toBeUpdatedRefused = [];
  for (let suggestion of allSuggestions) {
    if (_.isEqual(suggestion.score, scores)) {
      toBeUpdatedSame.push(suggestion.id);
    } else if (status === STATUS_ENUM.ACCEPTED) {
      toBeUpdatedRefused.push(suggestion.id);
    }
  }

  if (toBeUpdatedSame.length) {
    updatedCount += await knex('score_suggestion')
      .update({ status })
      .whereIn('id', toBeUpdatedSame);
  }
  if (toBeUpdatedRefused.length) {
    updatedCount += await knex('score_suggestion')
      .update({ status: STATUS_ENUM.REFUSED })
      .whereIn('id', toBeUpdatedRefused);
  }

  if (status === STATUS_ENUM.ACCEPTED) {
    await setGameScore(gameId, scores);
  } else {
    const [{ count }] = await knex('score_suggestion')
      .count('submitted_by_roster')
      .where({
        game_id: gameId,
        status: STATUS_ENUM.ACCEPTED,
      });

    if (count == 0) {
      let resetScore = scores;
      Object.keys(scores).forEach(key => {
        resetScore[key] = 0;
      });
      await setGameScore(gameId, resetScore);
    }
  }

  return updatedCount;
}

async function removeEntityRole(entityId, entityIdAdmin) {
  return knex('entities_role')
    .where({ entity_id: entityId, entity_id_admin: entityIdAdmin })
    .del();
}

const deleteEntity = async (entityId, userId) => {
  const role = await getEntityRole(entityId, userId);

  if (role !== ENTITIES_ROLE_ENUM.ADMIN) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  } else {
    await knex('alias')
      .where({ id: entityId })
      .del();
    await knex('entities')
      .where({ id: entityId })
      .del();
  }
};

const deleteEntityMembership = async membershipId => {
  const res = await knex
    .select('*')
    .from(
      knex
        .select(
          knex.raw(
            "id, metadata ->> 'membershipId' AS membership_id",
          ),
        )
        .from('cart_items')
        .as('cartItems'),
    )
    .where('cartItems.membership_id', membershipId);
  await Promise.all(
    res.map(async r => {
      await knex('cart_items')
        .where({ id: r.id })
        .del();
    }),
  );

  const memberships = await knex('memberships')
    .where({
      membership_id: membershipId,
    })
    .del()
    .returning('infos_supp_id');

  await Promise.all(
    memberships.map(async m => {
      const [person] = await knex('person_infos')
        .where({
          id: m,
        })
        .del()
        .returning('address_id');

      await knex('addresses')
        .where({
          id: person,
        })
        .del();
    }),
  );

  const res2 = await knex('entity_memberships')
    .where({
      id: membershipId,
    })
    .del();
  return res2;
};

const deleteReport = async reportId => {
  return knex('reports')
    .where({ report_id: reportId })
    .del();
};
const deleteMembershipWithId = async membershipId => {
  const [res] = await knex('memberships')
    .where({
      id: membershipId,
    })
    .del()
    .returning('*');
  const [person] = await knex('person_infos')
    .where({
      id: res.infos_supp_id,
    })
    .del()
    .returning('address_id');
  await knex('addresses')
    .where({
      id: person,
    })
    .del();
  if (!res.status) {
    const res2 = await knex
      .select('*')
      .from(
        knex
          .select(knex.raw("id, metadata ->> 'id' AS membership_id"))
          .from('cart_items')
          .as('cartItems'),
      )
      .where('cartItems.membership_id', membershipId);

    await Promise.all(
      res2.map(async r => {
        await knex('cart_items')
          .where({ id: r.id })
          .del();
      }),
    );
  }
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
  const [person] = await knex('person_infos')
    .where({
      id: res.infos_supp_id,
    })
    .del()
    .returning('address_id');
  await knex('addresses')
    .where({
      id: person,
    })
    .del();
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

const deletePartner = async id => {
  return knex('partners')
    .where({ id })
    .del();
};

const getGame = async id => {
  const [game] = await knex('games')
    .select('*')
    .where({ id });
  return { ...game };
};

const getGameInfo = async id => {
  const [game] = await knex('games')
    .select('*')
    .where({ id });

  const [score_suggestion] = await knex('score_suggestion')
    .select(knex.raw('count(*) >= 2 as score_submited'))
    .where('game_id', id)
    .andWhere('status', 'accepted');

  const positions = await getTeams(id);

  if (game.phase_id) {
    game.phase_name = await getPhaseName(game.phase_id);
  }

  const [r1] = await knex('event_fields')
    .select('field')
    .where({ id: game.field_id });
  const [r2] = await knex('event_time_slots')
    .select('date')
    .where({ id: game.timeslot_id });
  return {
    ...game,
    positions,
    score_submited: score_suggestion.score_submited,
    field: r1.field,
    start_time: r2.date,
  };
};

const deleteGame = async id => {
  const game = await getGame(id);

  const [res] = await knex.transaction(async trx => {
    await knex('score_suggestion')
      .where({
        game_id: game.id,
      })
      .del()
      .transacting(trx);

    await knex('game_teams')
      .where('game_id', id)
      .del()
      .transacting(trx);

    await knex('entities')
      .where('id', game.entity_id)
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

const deletePhase = async (phaseId, eventId) => {
  const phaseGames = await knex('games')
    .select('id')
    .where({ phase_id: phaseId });

  if (phaseGames.length) {
    await Promise.all(
      phaseGames.map(async g => {
        return deleteGame(g.id);
      }),
    );
  }

  await knex('phase_rankings')
    .where({
      current_phase: phaseId,
    })
    .del();

  await knex('phase_rankings')
    .update({
      roster_id: null,
      origin_phase: null,
      origin_position: null,
    })
    .where({
      origin_phase: phaseId,
    });

  const [res] = await knex('phase')
    .where({ id: phaseId })
    .del()
    .returning('*');

  const allPhases = await getPhasesWithoutPrerank(eventId);
  await updatePhaseOrder(
    allPhases.sort((a, b) => a.phase_order - b.phase_order),
    eventId,
  );

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

const insertRosterInviteToken = async roster_id => {
  const [res] = await knex('token_roster_invite')
    .insert({ roster_id })
    .returning(['token', 'expires_at']);
  return res;
};

async function getRosterInviteToken(roster_id) {
  const [token] = await knex('token_roster_invite')
    .select('token', 'expires_at')
    .where({ roster_id })
    .whereRaw('expires_at > now()')
    .orderBy('expires_at', 'desc')
    .limit(1);
  return token;
}

async function cancelRosterInviteToken(roster_id) {
  return knex('token_roster_invite')
    .update('expires_at', knex.raw('now()'))
    .where({ roster_id })
    .whereRaw('expires_at > now()');
}

async function getRosterIdFromInviteToken(token) {
  const [{ roster_id } = {}] = await knex('token_roster_invite')
    .select('roster_id')
    .where({ token })
    .whereRaw('expires_at > now()')
    .limit(1);
  return roster_id;
}

async function getRosterEventInfos(roster_id) {
  const [res] = await knex('event_rosters')
    .select(
      'event_id',
      'event_rosters.team_id',
      'registration_status',
      'status',
      'payment_option_id',
      knex.raw('name as teamname'),
    )
    .leftJoin(
      'entities_general_infos',
      'event_rosters.team_id',
      'entities_general_infos.entity_id',
    )
    .where({ roster_id });
  if (!res) {
    return;
  }
  return {
    eventId: res.event_id,
    teamId: res.team_id,
    status: res.status,
    registrationStatus: res.registration_status,
    teamName: res.teamname,
    paymentOptionId: res.payment_option_id,
  };
}

module.exports = {
  acceptScoreSuggestion,
  acceptScoreSuggestionIfPossible,
  addAlias,
  addAllFields,
  addAllGames,
  addAllTimeslots,
  addEntity,
  addEntityRole,
  addEventCartItem,
  addField,
  addGame,
  addGameAttendances,
  addMember,
  addMemberManually,
  addMembership,
  addOption,
  addPartner,
  addPersonToEvent,
  addPhase,
  addPlayerCartItem,
  addPlayerToRoster,
  addReport,
  addRoster,
  addScoreSuggestion,
  addMemberDonation,
  addSpiritSubmission,
  addTeamToEvent,
  addTimeSlot,
  cancelRosterInviteToken,
  canRemovePlayerFromRoster,
  canUnregisterTeam,
  deleteEntity,
  deleteEntityMembership,
  deleteGame,
  deleteMembership,
  deleteMembershipWithId,
  deleteOption,
  deletePartner,
  deletePersonFromEvent,
  deletePhase,
  deletePlayerFromRoster,
  deleteRegistration,
  deleteReport,
  deleteTeamFromEvent,
  deleteTeamPhase,
  eventInfos,
  generateAuthToken,
  generateReport,
  getAlias,
  getAllEntities,
  getAllForYouPagePosts,
  getAllOwnedEntities,
  getAllPeopleRegistered,
  getAllPeopleRegisteredInfos,
  getAllPlayersAcceptedRegistered,
  getAllPlayersPending,
  getAllPlayersRefused,
  getAllRolesEntity,
  getAllTeamsAcceptedInfos,
  getAllTeamsAcceptedRegistered,
  getAllTeamsPending,
  getAllTeamsRefused,
  getAllTeamsRegistered,
  getAllTeamsRegisteredInfos,
  getAllTypeEntities,
  getAttendanceSheet,
  getCreator,
  getCreators,
  getCreatorsEmails,
  getEmailPerson,
  getEmailsEntity,
  getEntitiesTypeById,
  getEmailsLandingPage,
  getEntity,
  getEntityOwners,
  getEntityRole,
  getEvent,
  getEventAdmins,
  getEventIdFromRosterId,
  getFields,
  getGame,
  getGameInfo,
  getGamePlayersWithRole,
  getGames,
  getGameSubmissionInfos,
  getGamesWithAwaitingScore,
  getGameTeams,
  getGeneralInfos,
  getGraphAmountGeneratedByEvent,
  getGraphMemberCount,
  getGraphUserCount,
  getIndividualPaymentOptionFromRosterId,
  getLastRankedTeam,
  getMostRecentMember,
  getMembers,
  getMembership,
  getMemberships,
  getMyPersonsAdminsOfTeam,
  getNbOfTeamsInEvent,
  getNbOfTeamsInPhase,
  getOptions,
  getOrganizationMembers,
  getOrganizationTokenPromoCode,
  getOwnedEvents,
  getOwnerStripePrice,
  getPartners,
  getPersonGames,
  getPersonInfos,
  getPersonInvoiceItem,
  getPersonPaymentOption,
  getPhaseRanking,
  getPhasesGameAndTeams,
  getPhasesWithoutPrerank,
  getPlayerInvoiceItem,
  getPreranking,
  getPrerankPhase,
  getPrimaryPerson,
  getRealId,
  getRegistered,
  getRegisteredPersons,
  getRegistrationIndividualPaymentOption,
  getRegistrationStatus,
  getRegistrationTeamPaymentOption,
  getRemainingSpots,
  getReports,
  getRoleRoster,
  getRoster,
  getRosterByEventAndUser,
  getRosterEventInfos,
  getRosterIdFromInviteToken,
  getRosterInviteToken,
  getRosterInvoiceItem,
  getRosterName,
  getRostersNames,
  getScoreSuggestion,
  getSlots,
  getSubmissionerInfos,
  getTeamCreatorEmail,
  getTeamGames,
  getTeamGamesInfos,
  getTeamIdFromRosterId,
  getTeamPaymentOptionFromRosterId,
  getTeamsSchedule,
  getUnplacedGames,
  getUserIdFromPersonId,
  getUserNextGame,
  getWichTeamsCanUnregister,
  hasMemberships,
  insertRosterInviteToken,
  isPlayerInRoster,
  isScoreSuggestionAlreadySubmitted,
  isSpiritAlreadySubmitted,
  isTeamRegisteredInEvent,
  personIsAwaitingTransfer,
  removeEntityRole,
  removeEventCartItem,
  removeIndividualEventCartItem,
  removeIndividualPaymentCartItem,
  setGameScore,
  unregister,
  updateAlias,
  updateEntityName,
  updateEntityPhoto,
  updateEntityRole,
  updateEvent,
  updateFinalPositionPhase,
  updateGame,
  updateGamesInteractiveTool,
  updateGeneralInfos,
  updateInitialPositionPhase,
  updateManualRanking,
  updateMember,
  updateMemberOptionalField,
  updateMembershipInvoice,
  updateMembershipTermsAndConditions,
  updatePartner,
  updateOption,
  updateOriginPhase,
  updatePersonInfosHelper,
  updatePhase,
  updatePhaseFinalRanking,
  updatePhaseGamesRosterId,
  updatePhaseOrder,
  updatePhaseRankingsSpots,
  updatePlayerAcceptation,
  updatePlayerPaymentStatus,
  updatePreRanking,
  updateRegistration,
  updateRegistrationPerson,
  updateRosterRole,
  updateSuggestionStatus,
  updateTeamAcceptation,
};
