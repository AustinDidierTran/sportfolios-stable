import { Event, Team } from './entity';
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

export interface ReportData {}

export interface ReportResponse {
  fileName: string;
  data: ReportData[];
  headers: ReportHeader[];
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
  // name: string;
  // surname: string;
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

export interface MemberReportData extends ReportData {
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

export interface SaleReportData extends ReportData {
  id: ReportDataStructure;
  type: ReportDataStructure;
  detail: ReportDataStructure;
  registrationFor: ReportDataStructure;
  transactionType: ReportDataStructure;
  buyerUserId: ReportDataStructure;
  email: ReportDataStructure;
  madeOn: ReportDataStructure;
  unitPrice: ReportDataStructure;
  quantity: ReportDataStructure;
  status: ReportDataStructure;
  subtotal: ReportDataStructure;
  totalTax: ReportDataStructure;
  total: ReportDataStructure;
  platformFees: ReportDataStructure;
  totalNet: ReportDataStructure;
}
