import {
  ENTITIES_ROLE_ENUM,
  REPORT_TYPE_ENUM,
} from '../../../../common/enums/index.js';
import { ERROR_ENUM } from '../../../../common/errors/index.js';
import { getEntity } from '../../db/queries/entity-deprecate.js';
import * as queries from '../../db/queries/organization.js';

import * as shopQueries from '../../db/queries/shop.js';
import * as userQueries from '../../db/queries/user.js';

import { isAllowed } from './entity-deprecate.js';

export const getOwnedEvents = (organizationId: string): any => {
  return queries.getOwnedEvents(organizationId);
};

export const generateReport = (reportId: string /** userId: string */): any => {
  // If no version if specified
  return queries.generateReport(reportId);
};

interface ReportInfo {
  organizationId: string;
  type: string;
  metadata: any;
}

interface StripePayout {
  id: string;
  createdAt: Date;
}

interface Sale {
  amount: number;
  buyerUserId: string;
  createdAt: Date;
  id: string;
  invoiceItemId: string;
  metadata: any;
  payout?: StripePayout;
  quantity: number;
  receiptId: string;
  sellerEntityId: string;
  status: string;
  stripePriceId: string;
  transactionFees: number;
  unitAmount: number;
}

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
  name: string;
  surname: string;
  email: string;
  total: number;
  subtotal: number;
  totalTax: number;
  platformFees: number;
  totalNet: number;
}

interface UserInfo {
  primaryPerson: {
    id: string;
    name: string;
    surname: string;
  };
  email: string;
  userId: string;
}

interface UserInfoMap {
  [primaryPersonId: string]: UserInfo;
}

interface TaxRate {
  active: boolean;
  description: string;
  displayName: string;
  id: string;
  inclusive: boolean;
  percentage: number;
  stripePriceId: string;
}

interface Entity {
  basicInfos: {
    description: string;
    id: string;
    city: string;
    type: string;
    name: string;
    verifiedAt: Date;
    quickDescription?: string;
    surname: string;
    photoUrl: string;
    role: number;
    numberOfMembers: number;
  };
}

interface EntityMap {
  [id: string]: Entity;
}

interface TaxRatesMap {
  [stripePriceId: string]: TaxRate[];
}

export const generateReportV2 = async (
  reportId: string,
  userId: string,
): Promise<SaleReportInfo[]> => {
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

    return activeSales.map(sale => {
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

      return {
        id: sale.id,
        sellerEntityId: sale.sellerEntityId,
        quantity: sale.quantity,
        unitAmount: sale.unitAmount,
        amount: sale.amount,
        status: sale.status,
        stripePriceId: sale.stripePriceId,
        buyerUserId: sale.buyerUserId,
        invoiceItemId: sale.invoiceItemId,
        metadata: sale.metadata,
        createdAt: sale.createdAt,
        receiptId: sale.receiptId,
        transactionFees: sale.transactionFees * sale.quantity,
        name: relevantUserInfosMap[sale.buyerUserId].primaryPerson.name,
        surname: relevantUserInfosMap[sale.buyerUserId].primaryPerson.surname,
        email: relevantUserInfosMap[sale.buyerUserId].email,
        total,
        subtotal,
        totalTax,
        platformFees,
        totalNet,
      };
    });
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
