export interface Entity {
  id: string;
  name: string;
  photoUrl: string;
  verifiedAt?: Date;
  deletedAt?: Date;
}

export interface Person extends Entity {
  surname: string;
  emails: string[];
}

export interface Roster {
  id: string;
  team: Entity;
  players: Person[];
}


export interface TaxRates{
  display: string;
  id: string;
  percentage: number; 
  amount: number;
}

export interface CartTotal{
  subTotal: number;
  total: number;
  taxes: TaxRates[];   
  transactionFees: number;
}

export interface Item{
  id: string;
  metadata: any;
  price: number;
  description: string;
  label: string;
  photoUrl: string;
  quantity: number;
  taxRates: TaxRates[];
  checked: boolean;
  requiresMembership: boolean;
}

export interface Buyer{
  person: Person;
  sellers: Seller[];
  subTotal: number;
  transactionFees: number;
  taxes: TaxRates[];
  total: number;
}

export interface Seller{
  membership?: Date;
  entity: Entity;
  items: Item[];
  subTotal: number;
  transactionFees: number;
  taxes: TaxRates[];
  total: number;
}