import { Model } from 'objection';
import { phase } from './phase.js'
import { teamRosters } from './teamRosters.js';
export class phaseRankings extends Model {
  static get tableName() {
    return 'phase_rankings';
  }

  static get idColumn() {
    return ['current_phase', 'initial_position'];
  }

  static get relationMappings() {
    return {
      currentPhase: {
        relation: Model.HasOneRelation,
        modelClass: phase,
        join: {
          from: 'phase_rankings.current_phase',
          to: 'phase.id'
        }
      },
      teamRoster: {
        relation: Model.HasOneRelation,
        modelClass: teamRosters,
        join: {
          from: 'phase_rankings.roster_id',
          to: 'team_rosters.id'
        }
      },
    };
  }
}