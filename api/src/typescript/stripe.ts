export interface StripePayout {
  id: string;
  createdAt: Date;
}

export interface TaxRate {
  active: boolean;
  description: string;
  displayName: string;
  id: string;
  inclusive: boolean;
  percentage: number;
  stripePriceId: string;
}

export interface TaxRatesMap {
  [stripePriceId: string]: TaxRate[];
}

export enum STRIPE_REPORT_TYPES {
  PAYOUT_RECONCILIATION = 'payout_reconciliation.itemized.5',
}
