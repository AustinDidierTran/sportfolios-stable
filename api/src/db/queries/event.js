import knex from '../connection.js';
import { getEntity } from './entity.js'
import {
  STATUS_ENUM,
  TAG_TYPE_ENUM,
} from '../../../../common/enums/index.js';

async function getAllPeopleRegisteredNotInTeams(eventId) {
  const subquery = knex('event_rosters')
    .select('person_id')
    .join('roster_players', 'roster_players.roster_id', '=', 'event_rosters.roster_id')
    .where({
      event_id: eventId,
    });

  const people = await knex('event_persons')
    .select('*')
    .where({
      'event_id': eventId,
    })
    .andWhere(
      'person_id', 'not in', subquery
    );
  return people;
}


export async function getAllPeopleRegisteredNotInTeamsInfos(eventId, userId) {
  const people = await getAllPeopleRegisteredNotInTeams(eventId);

  const [event] = await knex('events_infos')
    .select('creator_id')
    .where({
      id: eventId,
    });

  const res = await Promise.all(
    people.map(async p => {

      const entity = (await getEntity(p.person_id, userId))
        .basicInfos;

      const memberships = await knex('memberships_infos')
        .select('*')
        .where({
          person_id: p.person_id,
          organization_id: event.creator_id,
        });

      const date = new Date();
      const active_membership = memberships.filter(m => {
        return (
          moment(m.created_at).isSameOrBefore(moment(date), 'day') &&
          moment(m.expiration_date).isSameOrAfter(moment(date), 'day')
        );
      });

      return {
        personId: p.person_id,
        completeName: `${entity.name} ${entity.surname}`,
        photoUrl: entity.photoUrl,
        personId: p.person_id,
        invoiceItemId: p.invoice_item_id,
        status: TAG_TYPE_ENUM.REGISTERED,
        paymentStatus: p.status,
        isMember: active_membership.length > 0,
        registeredOn: p.created_at,
        informations: p.informations,
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
