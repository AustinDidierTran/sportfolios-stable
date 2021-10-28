import { Model } from 'objection';
import { phase } from './phase.js';

export class phaseRankings extends Model {
  static get tableName() {
    return 'phase_rankings';
  }
  static get idColumn() {
    return ['current_phase', 'initial_position'];
  }
  static get relationMappings() {
    return {
      phases: {
        relation: Model.HasOneRelation,
        modelClass: phase,
        join: {
          from: 'phase_rankings.current_phase',
          to: 'phase.id'
        }
      },
    };
  }
}