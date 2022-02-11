import knex from '../connection.js';
import {
  ENTITIES_ROLE_ENUM,
  ROSTER_ROLE_ENUM,
} from '../../../../common/enums/index.js';
import { teamPlayers } from '../models/teamPlayers.js'
import { rosterPlayers } from '../models/rosterPlayers.js'
import { GLOBAL_ENUM } from '../../../../common/enums/index.js';

export const getAllTeamsWithAdmins = async (
  limit = 10,
  page = 1,
  query = '',
) => {
  const teams = await knex
    .select(
      'entities.id',
      'entities_general_infos.name',
      'entities_general_infos.photo_url',
      'entities.deleted_at',
      knex.raw('json_agg(entity_admins) AS entity_admins'),
    )
    .from(
      knex
        .select(
          'entities_role.entity_id',
          'entities_role.entity_id_admin',
          'name',
          'surname',
          'photo_url',
        )
        .from('entities_role')
        .leftJoin(
          'entities_general_infos',
          'entities_general_infos.entity_id',
          '=',
          'entities_role.entity_id_admin',
        )
        .as('entity_admins'),
    )
    .leftJoin(
      'entities',
      'entities.id',
      '=',
      'entity_admins.entity_id',
    )
    .leftJoin(
      'entities_general_infos',
      'entities_general_infos.entity_id',
      '=',
      'entities.id',
    )
    .where('entities.type', GLOBAL_ENUM.TEAM)
    .where('entities_general_infos.name', 'ILIKE', `%${query}%`)
    .limit(limit)
    .offset(limit * Math.max(0, page - 1))
    .groupBy(
      'entities.id',
      'entities_general_infos.name',
      'entities_general_infos.photo_url',
      'entities.deleted_at',
    );

  const [{ count }] = await knex('entities')
    .count('*')
    .where('type', GLOBAL_ENUM.TEAM);

  return {
    count: Number(count),
    teams: teams.map(r => ({
      id: r.id,
      name: r.name,
      photoUrl: r.photo_url,
      deletedAt: r.deleted_at,
      admins: r.entity_admins.map(admin => ({
        id: admin.entity_id_admin,
        name: admin.name,
        surname: admin.surname,
        photoUrl: admin.photo_url,
      })),
    })),
  };
};

export const restoreTeamById = id => {
  return knex('entities')
    .update('deleted_at', null)
    .where({ id });
};

export const deleteTeamById = id => {
  return knex('entities')
    .del()
    .where({ id });
};

export const getRosterByIdAndSub = async (rosterId, withSub) => {
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
export const getTeamCaptainsById = async (teamId) => {
  return await knex('entities_role')
    .select('entity_id_admin')
    .where('role', '=', ENTITIES_ROLE_ENUM.ADMIN)
    .andWhere('entity_id', '=', teamId);
}

export const getRoleRosterByIdAndUserId = async (rosterId, userId) => {
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

export const addPlayersToTeam = async (teamId, playersIds,  role='player') => {
  return await teamPlayers.query()
    .insert(
      playersIds.map(p => ({ team_id: teamId, person_id: p, role: role }))
    ).onConflict(['person_id', 'team_id']).merge();
};


export const addPlayerToRoster = async (rosterId, personId, isSub, paymentStatus, role) => {
  return await rosterPlayers.query()
    .insert(
      {
        roster_id: rosterId,
        person_id: personId,
        is_sub: isSub,
        payment_status: paymentStatus,
        role
      }   
    ).onConflict(['person_id', 'roster_id']).merge().returning('*');
};

