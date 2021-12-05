import { IGroup, IPermission, IUser } from '../models/auth'
import { IDepartment } from '../models/setup';

export interface IState {
  title: string;
  isAuthenticated: boolean;
  token: string ;
  auth?: IUser | null;
  groups: IGroup[];
  permissions: IPermission[];
  users: IUser[];
  auditLogs: any[];
  departments: IDepartment[];
}

export const initialState = () => {
  return <IState>{
    title: 'Felicity LIMS',
    isAuthenticated: false,
    auth: null,
    token: "",
    groups: [],
    permissions: [],
    users: [],
    auditLogs: [],
    departments: [],
  };
};

export const state: IState = initialState();
export type RootState = typeof state;
