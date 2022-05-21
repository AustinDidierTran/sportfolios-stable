import {
  ENTITIES_ROLE_ENUM,
  MEMBERSHIP_TYPE_ENUM,
} from '../../../../common/enums/index.js';

import { ERROR_ENUM } from '../../../../common/errors/index.js';
import { getEntity } from '../../db/queries/entity-deprecate.js';
import * as queries from '../../db/queries/organization.js';

import { isAllowed } from './entity-deprecate.js';

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

export const getReports = async (entityId: string): Promise<any> => {
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
