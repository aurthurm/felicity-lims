import { IAuth } from '../models/auth'

export interface IState {
  title: string;
  isAuthenticated: boolean;
  token: string ;
  auth?: IAuth | null;
  groups: any[];
  permissions: any[];
  users: any[];
  auditLogs: any[];
  departments: any[];
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
