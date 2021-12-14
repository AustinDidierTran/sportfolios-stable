import * as queries from '../../db/queries/team.js';
import { getTeamExercisesByTeamId, getSessionExercisesBySessionId } from '../../db/queries/exercises.js'
import * as eventQueries from '../../db/queries/event.js';
import { getPaymentOption } from '../../server/service/event.js'
import { getEntity } from '../../db/queries/entity-deprecate.js'
import { getRosterByIdAndSub, getTeamCaptainsById, getRoleRosterByIdAndUserId } from '../../db/queries/team.js'
import { getMembershipsByIdAndOrganizationId, getMembershipByPersonIds } from '../../db/queries/memberships.js'
import { getEmailsEntity } from '../../db/queries/entity-deprecate.js'
import {
  INVOICE_STATUS_ENUM,
  PILL_TYPE_ENUM,
  ROSTER_ROLE_ENUM,
  STATUS_ENUM,
  TAG_TYPE_ENUM,
  ENTITIES_ROLE_ENUM
} from '../../../../common/enums/index.js';
import { ERROR_ENUM } from '../../../../common/errors/index.js';
import moment from 'moment';
import { isAllowed } from '../../db/queries/utils.js';


const getTeamExercises = async (teamId) => {
  return await getTeamExercisesByTeamId(teamId);
}

const getSessionExercises = async (sessionId) => {
  return await getSessionExercisesBySessionId(sessionId);
}

const getTeamsRegisteredInfos = async (eventId, pills, userId) => {
  const event = await eventQueries.getEventInfoById(eventId);
  const teams = await eventQueries.getTeamsRegisteredInfo(eventId);



  let res = await Promise.all(
    teams.map(async t => {
      const entity = (await getEntity(t.teamId, userId)).basicInfos;
      const players = await getRoster(t.rosterId, true);
      const captains = await getTeamCaptains(t.teamId, userId);
      const role = await getRoleRoster(t.rosterId, userId);
      const option = await getPaymentOption(t.paymentOptionId);
      const date = new Date();

      const memberships = await getMembershipsByIdAndOrganizationId(captains[0].id, event.creator_id);
      const active_membership = memberships.filter(m => {
        return (
          moment(m.created_at).isSameOrBefore(moment(date), 'day') &&
          moment(m.expiration_date).isSameOrAfter(moment(date), 'day')
        );
      });
      if (!t.email) {
        t.email = getEmailsEntity(person_id);
      }
      let invoice = null;
      if (t.invoiceItemId) {
        invoice = {
          userId: t.userId,
          invoiceItemId: t.invoiceItemId,
          stripePriceId: t.stripePriceId,
          metadata: t.metadata,
          sellerEntityId: t.sellerEntityId,
        };
      }
      return {
        name: entity.name,
        surname: entity.surname,
        photoUrl: entity.photoUrl,
        rosterId: t.rosterId,
        teamId: t.teamId,
        invoiceItemId: t.invoiceItemId,
        status: t.status,
        registeredOn: t.registeredOn,
        informations: t.informations,
        email: t.email,
        players,
        captains,
        option: option,
        invoice: invoice,
        role,
        registrationStatus: t.registrationStatus,
        isMember: active_membership.length > 0,
      };
    }),
  );

  if (pills) {
    if (pills.includes(PILL_TYPE_ENUM.NOT_PAID)) {
      res = res.filter(
        r =>
          r.status === INVOICE_STATUS_ENUM.OPEN &&
          r.registrationStatus === STATUS_ENUM.ACCEPTED,
      );
    }
    if (pills.includes(PILL_TYPE_ENUM.NOT_MEMBER)) {
      res = res.filter(
        r =>
          !r.isMember &&
          r.registrationStatus === STATUS_ENUM.ACCEPTED,
      );
    }
  }

  res.sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  });

  res.sort((a, b) => {
    if (
      a.registrationStatus === STATUS_ENUM.REFUSED ||
      (a.registrationStatus === STATUS_ENUM.PENDING &&
        b.registrationStatus !== STATUS_ENUM.REFUSED)
    ) {
      return 1;
    }
    if (
      b.registrationStatus === STATUS_ENUM.REFUSED ||
      (b.registrationStatus === STATUS_ENUM.PENDING &&
        a.registrationStatus !== STATUS_ENUM.REFUSED)
    ) {
      return -1;
    }
    return 0;
  });
  return res;

}

const getRoster = async (rosterId, withSub, creatorId = '') => {
  const roster = await getRosterByIdAndSub(rosterId, withSub);

  const status = TAG_TYPE_ENUM.REGISTERED;

  const playerIds = roster.map(p => p.person_id);

  let memberships = [];

  if (creatorId) {
    memberships = await getMembershipByPersonIds(playerIds, creatorId)
  }

  const date = new Date();

  const activeMemberships = memberships.filter(
    m =>
      moment(m.created_at).isSameOrBefore(moment(date), 'day') &&
      moment(m.expiration_date).isSameOrAfter(moment(date), 'day'),
  );

  const props = roster.map(player => ({
    id: player.id,
    name: player.name,
    photoUrl: player.photo_url,
    personId: player.person_id,
    role: player.role,
    isSub: player.is_sub,
    status: status,
    paymentStatus: player.payment_status,
    invoiceItemId: player.invoice_item_id,
    isMember: activeMemberships.filter(m => m.person_id === player.person_id)
      .length > 0,
  }));

  return props;
}

async function getTeamCaptains(teamId, userId) {
  const caps = await getTeamCaptainsById(teamId);

  const captainIds = caps.map(c => c.entity_id_admin);

  const captains = await Promise.all(
    captainIds.map(async id => {
      return (await getEntity(id, userId)).basicInfos;
    }),
  );
  return captains;
}

const getRoleRoster = async (rosterId, userId) => {
  if (userId === -1) {
    return ROSTER_ROLE_ENUM.VIEWER;
  }
  const role = await getRoleRosterByIdAndUserId(rosterId, userId);
  if (role) {
    return role;
  } else {
    return ROSTER_ROLE_ENUM.VIEWER;
  }
}

export const getTeamsAcceptedInfos = async (eventId, userId) => {
  const order = [ROSTER_ROLE_ENUM.COACH, ROSTER_ROLE_ENUM.CAPTAIN, ROSTER_ROLE_ENUM.ASSISTANT_CAPTAIN, ROSTER_ROLE_ENUM.PLAYER];
  const teams = await eventQueries.getTeamsAcceptedInfos(eventId, userId, true);

  const res = await Promise.all(
    teams.map(async t => {
      const role = t.rosterPlayers.length > 0 ? t.rosterPlayers.sort(function (a, b) {
        return order.indexOf(a.role) - order.indexOf(b.role)
      })[0].role : ROSTER_ROLE_ENUM.VIEWER;

      const players = t.rosterPlayersInfos.map(player => ({
        id: player.id,
        name: player.name,
        photoUrl: player.photo_url,
        personId: player.person_id,
        role: player.role,
        isSub: player.is_sub,
        status: TAG_TYPE_ENUM.REGISTERED,
        paymentStatus: player.payment_status,
        invoiceItemId: player.invoice_item_id,
        isMember: player.memberships.find(m => m.organization_id == t.eventsInfos.creatorId)?.filter(
          m =>
            moment(m.created_at).isSameOrBefore(moment(date), 'day') &&
            moment(m.expiration_date).isSameOrAfter(moment(date), 'day'),
        )?.filter(m => m.person_id === player.person_id)
          .length > 0,
      }));

      const option = t.eventPaymentOptions ? {
        teamStripePriceId: t.eventPaymentOptions.team_stripe_price_id,
        eventId: t.eventPaymentOptions.event_id,
        name: t.eventPaymentOptions.name,
        teamPrice: t.eventPaymentOptions.team_price,
        startTime: t.eventPaymentOptions.start_time,
        endTime: t.eventPaymentOptions.end_time,
        individualPrice: t.eventPaymentOptions.individual_price,
        individualStripePriceId: t.eventPaymentOptions.individual_stripe_price_id,
        id: t.eventPaymentOptions.id,
        teamActivity: t.eventPaymentOptions.team_activity,
        teamAcceptation: t.eventPaymentOptions.team_acceptation,
        playerAcceptation: t.eventPaymentOptions.player_acceptation,
        informations: t.eventPaymentOptions.informations,
      } : null;

      return {
        name: t.entitiesGeneralInfos.name,
        surname: t.entitiesGeneralInfos.surname,
        photoUrl: t.entitiesGeneralInfos.photo_url,
        rosterId: t.roster_id,
        teamId: t.team_id,
        invoiceItemId: t.invoice_item_id,
        informations: t.informations,
        status: t.status,
        emails: t.entitiesRole.userEntityRole.userEmail,
        players,
        option,
        role: role,
        registrationStatus: t.registration_status
      };
    }),
  );

  res.sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  });

  return res;
}


export const getAllTeamsWithAdmins = async ({
  limit,
  page,
  query,
}) => {
  return queries.getAllTeamsWithAdmins(
    Number(limit),
    Number(page),
    query,
  );
};

export const deleteTeam = async (id, restore = 'false') => {
  if (restore === 'false') {
    return queries.deleteTeamById(id);
  }

  return queries.restoreTeamById(id);
};

export const addPlayersToTeam = async (teamId, players, userId) => {
  if (
    !(await isAllowed(teamId, userId, ENTITIES_ROLE_ENUM.EDITOR))
  ) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }
  return await queries.addPlayersToTeam(teamId, players.map(p => p.id));
};

export {
  getTeamExercises,
  getSessionExercises,
  getTeamsRegisteredInfos,
  getRoster,
  getTeamCaptains,
  getRoleRoster,
}