import { Team } from './entity';
import { StripePayout } from './stripe';

interface Option {
  name?: string;
}

export interface ReportInfo {
  organizationId: string;
  type: string;
  metadata: any;
}

export interface ReportHeader {
  labelKey: string;
  key: string;
}

export interface RefundQueryData {
  refundAmount: string;
  refundId: string;
  invoiceItemId: string;
  createdAt: Date;
  quantity: string;
  unitAmount: string;
  amount: string;
  stripePriceId: string;
  buyerUserId: string;
  metadata: SaleMetadata;
  receiptId: string;
  sellerEntityId: string;
  transactionType: string;
  transactionFees: string;
}

export interface Sale {
  amount: number;
  buyerUserId: string;
  createdAt: Date;
  id: string;
  invoiceItemId: string;
  metadata: SaleMetadata;
  payout?: StripePayout;
  quantity: number;
  receiptId: string;
  sellerEntityId: string;
  status: string;
  stripePriceId: string;
  transactionFees: number;
  unitAmount: number;
}

export interface SaleMetadata {
  eventId: string;
  personId: string;
  type?: string;
  person?: any;
  membership_type?: number;
  option?: Option;
  name?: string;
  isIndividualOption?: boolean;
  team?: Team;
}

interface ReportDataStructure {
  value?: string;
  valueKey?: string;
}

export interface MemberReportData {
  name: ReportDataStructure;
  surname: ReportDataStructure;
  membership: ReportDataStructure;
  price: ReportDataStructure;
  status: ReportDataStructure;
  paidOn: ReportDataStructure;
  createdAt: ReportDataStructure;
  expirationDate: ReportDataStructure;
  email: ReportDataStructure;
  phoneNumber: ReportDataStructure;
  birthDate: ReportDataStructure;
  gender: ReportDataStructure;
  address: ReportDataStructure;
  emergencyName: ReportDataStructure;
  emergencySurname: ReportDataStructure;
  emergencyPhoneNumber: ReportDataStructure;
  medicalConditions: ReportDataStructure;
  heardOrganization: ReportDataStructure;
  gettingInvolved: ReportDataStructure;
  frequentedSchool: ReportDataStructure;
  jobTitle: ReportDataStructure;
  employer: ReportDataStructure;
}

export interface SaleReportData {
  createdAt: Date;
  id: ReportDataStructure;
  type: ReportDataStructure;
  detail: ReportDataStructure;
  registrationFor: ReportDataStructure;
  transactionType: ReportDataStructure;
  buyerUserId: ReportDataStructure;
  email: ReportDataStructure;
  madeOn: ReportDataStructure;
  invoiceItemId: ReportDataStructure;
  unitPrice: ReportDataStructure;
  quantity: ReportDataStructure;
  status: ReportDataStructure;
  subtotal: ReportDataStructure;
  totalTax: ReportDataStructure;
  total: ReportDataStructure;
  platformFees: ReportDataStructure;
  totalNet: ReportDataStructure;
}

export interface ReportResponse {
  fileName: string;
  data: SaleReportData[] | MemberReportData[];
  headers: ReportHeader[];
}
