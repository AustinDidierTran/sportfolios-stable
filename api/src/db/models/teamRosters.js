import { Model } from 'objection';

export class teamRosters extends Model {
  static get tableName() {
    return 'team_rosters';
  }

}