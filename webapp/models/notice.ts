import { IGroup, IUser } from "./auth";
import { IDepartment } from "./setup";

export interface INotice {
    uid: number;
    title: string;
    body: string;
    departments: IDepartment[];
    groups: IGroup[];
    users: IUser[];
    expiry: Date;
    expired: boolean;
    dayToExpiration: number;
    status: string;
    createdByUid: number;
  }