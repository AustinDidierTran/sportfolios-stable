import moment from 'moment';
import {
  CART_ITEM,
  GLOBAL_ENUM,
  MEMBERSHIP_TYPE_ENUM,
} from '../../../../common/enums';
import { ERROR_ENUM } from '../../../../common/errors';
import { formatPrice } from '../../../../common/utils/stringFormat';
import { Person } from '../../typescript/entity';
import { RefundQueryData, Sale, SaleReportData } from '../../typescript/report';
import { TaxRate, TaxRatesMap } from '../../typescript/stripe';
import { UserInfoMap } from '../../typescript/user';
import { getEntity } from '../service/entity-deprecate';

const getMembershipName = (type: number): string => {
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

export const formatSales = async (
  sales: Sale[],
  taxRatesMap: TaxRatesMap,
  relevantUserInfosMap: UserInfoMap,
): Promise<SaleReportData[]> => {
  return Promise.all(
    sales.map(
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
            createdAt: sale.createdAt,
            subtotal: { value: formatPrice(subtotal) },
            totalTax: { value: formatPrice(totalTax) },
            total: { value: formatPrice(total) },
            platformFees: { value: formatPrice(platformFees) },
            invoiceItemId: { value: sale.invoiceItemId },
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
            createdAt: sale.createdAt,
            madeOn: {
              value: moment(sale.createdAt).format('YYYY-MM-DD HH:mm'),
            },
            quantity: { value: sale.quantity.toString() },
            subtotal: { value: formatPrice(subtotal) },
            totalTax: { value: formatPrice(totalTax) },
            total: { value: formatPrice(total) },
            platformFees: { value: formatPrice(platformFees) },
            invoiceItemId: { value: sale.invoiceItemId },
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
            createdAt: sale.createdAt,
            madeOn: {
              value: moment(sale.createdAt).format('YYYY-MM-DD HH:mm'),
            },
            quantity: { value: sale.quantity.toString() },
            subtotal: { value: formatPrice(subtotal) },
            totalTax: { value: formatPrice(totalTax) },
            total: { value: formatPrice(total) },
            platformFees: { value: formatPrice(platformFees) },
            invoiceItemId: { value: sale.invoiceItemId },
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
            createdAt: sale.createdAt,
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
            invoiceItemId: { value: sale.invoiceItemId },

            totalNet: {
              value: formatPrice(totalNet),
            },
            buyerUserId: { value: sale.buyerUserId },
            id: { value: sale.id },
          };
        }

        // eslint-disable-next-line
        console.log('going into error...', sale.metadata.type);

        throw new Error(ERROR_ENUM.ERROR_OCCURED);
      },
    ),
  );
};

export const formatRefunds = async (
  refunds: RefundQueryData[],
  formattedSales: SaleReportData[],
): Promise<SaleReportData[]> => {
  return refunds.map(refund => {
    const associatedSale = formattedSales.find(
      formattedSale =>
        formattedSale.invoiceItemId.value === refund.invoiceItemId,
    );

    return {
      type: associatedSale.type,
      detail: associatedSale.detail,
      registrationFor: associatedSale.registrationFor,
      transactionType: { valueKey: 'reports.transaction_type.refund' },
      status: {},
      createdAt: refund.createdAt,
      email: associatedSale.email,
      madeOn: {
        value: moment(refund.createdAt).format('YYYY-MM-DD HH:mm'),
      },
      quantity: { value: refund.quantity.toString() },
      unitPrice: { value: formatPrice(refund.unitAmount) },
      subtotal: { value: `-${associatedSale.subtotal.value}` },
      totalTax: { value: `-${associatedSale.totalTax.value}` },
      total: { value: `-${associatedSale.total.value}` },
      platformFees: { value: `-${associatedSale.platformFees.value}` },
      invoiceItemId: { value: refund.invoiceItemId },

      totalNet: {
        value: `-${associatedSale.totalNet.value}`,
      },
      buyerUserId: { value: refund.buyerUserId },
      id: { value: refund.refundId },
    };
  });
};
