import knex from '../connection.js';
import {
  ENTITIES_ROLE_ENUM,
  ROSTER_ROLE_ENUM,
} from '../../../../common/enums/index.js';

const getRosterByIdAndSub = async (rosterId, withSub) => {
  let whereCond = { roster_id: rosterId };
  if (!withSub) {
    whereCond.is_sub = false;
  }
  return await knex('roster_players_infos')
    .select('*')
    .where(whereCond)
    .orderByRaw(
      `array_position(array['${ROSTER_ROLE_ENUM.COACH}'::varchar, '${ROSTER_ROLE_ENUM.CAPTAIN}'::varchar, '${ROSTER_ROLE_ENUM.ASSISTANT_CAPTAIN}'::varchar, '${ROSTER_ROLE_ENUM.PLAYER}'::varchar], role)`,
    );
}
const getTeamCaptainsById = async (teamId) => {
  return await knex('entities_role')
    .select('entity_id_admin')
    .where('role', '=', ENTITIES_ROLE_ENUM.ADMIN)
    .andWhere('entity_id', '=', teamId);
}

const getRoleRosterByIdAndUserId = async (rosterId, userId) => {
  const [{ role } = {}] = await knex('roster_players')
    .select('roster_players.role')
    .join(
      'user_entity_role',
      'user_entity_role.entity_id',
      'roster_players.person_id',
    )
    .where({ roster_id: rosterId, user_id: userId })
    .orderByRaw(
      `array_position(array['${ROSTER_ROLE_ENUM.COACH}'::varchar, '${ROSTER_ROLE_ENUM.CAPTAIN}'::varchar, '${ROSTER_ROLE_ENUM.ASSISTANT_CAPTAIN}'::varchar, '${ROSTER_ROLE_ENUM.PLAYER}'::varchar], roster_players.role)`,
    )
    .limit(1);
  return role;
}

export {
  getRosterByIdAndSub,
  getTeamCaptainsById,
  getRoleRosterByIdAndUserId,
};
