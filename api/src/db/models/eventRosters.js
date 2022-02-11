import { Model } from 'objection';
import { entities } from './entities.js';
import { entitiesGeneralInfos } from './entitiesGeneralInfos.js';
import { eventPaymentOptions } from './eventPaymentOptions.js';
import { rosterPlayersInfos } from './rosterPlayersInfos.js';
import { entitiesRole } from './entitiesRole.js';
import { eventsInfos } from './eventsInfos.js';
import { rosterPlayers } from './rosterPlayers.js';
import { teamRosters } from './teamRosters.js';

export class eventRosters extends Model {
  static get tableName() {
    return 'event_rosters';
  }
  static get idColumn() {
    return 'roster_id';
  }
  static get relationMappings() {
    return {
      entities: {
        relation: Model.HasOneRelation,
        modelClass: entities,
        join: {
          from: 'event_rosters.team_id',
          to: 'entities.id'
        }
      },
      entitiesGeneralInfos: {
        relation: Model.HasOneRelation,
        modelClass: entitiesGeneralInfos,
        join: {
          from: 'event_rosters.team_id',
          to: 'entities_general_infos.entity_id'
        }
      },
      entitiesRole: {
        relation: Model.HasOneRelation,
        modelClass: entitiesRole,
        join: {
          from: 'event_rosters.team_id',
          to: 'entities_role.entity_id'
        }
      },
      eventPaymentOptions: {
        relation: Model.HasOneRelation,
        modelClass: eventPaymentOptions,
        join: {
          from: 'event_rosters.payment_option_id',
          to: 'event_payment_options.id'
        }
      },
      rosterPlayersInfos: {
        relation: Model.HasManyRelation,
        modelClass: rosterPlayersInfos,
        join: {
          from: 'event_rosters.roster_id',
          to: 'roster_players_infos.roster_id',
        }
      },
      eventsInfos: {
        relation: Model.HasOneRelation,
        modelClass: eventsInfos,
        join: {
          from: 'event_rosters.event_id',
          to: 'events_infos.id',
        }
      },
      rosterPlayers: {
        relation: Model.HasManyRelation,
        modelClass: rosterPlayers,
        join: {
          from: 'event_rosters.roster_id',
          to: 'roster_players.roster_id',
        }
      },
      teamRoster:{
        relation: Model.HasOneRelation,
        modelClass: teamRosters,
        join: {
          from: 'event_rosters.roster_id',
          to: 'team_rosters.id',
        }
      },
      eventGeneralInfos: {
        relation: Model.HasOneRelation,
        modelClass: entitiesGeneralInfos,
        join: {
          from: 'event_rosters.event_id',
          to: 'entities_general_infos.entity_id'
        }
      },
    };
  }
}