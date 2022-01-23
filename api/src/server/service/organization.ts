import {
  CART_ITEM,
  ENTITIES_ROLE_ENUM,
  GLOBAL_ENUM,
  MEMBERSHIP_TYPE_ENUM,
  REPORT_TYPE_ENUM,
} from '../../../../common/enums/index.js';

import { ERROR_ENUM } from '../../../../common/errors/index.js';
import { getEntity } from '../../db/queries/entity-deprecate.js';
import * as queries from '../../db/queries/organization.js';

import * as shopQueries from '../../db/queries/shop.js';
import * as userQueries from '../../db/queries/user.js';
import {
  MemberReportData,
  ReportInfo,
  ReportResponse,
  Sale,
  SaleMetadata,
  SaleReportData,
} from '../../typescript/report.js';
import { TaxRate, TaxRatesMap } from '../../typescript/stripe.js';
import { UserInfo, UserInfoMap } from '../../typescript/user.js';

import { isAllowed } from './entity-deprecate.js';
import { getEventPaymentOption } from '../../db/queries/event.js';
import moment from 'moment';
import {
  formatAddress,
  formatPrice,
} from '../../../../common/utils/stringFormat.js';
import { Person } from '../../typescript/entity.js';

export const getOwnedEvents = (organizationId: string): any => {
  return queries.getOwnedEvents(organizationId);
};

export const generateReport = (reportId: string /** userId: string */): any => {
  // If no version if specified
  return queries.generateReport(reportId);
};

interface SaleReportInfo {
  id: string;
  sellerEntityId: string;
  quantity: number;
  unitAmount: number;
  amount: number;
  status: string;
  stripePriceId: string;
  buyerUserId: string;
  invoiceItemId: string;
  metadata: string;
  createdAt: Date;
  receiptId: string;
  transactionFees: number;
  type: string;
  name: string;
  surname: string;
  email: string;
  total: number;
  subtotal: number;
  totalTax: number;
  platformFees: number;
  totalNet: number;
}

export const getReports = async (entityId: string) => {
  const reports = await queries.getReports(entityId);

  return reports;
};

export const getMembershipName = (type: number): string => {
  if (type === MEMBERSHIP_TYPE_ENUM.RECREATIONAL) {
    return 'recreational_member';
  } else if (type === MEMBERSHIP_TYPE_ENUM.COMPETITIVE) {
    return 'competitive_member';
  } else if (type === MEMBERSHIP_TYPE_ENUM.ELITE) {
    return 'elite_member';
  } else if (type === MEMBERSHIP_TYPE_ENUM.JUNIOR) {
    return 'junior_member';
  } else {
    return '';
  }
};

const getProductDetail = async (metadata: SaleMetadata) => {
  switch (`${metadata.type}`) {
    case CART_ITEM.MEMBERSHIP:
      return getMembershipName(metadata.membership_type);
    case CART_ITEM.SHOP_ITEM:
      return '';
    case `${GLOBAL_ENUM.EVENT}`:
      const event = await getEntity(metadata.eventId);

      if (!event) {
        console.log(`event not found with id ${metadata.eventId}`);
      }

      return event.basicInfos.name;
    default:
      return '';
  }
};

export const generateReportV2 = async (
  reportId: string,
  userId: string,
): Promise<ReportResponse> => {
  // Get Organization Id for report
  const reportInfo: ReportInfo = await queries.getReportInfo(reportId);

  // See if user is authorized for report
  if (
    !(await isAllowed(
      reportInfo.organizationId,
      userId,
      ENTITIES_ROLE_ENUM.EDITOR,
    ))
  ) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }

  // Generate report based on type
  if (reportInfo.type === REPORT_TYPE_ENUM.SALES) {
    /** Update Active Sales Payout */
    // await stripePayoutQueries.updatePayouts();

    /** Get Active Sales */
    const activeSales: Sale[] = await queries.getActiveSales(
      reportInfo.organizationId,
    );

    /** Get relevant emails */
    const relevantUserInfos = await userQueries.getUserInfosById(
      activeSales.map(sale => sale.buyerUserId),
    );

    const relevantUserInfosMap = relevantUserInfos.reduce(
      (prev: UserInfoMap, curr: UserInfo) => ({
        ...prev,
        [curr.userId]: curr,
      }),
      {},
    );

    /** Get all tax rates */
    const taxRates: TaxRate[] = await shopQueries.getTaxRates(
      activeSales.map(sale => sale.stripePriceId),
    );

    const taxRatesMap: TaxRatesMap = taxRates.reduce(
      (prev: TaxRatesMap, curr: TaxRate) => ({
        ...prev,
        [curr.stripePriceId]: prev[curr.stripePriceId]
          ? [...prev[curr.stripePriceId], curr]
          : [curr],
      }),
      {},
    );

    // Add stripe deposit moment

    const data = await Promise.all(
      activeSales.map(
        async (sale: Sale): Promise<SaleReportData> => {
          const subtotal = sale.amount;

          const totalTax: number =
            taxRatesMap[sale.stripePriceId]?.reduce(
              (prev: number, curr: TaxRate) =>
                prev + Math.floor((curr.percentage / 100) * subtotal),
              0,
            ) || 0;

          const total: number = subtotal + totalTax;

          const platformFees = sale.transactionFees * sale.quantity;

          const totalNet = total - platformFees;

          if (sale.metadata.type === CART_ITEM.MEMBERSHIP) {
            return {
              type: { valueKey: 'reports.types.membership' },
              detail: {
                valueKey: getMembershipName(sale.metadata.membership_type),
              },
              registrationFor: {
                value: `${sale.metadata?.person?.name} ${sale.metadata?.person?.surname}`,
              },
              transactionType: { valueKey: 'reports.transaction_type.payment' },
              status: {},
              email: { value: relevantUserInfosMap[sale.buyerUserId].email },
              madeOn: {
                value: moment(sale.createdAt).format('YYYY-MM-DD HH:mm'),
              },
              quantity: { value: sale.quantity.toString() },
              subtotal: { value: formatPrice(subtotal) },
              totalTax: { value: formatPrice(totalTax) },
              total: { value: formatPrice(total) },
              platformFees: { value: formatPrice(platformFees) },
              totalNet: {
                value: formatPrice(totalNet),
              },
              buyerUserId: { value: sale.buyerUserId },
              id: { value: sale.id },
              unitPrice: { value: formatPrice(sale.unitAmount) },
            };
          }

          if (sale.metadata.type === CART_ITEM.DONATION) {
            return {
              type: { valueKey: 'reports.types.donation' },
              detail: { value: '' },
              registrationFor: { value: '' },
              transactionType: { valueKey: 'reports.transaction_type.payment' },
              status: {},
              email: { value: relevantUserInfosMap[sale.buyerUserId].email },
              madeOn: {
                value: moment(sale.createdAt).format('YYYY-MM-DD HH:mm'),
              },
              quantity: { value: sale.quantity.toString() },
              subtotal: { value: formatPrice(subtotal) },
              totalTax: { value: formatPrice(totalTax) },
              total: { value: formatPrice(total) },
              platformFees: { value: formatPrice(platformFees) },
              totalNet: {
                value: formatPrice(totalNet),
              },
              buyerUserId: { value: sale.buyerUserId },
              id: { value: sale.id },
              unitPrice: { value: formatPrice(sale.unitAmount) },
            };
          }

          if (sale.metadata.type === CART_ITEM.SHOP_ITEM) {
            return {
              type: { valueKey: 'reports.types.shop_item' },
              detail: { value: '' },
              registrationFor: { value: '' },
              transactionType: { valueKey: 'reports.transaction_type.payment' },
              status: {},
              email: { value: relevantUserInfosMap[sale.buyerUserId].email },
              madeOn: {
                value: moment(sale.createdAt).format('YYYY-MM-DD HH:mm'),
              },
              quantity: { value: sale.quantity.toString() },
              subtotal: { value: formatPrice(subtotal) },
              totalTax: { value: formatPrice(totalTax) },
              total: { value: formatPrice(total) },
              platformFees: { value: formatPrice(platformFees) },
              totalNet: {
                value: formatPrice(totalNet),
              },
              buyerUserId: { value: sale.buyerUserId },
              id: { value: sale.id },
              unitPrice: { value: formatPrice(sale.unitAmount) },
            };
          }

          if (`${sale.metadata.type}` === `${GLOBAL_ENUM.EVENT}`) {
            const event = await getEntity(sale.metadata.eventId);
            const person: Person = sale.metadata.personId
              ? await getEntity(sale.metadata.personId)
              : null;

            return {
              type: { valueKey: 'reports.types.event' },
              detail: { value: event.basicInfos.name },
              registrationFor: {
                value: sale.metadata.isIndividualOption
                  ? sale.metadata.name || sale.metadata.person
                    ? `${sale.metadata.person?.name} ${sale.metadata.person?.surname}`
                    : `${person?.basicInfos.name} ${person?.basicInfos.surname}`
                  : sale.metadata.team?.name,
              },
              transactionType: { valueKey: 'reports.transaction_type.payment' },
              status: {},
              email: { value: relevantUserInfosMap[sale.buyerUserId].email },
              madeOn: {
                value: moment(sale.createdAt).format('YYYY-MM-DD HH:mm'),
              },
              quantity: { value: sale.quantity.toString() },
              unitPrice: { value: formatPrice(sale.unitAmount) },
              subtotal: { value: formatPrice(subtotal) },
              totalTax: { value: formatPrice(totalTax) },
              total: { value: formatPrice(total) },
              platformFees: { value: formatPrice(platformFees) },
              totalNet: {
                value: formatPrice(totalNet),
              },
              buyerUserId: { value: sale.buyerUserId },
              id: { value: sale.id },
            };
          }

          console.log('going into error...', sale.metadata.type);

          throw new Error(ERROR_ENUM.ERROR_OCCURED);
        },
      ),
    );
    const headers = [
      { labelKey: 'reports.headers.sales.id', key: 'id' },
      { labelKey: 'reports.headers.sales.type', key: 'type' },
      { labelKey: 'reports.headers.sales.product_detail', key: 'detail' },
      {
        labelKey: 'reports.headers.sales.registration_for',
        key: 'registrationFor',
      },
      {
        labelKey: 'reports.headers.sales.transaction_type',
        key: 'transactionType',
      },
      { labelKey: 'reports.headers.sales.buyers_user_id', key: 'buyerUserId' },
      { labelKey: 'reports.headers.sales.email', key: 'email' },
      { labelKey: 'reports.headers.sales.made_on', key: 'madeOn' },
      { labelKey: 'reports.headers.sales.unit_price', key: 'unitPrice' },
      { labelKey: 'reports.headers.sales.quantity', key: 'quantity' },
      { labelKey: 'reports.headers.sales.subtotal', key: 'subtotal' },
      { labelKey: 'reports.headers.sales.tax_total', key: 'totalTax' },
      { labelKey: 'reports.headers.sales.total', key: 'total' },
      { labelKey: 'reports.headers.sales.plateform_fees', key: 'platformFees' },
      { labelKey: 'reports.headers.sales.total_net', key: 'totalNet' },
    ];

    return { data, headers };
  }

  if (reportInfo.type === REPORT_TYPE_ENUM.MEMBERS) {
    const { date } = reportInfo.metadata;

    const memberships: any[] = await queries.getMemberships(
      reportInfo.organizationId,
    );

    const data: MemberReportData[] = memberships.map(membership => ({
      name: { value: membership.personGeneralInfos.name },
      surname: { value: membership.personGeneralInfos.name },
      membership: { valueKey: getMembershipName(membership.member_type) },
      price: { value: formatPrice(membership.entityMembership.price) },
      status: { valueKey: `reports.payment_status.${membership.status}` },
      paidOn: { value: moment(membership.paid_on).format('YYYY-MM-DD HH:mm') },
      createdAt: {
        value: moment(membership.created_at).format('YYYY-MM-DD HH:mm'),
      },
      expirationDate: {
        value: moment(membership.expiration_date).format('YYYY-MM-DD HH:mm'),
      },
      email: { value: membership.userEntityRole.userEmail.email },
      phoneNumber: { value: membership.personInfos?.phone_number },
      birthDate: { value: membership.personInfos?.birth_date },
      gender: { value: membership.personInfos?.gender },
      address: { value: formatAddress(membership.personInfos?.addresses) },
      emergencyName: { value: membership.personInfos?.emergency_name },
      emergencySurname: { value: membership.personInfos?.emergency_surname },
      emergencyPhoneNumber: {
        value: membership.personInfos?.emergency_phone_number,
      },
      medicalConditions: { value: membership.personInfos?.medical_conditions },
      heardOrganization: { value: membership.heard_organization },
      gettingInvolved: { value: membership.getting_involved },
      frequentedSchool: { value: membership.frequented_school },
      jobTitle: { value: membership.job_title },
      employer: { value: membership.employer },
    }));

    const headers = [
      { labelKey: 'reports.headers.members.name', key: 'name' },
      { labelKey: 'reports.headers.members.surname', key: 'surname' },
      { labelKey: 'reports.headers.members.membership', key: 'membership' },
      { labelKey: 'reports.headers.members.price', key: 'price' },
      { labelKey: 'reports.headers.members.status', key: 'status' },
      { labelKey: 'reports.headers.members.paid_on', key: 'paidOn' },
      { labelKey: 'reports.headers.members.created_at', key: 'createdAt' },
      { labelKey: 'reports.headers.members.expires_at', key: 'expirationDate' },
      { labelKey: 'reports.headers.members.email', key: 'email' },
      { labelKey: 'reports.headers.members.phone_number', key: 'phoneNumber' },
      { labelKey: 'reports.headers.members.birth_date', key: 'birthDate' },
      { labelKey: 'reports.headers.members.gender', key: 'gender' },
      { labelKey: 'reports.headers.members.address', key: 'address' },
      {
        labelKey: 'reports.headers.members.emergency_name',
        key: 'emergencyName',
      },
      {
        labelKey: 'reports.headers.members.emergency_surname',
        key: 'emergencySurname',
      },
      {
        labelKey: 'reports.headers.members.emergency_phone_number',
        key: 'emergencyPhoneNumber',
      },
      {
        labelKey: 'reports.headers.members.medical_conditions',
        key: 'medicalConditions',
      },
      {
        labelKey: 'reports.headers.members.heard_organization',
        key: 'heardOrganization',
      },
      {
        labelKey: 'reports.headers.members.getting_involved',
        key: 'gettingInvolved',
      },
      {
        labelKey: 'reports.headers.members.frequented_school',
        key: 'frequentedSchool',
      },
      { labelKey: 'reports.headers.members.job_title', key: 'jobTitle' },
      { labelKey: 'reports.headers.members.employer', key: 'employer' },
    ];
    return { data, headers };
  }
};

export const getOrganizationMembers = (
  organizationId: string,
  userId: string,
): any => {
  return queries.getOrganizationMembers(organizationId, userId);
};

export const getOrganization = async (
  organizationId: string,
  userId: string,
): Promise<any> => {
  const res = await getEntity(organizationId, userId);

  return {
    basicInfos: res.basicInfos,
  };
};

export const getAllOrganizationsWithAdmins = async ({
  limit,
  page,
  query,
}: {
  limit: string;
  page: string;
  query: string;
}): Promise<any> =>
  queries.getAllOrganizationsWithAdmins(Number(limit), Number(page), query);

export const verifyOrganization = async (
  { id, verify }: { id: string; verify: string },
  userId: string,
): Promise<any> => {
  if (verify === 'false') {
    return queries.verifyOrganization(id, userId, false);
  }

  return queries.verifyOrganization(id, userId);
};

export const deleteOrganization = async (
  id: string,
  restore = 'false',
): Promise<any> => {
  if (restore === 'false') {
    return queries.deleteOrganizationById(id);
  }

  return queries.restoreOrganizationById(id);
};

export const getMembers = async (
  {
    id,
    searchQuery,
  }: {
    id: string;
    searchQuery: string;
  },
  userId: string,
): Promise<any> => {
  if (!(await isAllowed(id, userId, ENTITIES_ROLE_ENUM.EDITOR))) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }

  return queries.getMembers(id, searchQuery);
};
