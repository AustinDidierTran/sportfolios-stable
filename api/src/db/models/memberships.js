import { Model } from 'objection';
import { rosterPlayersInfos } from './rosterPlayersInfos.js';

export class memberships extends Model {
  static get tableName() {
    return 'memberships';
  }
  static get relationMappings() {
    return {
      rosterPlayersInfos: {
        relation: Model.HasOneRelation,
        modelClass: rosterPlayersInfos,
        join: {
          from: 'memberships.person_id',
          to: 'roster_players_infos.person_id',
        }
      },
    };
  }
}