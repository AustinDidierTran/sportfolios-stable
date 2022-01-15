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

export interface roster {
  id: string;
  team: Entity;
  players: Person[];
}