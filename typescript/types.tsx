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
}

export interface Seller{
  isMember: boolean;
  entity: Entity;
  items: Item[];
}