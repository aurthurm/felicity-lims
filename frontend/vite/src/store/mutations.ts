import { MutationTree } from 'vuex';
import { IGroup } from '../models/auth';
import { IState, initialState } from './state';

export enum MutationTypes {
  RESET_STATE = 'RESET_STATE',
  PERSIST_AUTH_DATA = 'PERSIST_AUTH_DATA',
  SET_USERS = 'SET_USERS',

  SET_GROUPS_AND_PERMISSIONS = 'SET_GROUPS_AND_PERMISSIONS',
  UPDATE_GROUPS_PERMISSIONS = 'UPDATE_GROUPS_PERMISSIONS',
  ADD_GROUP = 'ADD_GROUP',
  UPDATE_GROUP = 'UPDATE_GROUP',

  RESET_AUDIT_LOGS = 'RESET_AUDIT_LOGS',
  SET_AUDIT_LOGS = 'SET_AUDIT_LOGS',

  SET_DEPARTMENTS = 'SET_DEPARTMENTS',
  ADD_DEPARTMENT = 'ADD_DEPARTMENT',
  UPDATE_DEPARTMENT = 'UPDATE_DEPARTMENT',
}

export const mutations = <MutationTree<IState>>{
  [MutationTypes.RESET_STATE](state: IState): void {
    Object.assign(state, initialState());
  },

  async [MutationTypes.PERSIST_AUTH_DATA](state: IState, authData) {
    state.auth = authData.user;
    state.token = authData.token;
    state.isAuthenticated = true;
    if(state.auth) state.auth.role = authData.user.groups[0]?.name;
    return authData
  },

  [MutationTypes.SET_USERS](state: IState, payload): void {
    state.users = payload.items
  },

  [MutationTypes.SET_GROUPS_AND_PERMISSIONS](state: IState, payload): void {
    state.groups = payload?.groupAll;
    state.permissions = payload?.permissionAll;
  },

  [MutationTypes.ADD_GROUP](state: IState, payload): void {
    state.groups?.push(payload)
  },

  [MutationTypes.UPDATE_GROUP](state: IState, payload: IGroup): void {
    const index = state.groups?.findIndex(g => g.uid === payload?.uid);
    if(index > -1) state!.groups[index] = payload;
  },

  [MutationTypes.UPDATE_GROUPS_PERMISSIONS](state: IState, payload): void {
    let group = payload?.group;
    const index = state.groups?.findIndex(g => g.uid === group?.uid);
    group.permissions = group?.permissions || [];
    state!.groups[index] = group;
  },

  // AUDIT LOGS
  [MutationTypes.RESET_AUDIT_LOGS](state: IState): void {
    state.auditLogs = [];
  },

  [MutationTypes.SET_AUDIT_LOGS](state: IState, payload): void {
    payload?.forEach((log: any) => {
      if(typeof(log.stateAfter) === "string"){
        log.stateAfter = JSON.parse(log.stateAfter);
        log.stateBefore = JSON.parse(log.stateBefore);
      }
    })
    state.auditLogs = payload;
  },

  // Departments
  [MutationTypes.SET_DEPARTMENTS](state: IState, departments): void {
    state.departments = departments || [];
  },

  [MutationTypes. ADD_DEPARTMENT](state: IState, department: any): void {
    state?.departments?.push(department);
  },

  [MutationTypes.UPDATE_DEPARTMENT](state: IState, department): void {
    const index = state.departments?.findIndex(g => g?.uid === department?.uid);
    state!.departments[index] = department;
  },

};
