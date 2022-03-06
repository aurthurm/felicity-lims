import { ActionTree } from 'vuex';
import { useQuery } from '@urql/vue';
import { urqlClient } from '../urql';

import { IState, RootState } from './state';
import { MutationTypes } from './mutations';

import {
  GET_GROUPS_AND_PERMISSIONS, GET_ALL_USERS, GET_AUDIT_LOG_FOR_TARGET, GET_DEPARTMENTS
} from '../graphql/_queries';
import { authToStorage, authFromStorage, authLogout } from '../auth';

export enum ActionTypes {
  RESET_STATE = 'RESET_STATE',
  PERSIST_AUTH_DATA = 'PERSIST_AUTH_DATA',
  PERSIST_AUTH_FROM_LOCAL_STORAGE = 'PERSIST_AUTH_FROM_LOCAL_STORAGE',
  LOG_OUT = 'LOG_OUT',

  FETCH_GROUPS_AND_PERMISSIONS = 'FETCH_GROUPS_AND_PERMISSIONS',
  FETCH_USERS = 'FETCH_USERS',
  UPDATE_GROUPS_PERMISSIONS = 'UPDATE_GROUPS_PERMISSIONS',
  ADD_GROUP = 'ADD_GROUP',
  UPDATE_GROUP = 'UPDATE_GROUP',

  FETCH_AUDIT_LOGS = 'FETCH_AUDIT_LOGS',
  RESET_AUDIT_LOGS = 'RESET_AUDIT_LOGS',

  FETCH_DEPARTMENTS = 'FETCH_DEPARTMENTS',
  ADD_DEPARTMENT = 'ADD_DEPARTMENT',
  UPDATE_DEPARTMENT = 'UPDATE_DEPARTMENT',
}

export const actions = <ActionTree<IState, RootState>>{
  async [ActionTypes.RESET_STATE]({ commit }) {
    commit(MutationTypes.RESET_STATE);
  },

  async [ActionTypes.FETCH_USERS]({ commit }, params) {
    await urqlClient
          .query( GET_ALL_USERS, { first: params?.first, after: params?.after, text: params?.text, sortBy: params?.sortBy })
          .toPromise()
          .then(result => commit(MutationTypes.SET_USERS, result.data.userAll))
  },

  // Auth
  async [ActionTypes.PERSIST_AUTH_DATA]({ commit }, payload) {
    const authData = payload.data.authenticateUser;
    await authToStorage(authData)
    return await commit(MutationTypes.PERSIST_AUTH_DATA, authData);
  },

  async [ActionTypes.PERSIST_AUTH_FROM_LOCAL_STORAGE]({ commit }) {
    const authData = await authFromStorage()
    await commit(MutationTypes.PERSIST_AUTH_DATA, authData);
  },

  async [ActionTypes.LOG_OUT]({ commit }) {
    authLogout();
    commit(MutationTypes.RESET_STATE);
    return true
  },

  // Groups and permissions
  async [ActionTypes.FETCH_GROUPS_AND_PERMISSIONS]({ commit }) {
    await useQuery({ query: GET_GROUPS_AND_PERMISSIONS })
          .then(payload => commit(MutationTypes.SET_GROUPS_AND_PERMISSIONS, payload.data.value));
  },

  async [ActionTypes.ADD_GROUP]({ commit }, payload) {
    commit(MutationTypes.ADD_GROUP, payload);
  },

  async [ActionTypes.UPDATE_GROUP]({ commit }, payload) {
    commit(MutationTypes.UPDATE_GROUP, payload);
  },

  async [ActionTypes.UPDATE_GROUPS_PERMISSIONS]({ commit }, payload) {
    commit(MutationTypes.UPDATE_GROUPS_PERMISSIONS, payload.data.updateGroupsAndPermissions);
  },

  // audit logs
  async [ActionTypes.RESET_AUDIT_LOGS]({ commit }) {
    commit(MutationTypes.RESET_AUDIT_LOGS);
  },

  async [ActionTypes.FETCH_AUDIT_LOGS]({ commit }, params){
    await urqlClient
    .query( GET_AUDIT_LOG_FOR_TARGET, params)
    .toPromise()
    .then(result => commit(MutationTypes.SET_AUDIT_LOGS, result.data.auditLogsFilter))
  },

  // Departments
  async [ActionTypes.FETCH_DEPARTMENTS]({ commit }) {
    await useQuery({ query: GET_DEPARTMENTS })
          .then(payload => commit(MutationTypes.SET_DEPARTMENTS, payload.data.value.departmentAll));
  },

  async [ActionTypes.ADD_DEPARTMENT]({ commit }, payload) {
    commit(MutationTypes.ADD_DEPARTMENT, payload.data.createDepartment);
  },

  async [ActionTypes.UPDATE_DEPARTMENT]({ commit }, payload) {
    commit(MutationTypes.UPDATE_DEPARTMENT, payload.data.updateDepartment);
  },

};

// checkTimeLeft() {   
//   let auth = JSON.parse(localStorage.getItem('auth'))
//   if (!auth) {
//     return;
//   } else {
//     let decoded = jwt.decode(auth.access);
//     let decodedTime = new Date(decoded.exp * 1000);
//     let nowTime = Date.now();
//     function timeToSessionExpiry(currentTime, expiryTime) {
//       let currentTimeMinutes = new Date(currentTime).getHours() * 60 + new Date(currentTime).getMinutes()
//       let expiryTimeMinutes = expiryTime.getHours() * 60 + expiryTime.getMinutes()
//       return expiryTimeMinutes - currentTimeMinutes
//     }
//     let minutesLeft = timeToSessionExpiry(nowTime, decodedTime);
//     let hoursLeft = +((minutesLeft/60).toString().substring(0,1));
//     let timeLeft = { 
//       hours: hoursLeft, 
//       minutes: minutesLeft 
//     }
//     return timeLeft
//   }
// }

// async extendSession() {
// let auth = JSON.parse(localStorage.getItem('auth'))
// if (!auth || !auth.refresh) return;
// await this.$axios.post('refresh/', { "refresh": auth.refresh })
//       .then(res => {
//         auth.access = res.data.access
//         // localStorage.removeItem('auth'); 
//         localStorage.setItem('auth', JSON.stringify(auth))
//         return res
//       })
//       .catch(err => console.log(err)) 
// }
