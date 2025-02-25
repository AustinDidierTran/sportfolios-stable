import knex from '../connection.js';
import { getPrimaryPerson, getEntity } from './entity-deprecate.js';
import { getEventPaymentOption } from './event.js';
import { getTaxRates } from './shop.js';
import { getPaymentStatus } from './stripe/utils.js';
import { getEmailUser } from './user.js';
import moment from 'moment';
import { isAllowed } from './utils.js';
import {
  CARD_TYPE_ENUM,
  GLOBAL_ENUM,
  ENTITIES_ROLE_ENUM,
  INVOICE_STATUS_ENUM,
  REPORT_TYPE_ENUM,
  TRANSACTION_TYPE_ENUM,
} from '../../../../common/enums/index.js';
import { ERROR_ENUM } from '../../../../common/errors/index.js';
import { memberships } from '../models/memberships';

// [Refactoring] This should go into the generate report
export const getPersonInfos = async entityId => {
  const [res] = await knex('person_all_infos')
    .select('*')
    .where({ id: entityId });

  let resObj = {
    photoUrl: res.photo_url,
    name: res.name,
    surname: res.surname,
    birthDate: res.birth_date,
    gender: res.gender,
    phoneNumber: res.phone_number,
    formattedAddress: res.address,
    emergencyName: res.emergency_name,
    emergencySurname: res.emergency_surname,
    emergencyPhoneNumber: res.emergency_phone_number,
    medicalConditions: res.medical_conditions,
  };

  const [fullAddress] = await knex('addresses')
    .select('*')
    .where({ id: res.address_id });

  if (fullAddress) {
    resObj.address = {
      street_address: fullAddress.street_address,
      city: fullAddress.city,
      state: fullAddress.state,
      zip: fullAddress.zip,
      country: fullAddress.country,
    };
  }

  return resObj;
};

// [Refactoring] This should go into the generate report
export const getEmailPerson = async person_id => {
  const [{ email }] = await knex('user_entity_role')
    .select('email')
    .leftJoin(
      'user_email',
      'user_email.user_id',
      '=',
      'user_entity_role.user_id',
    )
    .where('user_entity_role.entity_id', person_id);
  if (!email) {
    return getEmailsEntity(person_id);
  }
  return email;
};

export const generateReport = async reportId => {
  const [report] = await knex('reports')
    .select('*')
    .where({ report_id: reportId });

  const ReportMap = {
    [REPORT_TYPE_ENUM.MEMBERS]: generateMembersReport,
    [REPORT_TYPE_ENUM.SALES]: generateSalesReport,
  };
  const getReport = ReportMap[report.type];

  return getReport(report);
};

export const getReportInfo = async reportId => {
  const [report] = await knex('reports')
    .select('entity_id', 'metadata', 'type')
    .where({ report_id: reportId });

  return {
    metadata: report.metadata,
    organizationId: report.entity_id,
    type: report.type,
  };
};

export const getOwnedEvents = async organizationId => {
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
};

export const getActiveRefunds = async entityId => {
  const organizations = Array.isArray(entityId) ? entityId : [entityId];

  const refunds = await knex('stripe_refund')
    .select(
      'stripe_refund.amount as refund_amount',
      'stripe_refund.refund_id',
      'stripe_refund.invoice_item_id',
      'stripe_refund.created_at',
      'store_items_paid.quantity',
      'store_items_paid.unit_amount',
      'store_items_paid.amount',
      'store_items_paid.stripe_price_id',
      'store_items_paid.buyer_user_id',
      'store_items_paid.metadata',
      'store_items_paid.receipt_id',
      'store_items_paid.transaction_fees',
      'store_items_paid.seller_entity_id',
    )
    .leftJoin(
      'store_items_paid',
      'stripe_refund.invoice_item_id',
      '=',
      'store_items_paid.invoice_item_id',
    )
    .whereIn('store_items_paid.seller_entity_id', organizations);

  return refunds.map(refund => ({
    refundAmount: refund.refund_amount,
    refundId: refund.refund_id,
    invoiceItemId: refund.invoice_item_id,
    createdAt: refund.created_at,
    quantity: refund.quantity,
    unitAmount: refund.unit_amount,
    amount: refund.amount,
    stripePriceId: refund.stripe_price_id,
    buyerUserId: refund.buyer_user_id,
    metadata: refund.metadata,
    receiptId: refund.receipt_id,
    sellerEntityId: refund.seller_entity_id,
    status: INVOICE_STATUS_ENUM.REFUNDED,
    transactionType: TRANSACTION_TYPE_ENUM.REFUND,
    transactionFees: refund.transaction_fees,
  }));
};

export const getActiveSales = async (entityId /* date */) => {
  const sales = await knex('store_items_paid')
    .select('*')
    .where({ seller_entity_id: entityId });

  return sales.map(sale => ({
    amount: sale.amount,
    id: sale.id,
    buyerUserId: sale.buyer_user_id,
    createdAt: sale.created_at,
    invoiceItemId: sale.invoice_item_id,
    metadata: sale.metadata,
    quantity: sale.quantity,
    receiptId: sale.receipt_id,
    sellerEntityId: sale.seller_entity_id,
    status: INVOICE_STATUS_ENUM.PAID,
    stripePriceId: sale.stripe_price_id,
    transactionFees: sale.transaction_fees,
    unitAmount: sale.unit_amount,
  }));
};

export const generateSalesReport = async report => {
  const { date } = report.metadata;
  const sales = await knex('store_items_paid')
    .select('*')
    .where({ seller_entity_id: report.entity_id });
  const active = sales.filter(
    s =>
      moment(s.created_at)
        .set('hour', 0)
        .set('minute', 0)
        .set('second', 0) <
      moment(date)
        .set('hour', 0)
        .set('minute', 0)
        .set('second', 0)
        .add(1, 'day'),
  );

  const res = await Promise.all(
    active.map(async a => {
      const person = await getPrimaryPerson(a.buyer_user_id);
      const email = await getEmailUser(a.buyer_user_id);
      const taxes = await getTaxRates(a.stripe_price_id);
      const subtotal = a.amount;
      const totalTax = taxes.reduce((prev, curr) => {
        return prev + (curr.percentage / 100) * a.amount;
      }, 0);
      const total = subtotal + totalTax;
      const plateformFees = a.transaction_fees;
      const totalNet = total - plateformFees;

      if (a.metadata.type === GLOBAL_ENUM.EVENT) {
        const event = await getEntity(a.metadata.id);
        const option = await getEventPaymentOption(a.stripe_price_id);
        a.metadata.event = event;
        a.metadata.option = option;
      }

      let status = INVOICE_STATUS_ENUM.FREE;
      if (a.invoice_item_id) {
        status = await getPaymentStatus(a.invoice_item_id);
      }

      return {
        id: a.id,
        sellerEntityId: a.seller_entity_id,
        quantity: a.quantity,
        unitAmount: a.unit_amount,
        amount: a.amount,
        status: status,
        stripePriceId: a.stripe_price_id,
        buyerUserId: a.buyer_user_id,
        invoiceItemId: a.invoice_item_id,
        metadata: a.metadata,
        createdAt: a.created_at,
        receiptId: a.receipt_id,
        transactionFees: a.transaction_fees * a.quantity,
        name: person.name,
        surname: person.surname,
        email,
        total,
        subtotal,
        totalTax,
        plateformFees,
        totalNet,
      };
    }),
  );
  return res;
};

export const getOrganizationMembers = async (organizationId, userId) => {
  if (!(await isAllowed(organizationId, userId, ENTITIES_ROLE_ENUM.EDITOR))) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }
  const members = await knex('memberships')
    .select('*')
    .rightJoin('entities', 'entities.id', '=', 'memberships.person_id')
    .whereNull('deleted_at')
    .andWhere('entities.type', '=', GLOBAL_ENUM.PERSON)
    .andWhere({ organization_id: organizationId });
  const reduce = members.reduce((prev, curr) => {
    let addCurr = true;
    const filter = prev.filter(p => {
      if (p.member_type != curr.member_type || p.person_id != curr.person_id) {
        return true;
      } else {
        if (moment(p.expiration_date) > moment(curr.expiration_date)) {
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
};

const getPriceFromMembershipId = async membershipId => {
  const [{ price }] = await knex('entity_memberships')
    .select('price')
    .where({ id: membershipId });
  return price;
};

export const getMemberships = async (organizationId /** options = {} */) => {
  // const { minDate, maxDate } = options;

  const fetchedMemberships = await memberships
    .query()
    .withGraphJoined(
      '[personInfos.addresses, personGeneralInfos, entityMembership, userEntityRole.userEmail]',
    )
    .where('organization_id', organizationId);

  return fetchedMemberships;
};

export const generateMembersReport = async report => {
  const { date } = report.metadata;
  const members = await knex('memberships_infos')
    .select('*')
    .where({ organization_id: report.entity_id });
  const active = members.filter(
    m =>
      moment(m.created_at).isSameOrBefore(moment(date), 'day') &&
      moment(m.expiration_date).isSameOrAfter(moment(date), 'day'),
  );

  const reduce = active.reduce((prev, curr) => {
    let addCurr = true;
    const filter = prev.filter(p => {
      if (
        p.member_type === curr.member_type &&
        p.person_id === curr.person_id
      ) {
        if (moment(p.expiration_date) > moment(curr.expiration_date)) {
          addCurr = false;
          return true;
        }
        return false;
      }
      return true;
    });
    if (addCurr) {
      return [...filter, curr];
    }
    return filter;
  }, []);
  const res = await Promise.all(
    reduce.map(async a => {
      //ICI
      const person = await getPersonInfos(a.person_id);
      const email = await getEmailPerson(a.person_id);
      const price = await getPriceFromMembershipId(a.membership_id);
      return {
        id: a.id,
        organizationId: a.organization_id,
        personId: a.person_id,
        memberType: a.member_type,
        expirationDate: a.expiration_date,
        createdAt: a.created_at,
        status: a.status,
        invoiceItemId: a.invoice_item_id,
        paidOn: a.paid_on,
        membershipId: a.membership_id,
        gender: a.gender,
        address: a.address,
        birthDate: a.birth_date,
        phoneNumber: a.phone_number,
        heardOrganization: a.heard_organization,
        frequentedSchool: a.frequented_school,
        jobTitle: a.job_title,
        gettingInvolved: a.getting_involved,
        emergencyName: a.emergency_name,
        emergencySurname: a.emergency_surname,
        emergencyPhoneNumber: a.emergency_phone_number,
        medicalConditions: a.medical_onditions,
        name: person.name,
        surname: person.surname,
        price,
        email,
      };
    }),
  );
  return res;
};

export const getAllOrganizationsWithAdmins = async (
  limit = 10,
  page = 1,
  query = '',
) => {
  const organizations = await knex
    .select(
      'entities.id',
      'entities_general_infos.name',
      'entities_general_infos.photo_url',
      'entities.deleted_at',
      'entities.verified_at',
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
    .leftJoin('entities', 'entities.id', '=', 'entity_admins.entity_id')
    .leftJoin(
      'entities_general_infos',
      'entities_general_infos.entity_id',
      '=',
      'entities.id',
    )
    .where('entities.type', GLOBAL_ENUM.ORGANIZATION)
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
    .where('type', GLOBAL_ENUM.ORGANIZATION);

  return {
    count: Number(count),
    organizations: organizations.map(r => ({
      id: r.id,
      name: r.name,
      photoUrl: r.photo_url,
      deletedAt: r.deleted_at,
      verifiedAt: r.verified_at,
      admins: r.entity_admins.map(admin => ({
        id: admin.entity_id_admin,
        name: admin.name,
        surname: admin.surname,
        photoUrl: admin.photo_url,
      })),
    })),
  };
};

export const restoreOrganizationById = id => {
  return knex('entities')
    .update('deleted_at', null)
    .where({ id });
};

export const deleteOrganizationById = id => {
  return knex('entities')
    .del()
    .where({ id });
};

export const verifyOrganization = async (id, userId, setVerified = true) => {
  if (setVerified) {
    await knex('entities')
      .update({ verified_at: 'now', verified_by: userId })
      .where({ id });

    return true;
  }

  await knex('entities')
    .update({ verified_at: null, verified_by: null })
    .where({ id });

  return false;
};

/**
 * [SPO-86] Optimize this query
 * [] Make it all inside one call
 * [] Make the filter inside the postgresql query
 */
export const getMembers = async (organizationId, searchQuery) => {
  const members = await knex('memberships')
    .select('*')
    .rightJoin('entities', 'entities.id', '=', 'memberships.person_id')
    .whereNull('deleted_at')
    .andWhere('entities.type', '=', GLOBAL_ENUM.PERSON)
    .andWhere({ organization_id: organizationId });
  const reduce = members.reduce((prev, curr) => {
    let addCurr = true;
    const filter = prev.filter(p => {
      if (p.member_type != curr.member_type || p.person_id != curr.person_id) {
        return true;
      } else {
        if (moment(p.expiration_date) > moment(curr.expiration_date)) {
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

  return res.filter(m =>
    `${m.person.name} ${m.person.surname}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );
};

export const getReports = async entityId => {
  const reports = await knex('reports')
    .select('*')
    .where({ entity_id: entityId });

  const sorted = reports.sort((a, b) => {
    return moment(b.created_at) - moment(a.created_at);
  });

  return sorted.map(report => ({
    reportId: report.report_id,
    entityId: report.entity_id,
    type: report.type,
    metadata: report.metadata,
    createdAt: report.created_at,
    updatedAt: report.updated_at,
  }));
};
