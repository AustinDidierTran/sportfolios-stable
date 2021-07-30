const {
  ENTITIES_ROLE_ENUM,
  REPORT_TYPE_ENUM,
  GLOBAL_ENUM,
  CARD_TYPE_ENUM,
} = require('../../../../common/enums');
const { ERROR_ENUM } = require('../../../../common/errors');
const knex = require('../connection');
const {
  generateSalesReport,
  generateMembersReport,
} = require('../helpers/organization');
const { getEntity } = require('./entity');
const moment = require('moment');
const { isAllowed } = require('../helpers/utils');

async function getOwnedEvents(organizationId) {
  const events = await knex('events_infos')
    .select('*')
    .leftJoin(
      'entities_role',
      'events_infos.id',
      '=',
      'entities_role.entity_id',
    )
    .where('entities_role.entity_id_admin', '=', organizationId)
    .whereNull('deleted_at');

  const fullEvents = await Promise.all(
    events.map(async event => {
      const { creator_id: creatorId } = event;
      const creator = (await getEntity(creatorId)).basicInfos;
      return {
        type: GLOBAL_ENUM.EVENT,
        cardType: CARD_TYPE_ENUM.EVENT,
        eventId: event.id,
        photoUrl: event.photo_url,
        startDate: event.start_date,
        endDate: event.end_date,
        quickDescription: event.quick_description,
        description: event.description,
        location: event.location,
        name: event.name,
        createdAt: event.created_at,
        creator: {
          id: creator.id,
          type: creator.type,
          name: creator.name,
          surname: creator.surname,
          photoUrl: creator.photoUrl,
        },
      };
    }),
  );
  return fullEvents;
}

async function generateReport(reportId) {
  const [report] = await knex('reports')
    .select('*')
    .where({ report_id: reportId });

  const ReportMap = {
    [REPORT_TYPE_ENUM.MEMBERS]: generateMembersReport,
    [REPORT_TYPE_ENUM.SALES]: generateSalesReport,
  };
  const getReport = ReportMap[report.type];

  return getReport(report);
}

async function getOrganizationMembers(organizationId, userId) {
  if (
    !(await isAllowed(
      organizationId,
      userId,
      ENTITIES_ROLE_ENUM.EDITOR,
    ))
  ) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }
  const members = await knex('memberships')
    .select('*')
    .rightJoin(
      'entities',
      'entities.id',
      '=',
      'memberships.person_id',
    )
    .whereNull('deleted_at')
    .andWhere('entities.type', '=', GLOBAL_ENUM.PERSON)
    .andWhere({ organization_id: organizationId });
  const reduce = members.reduce((prev, curr) => {
    let addCurr = true;
    const filter = prev.filter(p => {
      if (
        p.member_type != curr.member_type ||
        p.person_id != curr.person_id
      ) {
        return true;
      } else {
        if (
          moment(p.expiration_date) > moment(curr.expiration_date)
        ) {
          addCurr = false;
          return true;
        } else {
          return false;
        }
      }
    });
    if (addCurr) {
      return [...filter, curr];
    }
    return filter;
  }, []);

  const res = await Promise.all(
    reduce.map(async m => ({
      organizationId: m.organization_id,
      person: (await getEntity(m.person_id)).basicInfos,
      memberType: m.member_type,
      expirationDate: m.expiration_date,
      id: m.id,
      createdAt: m.created_at,
      status: m.status,
    })),
  );
  return res;
}

module.exports = {
  getOwnedEvents,
  generateReport,
  getOrganizationMembers,
};
