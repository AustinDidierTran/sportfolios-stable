import { String } from 'aws-sdk/clients/batch';
import {
  ENTITIES_ROLE_ENUM,
  REPORT_TYPE_ENUM,
} from '../../../../common/enums/index.js';
import { ERROR_ENUM } from '../../../../common/errors/index.js';
import { getEntity } from '../../db/queries/entity-deprecate.js';
import * as queries from '../../db/queries/organization.js';

import * as entityQueries from '../../db/queries/entity.js';
import * as eventQueries from '../../db/queries/event.js';
import * as stripePayoutQueries from '../../db/queries/stripe/payout.js';
import * as shopQueries from '../../db/queries/shop.js';
import * as userQueries from '../../db/queries/user.js';

import { isAllowed } from './entity-deprecate.js';

export function getOwnedEvents(organizationId: string) {
  return queries.getOwnedEvents(organizationId);
}

export function generateReport(reportId: string, userId: String) {
  // If no version if specified
  return queries.generateReport(reportId);
}

interface IReportInfo {
  organizationId: string;
  type: string;
  metadata: any;
}

interface IStripePayout {
  id: string;
  createdAt: Date;
}

interface ISale {
  amount: number;
  buyerUserId: string;
  createdAt: Date;
  id: string;
  invoiceItemId: string;
  metadata: any;
  payout?: IStripePayout;
  quantity: number;
  receiptId: string;
  sellerEntityId: string;
  status: string;
  stripePriceId: string;
  transactionFees: number;
  unitAmount: number;
}

interface ISaleReportInfo {
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

interface IUserInfo {
  primaryPerson: {
    id: string;
    name: string;
    surname: string;
  };
  email: string;
  userId: string;
}

interface IUserInfoMap {
  [primaryPersonId: string]: IUserInfo;
}

interface ITaxRate {
  active: boolean;
  description: string;
  displayName: string;
  id: string;
  inclusive: boolean;
  percentage: number;
  stripePriceId: string;
}

interface IEntity {
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

interface IEntityMap {
  [id: string]: IEntity;
}

interface ITaxRatesMap {
  [stripePriceId: string]: ITaxRate[];
}

export const generateReportV2 = async (
  reportId: string,
  userId: string,
): Promise<ISaleReportInfo[]> => {
  // Get Organization Id for report
  const reportInfo: IReportInfo = await queries.getReportInfo(reportId);

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
    await stripePayoutQueries.updatePayouts();

    /** Get Active Sales */
    const activeSales: ISale[] = await queries.getActiveSales(
      reportInfo.organizationId,
    );

    /** Get relevant emails */
    const relevantUserInfos = await userQueries.getUserInfosById(
      activeSales.map(sale => sale.buyerUserId),
    );

    const relevantUserInfosMap = relevantUserInfos.reduce(
      (prev: IUserInfoMap, curr: IUserInfo) => ({
        ...prev,
        [curr.userId]: curr,
      }),
      {},
    );

    /** Get all tax rates */
    const taxRates: ITaxRate[] = await shopQueries.getTaxRates(
      activeSales.map(sale => sale.stripePriceId),
    );

    const taxRatesMap: ITaxRatesMap = taxRates.reduce(
      (prev: ITaxRatesMap, curr: ITaxRate) => ({
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
          (prev: number, curr: ITaxRate) =>
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

export function getOrganizationMembers(organizationId: string, userId: string) {
  return queries.getOrganizationMembers(organizationId, userId);
}

export async function getOrganization(organizationId: string, userId: string) {
  const res = await getEntity(organizationId, userId);

  return {
    basicInfos: res.basicInfos,
  };
}

export const getAllOrganizationsWithAdmins = async ({
  limit,
  page,
  query,
}: {
  limit: string;
  page: string;
  query: string;
}) => {
  return queries.getAllOrganizationsWithAdmins(
    Number(limit),
    Number(page),
    query,
  );
};

export const verifyOrganization = async (
  { id, verify }: { id: string; verify: string },
  userId: string,
) => {
  if (verify === 'false') {
    return queries.verifyOrganization(id, userId, false);
  }

  return queries.verifyOrganization(id, userId);
};

export const deleteOrganization = async (
  id: string,
  restore: string = 'false',
) => {
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
) => {
  if (!(await isAllowed(id, userId, ENTITIES_ROLE_ENUM.EDITOR))) {
    throw new Error(ERROR_ENUM.ACCESS_DENIED);
  }

  return queries.getMembers(id, searchQuery);
};
