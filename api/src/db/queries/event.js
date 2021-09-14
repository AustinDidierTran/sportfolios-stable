import knex from '../connection.js';
import { getEntity, getEmailPerson, getPaymentOption } from './entity.js'
import {
  STATUS_ENUM,
} from '../../../../common/enums/index.js';

async function getAllPeopleRegisteredNotInTeams(eventId) {
  const subquery = knex('event_rosters')
    .select('person_id')
    .join('roster_players', 'roster_players.roster_id', '=', 'event_rosters.roster_id')
    .where({
      event_id: eventId,
    });

  const people = await knex('event_persons')
    .select('*')
    .where({
      'event_id': eventId,
    })
    .andWhere(
      'person_id', 'not in', subquery
    );
  return people;
}


async function getAllPeopleRegisteredNotInTeamsInfos(eventId, userId) {
  const people = await getAllPeopleRegisteredNotInTeams(eventId);

  const [event] = await knex('events_infos')
    .select('creator_id')
    .where({
      id: eventId,
    });

  const res = await Promise.all(
    people.map(async p => {
      let invoice = null;
      if (p.invoice_item_id) {
        invoice = await getStripeInvoiceItem(p.invoice_item_id);
      }
      const entity = (await getEntity(p.person_id, userId))
        .basicInfos;
      const email = await getEmailPerson(p.person_id);
      const option = await getPaymentOption(p.payment_option_id);
      const date = new Date();

      const memberships = await knex('memberships_infos')
        .select('*')
        .where({
          person_id: p.person_id,
          organization_id: event.creator_id,
        });

      const active_membership = memberships.filter(m => {
        return (
          moment(m.created_at).isSameOrBefore(moment(date), 'day') &&
          moment(m.expiration_date).isSameOrAfter(moment(date), 'day')
        );
      });

      return {
        personId: p.person_id,
        name: entity.name,
        surname: entity.surname,
        completeName: `${entity.name} ${entity.surname}`,
        photoUrl: entity.photoUrl,
        invoiceItemId: p.invoice_item_id,
        status: p.status,
        registeredOn: p.created_at,
        informations: p.informations,
        invoice,
        email,
        option,
        registrationStatus: p.registration_status,
        isMember: active_membership.length > 0,
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


async function getEventPaymentOption(stripePriceId) {
  let [option] = await knex('event_payment_options')
    .select('*')
    .where({ team_stripe_price_id: stripePriceId });
  if (option) {
    return option;
  }

  [option] = await knex('event_payment_options')
    .select('*')
    .where({ individual_stripe_price_id: stripePriceId });
  return option;
}


export {
  getEventPaymentOption,
  getAllPeopleRegisteredNotInTeamsInfos,
};
