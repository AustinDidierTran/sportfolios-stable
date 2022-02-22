export interface UserInfo {
  primaryPerson: {
    id: string;
    name: string;
    surname: string;
  };
  email?: string;
  userId: string;
}

export interface UserInfoMap {
  [primaryPersonId: string]: UserInfo;
}
