import { Model } from 'objection';
import { entitiesGeneralInfos } from './entitiesGeneralInfos.js';
import { phaseRankings } from './phaseRankings.js';

export class teamRosters extends Model {
  static get tableName() {
    return 'team_rosters';
  }

  static get relationMappings() {
    return {
      phaseRankings: {
        relation: Model.HasManyRelation,
        modelClass: phaseRankings,
        join: {
          from: 'team_rosters.id',
          to: 'phase_rankings.roster_id'
        }
      },
      entitiesGeneralInfos: {
        relation: Model.HasOneRelation,
        modelClass: entitiesGeneralInfos,
        join: {
          from: 'team_rosters.team_id',
          to: 'entities_general_infos.entity_id'
        }
      },
    };
  }
}