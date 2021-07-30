const knex = require('../connection');
const { getPrimaryPerson, getEntity } = require('./entity');
const { getEventPaymentOption } = require('./event');
const { getTaxRates } = require('./shop');
const { getPaymentStatus } = require('./stripe/utils');
const { getEmailUser } = require('./users');
const moment = require('moment');

async function generateSalesReport(report) {
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
        transactionFees: a.transaction_fees,
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
}

const getPriceFromMembershipId = async membershipId => {
  const [{ price }] = await knex('entity_memberships')
    .select('price')
    .where({ id: membershipId });
  return price;
};

async function generateMembersReport(report) {
  const { date } = report.metadata;
  const members = await knex('memberships_infos')
    .select('*')
    .where({ organization_id: report.entity_id });
  const active = members.filter(m => {
    return (
      moment(m.created_at).isSameOrBefore(moment(date), 'day') &&
      moment(m.expiration_date).isSameOrAfter(moment(date), 'day')
    );
  });

  const reduce = active.reduce((prev, curr) => {
    let addCurr = true;
    const filter = prev.filter(p => {
      if (
        p.member_type === curr.member_type &&
        p.person_id === curr.person_id
      ) {
        if (
          moment(p.expiration_date) > moment(curr.expiration_date)
        ) {
          addCurr = false;
          return true;
        } else {
          return false;
        }
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
}

module.exports = {
  generateSalesReport,
  generateMembersReport,
};
