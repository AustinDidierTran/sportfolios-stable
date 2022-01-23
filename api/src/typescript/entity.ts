export interface Entity {
  basicInfos: {
    description: string;
    id: string;
    city: string;
    type: string;
    name: string;
    verifiedAt: Date;
    quickDescription?: string;
    surname?: string;
    photoUrl: string;
    role: number;
  };
}

export interface EntityMap {
  [id: string]: Entity;
}

export interface Event extends Entity {}

export interface Person extends Entity {}

export interface Team extends Entity {
  name?: string;
}
