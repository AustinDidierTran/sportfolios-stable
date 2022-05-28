import { ENTITIES_ROLE_ENUM, REPORT_TYPE_ENUM } from '../../../../common/enums';
import { ERROR_ENUM } from '../../../../common/errors';

import * as queries from '../../db/queries/report';
import * as organizationQueries from '../../db/queries/organization';
import * as shopQueries from '../../db/queries/shop';
import * as userQueries from '../../db/queries/user';
import * as customerQueries from '../../db/queries/stripe/customer';
import * as stripeQueries from '../utils/stripeQueries';
import { isAllowed } from '../../db/queries/utils';
import {
  STRIPE_REPORT_TYPES,
  TaxRate,
  TaxRatesMap,
} from '../../typescript/stripe';
import i18n from '../../i18n.config.js';
import {
  MemberReportData,
  RefundQueryData,
  Sale,
  SaleReportData,
} from '../../typescript/report';
import { UserInfo, UserInfoMap } from '../../typescript/user';
import moment from 'moment';
import { formatRefunds, formatSales } from '../helper/reportHelpers';
import { getMembershipName } from './organization';
import {
  formatAddress,
  formatPrice,
} from '../../../../common/utils/stringFormat';

export const createReport = async (
  {
    type,
    organizationId,
    date,
  }: { type: string; organizationId: string; date: string },
  userId: string,
): Promise<any> => {
  if (!(await isAllowed(organizationId, userId, ENTITIES_ROLE_ENUM.EDITOR))) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }
  const reportData: {
    type: string;
    entity_id: string;
    metadata: {
      date?: string;
      report_run_id?: string;
    };
  } = {
    type,
    // eslint-disable-next-line
    entity_id: organizationId,
    metadata: { date },
  };
  if (type === REPORT_TYPE_ENUM.PAYOUTS) {
    const bankAccounts = await customerQueries.getBankAccounts(organizationId);

    const [bankAccount] = bankAccounts;

    const accountId = bankAccount.account_id;

    const reportRunId = await stripeQueries.createReportRun(
      accountId,
      STRIPE_REPORT_TYPES.PAYOUT_RECONCILIATION,
      [
        'automatic_payout_id',
        'automatic_payout_effective_at',
        'balance_transaction_id',
        'created',
        'available_on',
        'currency',
        'gross',
        'fee',
        'net',
        'reporting_category',
        'description',
        'charge_id',
        'charge_created',
        'invoice_id',
        'payment_method_type',
      ],
    );

    // eslint-disable-next-line
    reportData.metadata.report_run_id = reportRunId;
  }

  const report = await queries.createReport(reportData);

  return report;
};

const generateMembersReport = async (
  reportInfo: any,
): Promise<ReportInformation> => {
  // const { date } = reportInfo.metadata;

  const memberships: any[] = await organizationQueries.getMemberships(
    reportInfo.entity_id,
  );

  const data: MemberReportData[] = memberships.map(membership => ({
    name: { value: membership.personGeneralInfos.name },
    surname: { value: membership.personGeneralInfos.surname },
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
    email: {
      value: membership.userEntityRole.userEmail
        .map((ue: any) => ue.email)
        .join(', '),
    },
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

  const fileName = i18n.__(
    { phrase: 'reports.members', locale: 'en' },
    reportInfo.metadata.date,
  );

  return { data, headers, fileName };
};

const generatePayoutsReport = async (
  reportInfo: any,
  stripeAccount: string,
): Promise<ReportInformation> => {
  const fileName = i18n.__(
    { phrase: 'reports.payouts', locale: 'en' },
    reportInfo.metadata.date,
  );

  const [headers, ...data] = await stripeQueries.getReportRun(
    reportInfo.metadata.report_run_id,
    stripeAccount,
  );

  const returnedValue = {
    headers: headers.map((d: string) => ({
      key: d,
      labelKey: `reports.headers.payouts.${d}`,
    })),
    data: data.map((d: any) =>
      d.reduce(
        (prev: any, curr: string, index: number) => ({
          ...prev,
          [headers[index]]: { value: curr },
        }),
        {},
      ),
    ),
    fileName,
  };

  return returnedValue;
};

const generateSalesReport = async (
  reportInfo: any,
): Promise<ReportInformation> => {
  // Generate report based on type
  /** Update Active Sales Payout */
  // await stripePayoutQueries.updatePayouts();

  /** Get Active Sales */
  const activeSales: Sale[] = await queries.getActiveSales(
    reportInfo.entity_id,
  );

  /** Get Active Refunds */
  const activeRefunds: RefundQueryData[] = await organizationQueries.getActiveRefunds(
    reportInfo.entity_id,
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
  const formattedSales: SaleReportData[] = await formatSales(
    activeSales,
    taxRatesMap,
    relevantUserInfosMap,
  );

  const formattedRefunds: SaleReportData[] = await formatRefunds(
    activeRefunds,
    formattedSales,
  );

  const data = [...formattedSales, ...formattedRefunds].sort((a, b) =>
    moment(a.createdAt).isBefore(b.createdAt) ? 1 : -1,
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

  const fileName = i18n.__(
    { phrase: 'reports.sales', locale: 'en' },
    reportInfo.metadata.date,
  );

  return { data, headers, fileName };
};

type ReportHeader = {
  labelKey: string;
  key: string;
};

type ReportInformation = {
  data: any[];
  headers: ReportHeader[];
  fileName: string;
};

export const getReport = async (
  reportId: string,
  userId: string,
  // ): Promise<ReportResponse> => {
): Promise<ReportInformation> => {
  // Get Organization Id for report
  const reportInfo: any = await queries.getReport(reportId);

  const bankAccounts = await customerQueries.getBankAccounts(
    reportInfo.entity_id,
  );

  const [bankAccount] = bankAccounts;

  const stripeAccount = bankAccount.account_id;

  // See if user is authorized for report
  if (
    !(await isAllowed(reportInfo.entity_id, userId, ENTITIES_ROLE_ENUM.EDITOR))
  ) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }

  if (reportInfo.type === REPORT_TYPE_ENUM.MEMBERS) {
    return generateMembersReport(reportInfo);
  }

  if (reportInfo.type === REPORT_TYPE_ENUM.PAYOUTS) {
    return generatePayoutsReport(reportInfo, stripeAccount);
  }

  if (reportInfo.type === REPORT_TYPE_ENUM.SALES) {
    return generateSalesReport(reportInfo);
  }

  throw new Error(ERROR_ENUM.ERROR_OCCURED);
};
