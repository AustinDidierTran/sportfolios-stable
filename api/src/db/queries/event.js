import knex from '../connection.js';

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
