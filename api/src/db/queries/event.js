import knex from '../connection.js';
import { GLOBAL_ENUM } from '../../../../common/enums/index.js';
import {
  getEntity,
  getEmailPerson,
  getPaymentOption,
} from './entity-deprecate.js';
import moment from 'moment';
import { eventRosters } from '../models/eventRosters.js';
import { eventsInfos } from '../models/eventsInfos.js';
import {
  ROSTER_ROLE_ENUM,
  STATUS_ENUM,
} from '../../../../common/enums/index.js';

async function getAllPeopleRegisteredNotInTeams(eventId) {
  const subquery = knex('event_rosters')
    .select('person_id')
    .join(
      'roster_players',
      'roster_players.roster_id',
      '=',
      'event_rosters.roster_id',
    )
    .where({
      event_id: eventId,
    });

  const people = await knex('event_persons')
    .select('*')
    .where({
      event_id: eventId,
    })
    .andWhere('person_id', 'not in', subquery);
  return people;
}

const getStripeInvoiceItem = async invoiceItemId => {
  const [res] = await knex('stripe_invoice_item')
    .select('*')
    .where({ invoice_item_id: invoiceItemId });
  return res;
};

export async function getAllPeopleRegisteredNotInTeamsInfos(
  eventId,
  userId,
) {
  const people = await getAllPeopleRegisteredNotInTeams(eventId);

  const [event] = await knex('events_infos')
    .select('creator_id')
    .where({
      id: eventId,
    });

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
      const date = new Date();

      const memberships = await knex('memberships_infos')
        .select('*')
        .where({
          person_id: p.person_id,
          organization_id: event.creator_id,
        });

      const active_membership = memberships.filter(m => {
        return (
          moment(m.created_at).isSameOrBefore(moment(date), 'day') &&
          moment(m.expiration_date).isSameOrAfter(moment(date), 'day')
        );
      });

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
        isMember: active_membership.length > 0,
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

export const getEventPaymentOption = async stripePriceId => {
  let [option] = await knex('event_payment_options')
    .select('*')
    .where({ team_stripe_price_id: stripePriceId });
  if (option) {
    return option;
  }

  [option] = await knex('event_payment_options')
    .select('*')
    .where({ individual_stripe_price_id: stripePriceId });
  return option;
};

/**
 * Currently only returns spirit rankings, but should eventually return
 * prerankings and phase rankings
 * Return {Object: { spirit }}
 */
export const getRankings = async eventId => {
  const spirit = await knex
    .select(
      'entities_general_infos.name',
      'game_teams.roster_id AS rosterId',
    )
    .sum('game_teams.spirit')
    .from('phase')
    .leftJoin('games', 'games.phase_id', '=', 'phase.id')
    .leftJoin('game_teams', 'games.id', '=', 'game_teams.game_id')
    .leftJoin(
      'event_rosters',
      'game_teams.roster_id',
      '=',
      'event_rosters.roster_id',
    )
    .leftJoin(
      'entities_general_infos',
      'entities_general_infos.entity_id',
      '=',
      'event_rosters.team_id',
    )
    .where('phase.event_id', eventId)
    .whereNotNull('entities_general_infos.name')
    .whereNotNull('game_teams.roster_id')
    .groupBy('entities_general_infos.name', 'game_teams.roster_id');

  return {
    spirit: spirit
      .map(s => ({
        name: s.name,
        rosterId: s.rosterId,
        spirit: Number(s.sum) || 0,
      }))
      .sort((a, b) => b.spirit - a.spirit),
  };
};

export const getAllEventsWithAdmins = async (
  limit = 10,
  page = 1,
  query = '',
) => {
  const events = await knex
    .select(
      'entities.id',
      'entities_general_infos.name',
      'entities_general_infos.photo_url',
      'entities.deleted_at',
      knex.raw('json_agg(entity_admins) AS entity_admins'),
    )
    .from(
      knex
        .select(
          'entities_role.entity_id',
          'entities_role.entity_id_admin',
          'name',
          'surname',
          'photo_url',
        )
        .from('entities_role')
        .leftJoin(
          'entities_general_infos',
          'entities_general_infos.entity_id',
          '=',
          'entities_role.entity_id_admin',
        )
        .as('entity_admins'),
    )
    .leftJoin(
      'entities',
      'entities.id',
      '=',
      'entity_admins.entity_id',
    )
    .leftJoin(
      'entities_general_infos',
      'entities_general_infos.entity_id',
      '=',
      'entities.id',
    )
    .where('entities.type', GLOBAL_ENUM.EVENT)
    .where('entities_general_infos.name', 'ILIKE', `%${query}%`)
    .limit(limit)
    .offset(limit * Math.max(0, page - 1))
    .groupBy(
      'entities.id',
      'entities_general_infos.name',
      'entities_general_infos.photo_url',
      'entities.deleted_at',
    );

  const [{ count }] = await knex('entities')
    .count('*')
    .where('type', GLOBAL_ENUM.EVENT);

  return {
    count: Number(count),
    events: events.map(r => ({
      id: r.id,
      name: r.name,
      photoUrl: r.photo_url,
      deletedAt: r.deleted_at,
      admins: r.entity_admins.map(admin => ({
        id: admin.entity_id_admin,
        name: admin.name,
        surname: admin.surname,
        photoUrl: admin.photo_url,
      })),
    })),
  };
};

export const restoreTeamById = id => {
  return knex('entities')
    .update('deleted_at', null)
    .where({ id });
};

export const deleteTeamById = id => {
  return knex('entities')
    .del()
    .where({ id });
};

export const getEventInfoById = async eventId => {
  const [event] = await knex('events_infos')
    .select('creator_id')
    .where({
      id: eventId,
    });
  return event;
};

export const getTeamsRegisteredInfo = async eventId => {
  return await knex('event_rosters')
    .select(
      'event_rosters.payment_option_id as paymentOptionId',
      'user_email.email as email',
      'stripe_invoice_item.user_id as userId',
      'stripe_invoice_item.invoice_item_id as invoiceItemId',
      'stripe_invoice_item.stripe_price_id as stripePriceId',
      'stripe_invoice_item.metadata as metadata',
      'stripe_invoice_item.seller_entity_id as sellerEntityId',
      'event_rosters.registration_status as registrationStatus',
      'event_rosters.roster_id as rosterId',
      'event_rosters.team_id as teamId',
      'event_rosters.invoice_item_id as invoiceItemId',
      'event_rosters.status as status',
      'event_rosters.created_at as registeredOn',
      'event_rosters.informations as informations',
    )
    .where('event_rosters.event_id', eventId)
    .leftJoin('stripe_invoice_item', function() {
      this.on(
        'stripe_invoice_item.invoice_item_id',
        '=',
        'event_rosters.invoice_item_id',
      ).onNotNull('event_rosters.invoice_item_id');
    })
    .join('entities_role', function() {
      this.on(
        'entities_role.entity_id',
        '=',
        'event_rosters.team_id',
      ).andOn('entities_role.role', '=', 1);
    })
    .join('user_entity_role', function() {
      this.on(
        'user_entity_role.entity_id',
        '=',
        'entities_role.entity_id_admin',
      );
    })
    .leftJoin(
      'user_email',
      'user_email.user_id',
      '=',
      'user_entity_role.user_id',
    );
};

export const getPaymentOptionById = async paymentOptionId => {
  const [option] = await knex('event_payment_options')
    .select('*')
    .where({ id: paymentOptionId });
  return option;
};

export const getTeamsAcceptedInfos = async (
  eventId,
  userId,
  withSub = false,
) => {
  const teams = await eventRosters
    .query()
    .withGraphJoined(
      '[entitiesGeneralInfos,entitiesRole.userEntityRole.userEmail, eventPaymentOptions, rosterPlayersInfos.memberships, eventsInfos, rosterPlayers]',
    )
    .whereIn('registration_status', [
      STATUS_ENUM.ACCEPTED,
      STATUS_ENUM.ACCEPTED_FREE,
    ])
    .andWhere({
      'event_rosters.event_id': eventId,
    })
    .modifyGraph('rosterPlayersInfos', builder => {
      builder
        .where('is_sub', withSub)
        .orWhere('is_sub', false)
        .orderByRaw(
          `array_position(array['${ROSTER_ROLE_ENUM.COACH}'::varchar, '${ROSTER_ROLE_ENUM.CAPTAIN}'::varchar, '${ROSTER_ROLE_ENUM.ASSISTANT_CAPTAIN}'::varchar, '${ROSTER_ROLE_ENUM.PLAYER}'::varchar], role)`,
        );
    })
    .modifyGraph('entitiesRole.userEntityRole.userEmail', builder => {
      builder.select('email');
    })
    .modifyGraph('rosterPlayers', builder => {
      if (userId != -1) {
        builder
          .innerJoin(
            'user_entity_role',
            'user_entity_role.entity_id',
            'person_id',
          )
          .where('user_id', userId);
      } else builder.where(false);
    });
  return teams;
};

export const getRegistrationStatus = async rosterId => {
  const [registration] = await knex('event_rosters')
    .select('registration_status')
    .where({
      roster_id: rosterId,
    });

  return registration.registration_status;
};

export const getTeamNameUniquenessInEvent = async (name, eventId) => {
  const [{ count }] = await knex('event_rosters')
    .count('*')
    .leftJoin(
      'entities_general_infos',
      'entities_general_infos.entity_id',
      '=',
      'event_rosters.team_id',
    )
    .where({ event_id: eventId })
    .andWhere(knex.raw('lower("name")'), '=', name.toLowerCase());

  return Number(count) === 0;
};

export const getEventVerified = async () => {
  return await eventsInfos
    .query()
    .withGraphJoined('[creatorEntities.entitiesGeneralInfos]')
    .whereNull('events_infos.deleted_at')
    .andWhere(function() {
      this.whereNotNull('creatorEntities.verified_by');
    });
};

export const createEvent = async ({
  name,
  startDate,
  endDate,
  location,
  photoUrl,
  eventType,
  maximumSpots,
  creatorId,
  phaseRankings,
  trx = null,
}) => {
  console.log({
    name,
    startDate,
    endDate,
    location,
    photoUrl,
    eventType,
    maximumSpots,
    creatorId,
    phaseRankings,
  });

  try {
    return entities.query(trx).insertGraph({
      type: GLOBAL_ENUM.EVENT,
      entitiesGeneralInfos: {
        name,
        photo_url: photoUrl,
      },
      entitiesRole: {
        role: ENTITIES_ROLE_ENUM.ADMIN,
        entity_id_admin: creatorId,
      },
      event: {
        start_date: startDate,
        start_varchar: startDate,
        end_date: endDate,
        end_varchar: endDate,
        maximum_spots: maximumSpots,
        type: eventType,
        phases: [
          {
            name: 'prerank',
            spots: maximumSpots,
            phase_order: 0,
            status: PHASE_STATUS_ENUM.NOT_STARTED,
            phaseRankings: phaseRankings,
          },
        ],
      },
    });
  } catch (err) {
    console.log(err);
  }
};

export const getEventTypeGame = async eventId => {
  return await events
    .query()
    .withGraphJoined(
      '[eventsInfos.creatorEntities.entitiesGeneralInfos, games.eventTicketOptions.[eventTicketPaid.stripeInvoiceItem.[stripePrice, userEmail, userPrimaryPerson.entitiesGeneralInfos],stripePrice]]',
      { minimize: true },
    )
    .modifyGraph(
      'games.eventTicketOptions.eventTicketPaid',
      builder => {
        builder.orderBy('created_at');
      },
    )
    .where({
      '_t0.id': eventId,
    });
};

export const getEventByRankingId = async rankingId => {
  const [{ event_id }] = await knex('phase_rankings')
    .select('event_id')
    .leftJoin(
      'phase',
      'phase.id',
      '=',
      'phase_rankings.current_phase',
    )
    .where('phase_rankings.ranking_id', rankingId);

  return event_id;
};

export const updateRosterIdInRankings = async (
  newRosterId,
  rankingId,
) => {
  const res = await knex('phase_rankings')
    .update({
      roster_id: newRosterId,
    })
    .where('ranking_id', rankingId);

  return res;
};
