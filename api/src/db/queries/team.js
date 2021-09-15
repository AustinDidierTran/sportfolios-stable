import knex from '../connection.js';
import { GLOBAL_ENUM } from '../../../../common/enums/index.js';

export const getAllTeamsWithAdmins = async (limit = 10, page = 1) => {
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
