import { Model } from 'objection';

export class teamPlayers extends Model {
  static get tableName() {
    return 'team_players';
  }

}