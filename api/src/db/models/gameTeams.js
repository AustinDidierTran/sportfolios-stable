import { Model } from 'objection';
import { eventRosters } from './eventRosters.js';
import { games } from './games.js';

export class gameTeams extends Model {
  static get tableName() {
    return 'game_teams';
  }

  static get relationMappings() {
    return {
      games: {
        relation: Model.HasOneRelation,
        modelClass: games,
        join: {
          from: 'game_teams.game_id',
          to: 'games.id'
        }
      },
      eventRoster: {
        relation: Model.HasOneRelation,
        modelClass: eventRosters,
        join: {
          from: 'game_teams.roster_id',
          to: 'event_rosters.roster_id'
        }
      },
    };
  }
}