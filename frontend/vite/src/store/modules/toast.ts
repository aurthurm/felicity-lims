import { RootState } from '../state';
import { ActionTree, GetterTree, MutationTree } from 'vuex';
import { INotification, IAlert } from '../../models/notification'

// state contract
export interface IState {
  alert: IAlert;
  notification: INotification;
}

export const initialState = () => {
  return <IState>{
    alert: {} as IAlert,
    notification: {} as INotification,
  };
};

export const state: IState = initialState();

export enum MutationTypes {
  RESET_STATE = 'RESET_STATE',

  ALERT_SUCCESS = 'ALERT_SUCCESS',
  ALERT_ERROR = 'ALERT_ERROR',
  ALERT_WARING = 'ALERT_WARING',
  ALERT_INFO = 'ALERT_INFO',
  ALERT_QUESTION = 'ALERT_QUESTION',

  NOTIFY_SUCCESS = 'NOTIFY_SUCCESS',
  NOTIFY_ERROR = 'NOTIFY_ERROR',
  NOTIFY_WARING = 'NOTIFY_WARING',
  NOTIFY_INFO = 'NOTIFY_INFO',
  NOTIFY_QUESTION = 'NOTIFY_QUESTION',
}

export enum ActionTypes {
  RESET_STATE = 'ALERT_RESET_STATE',

  ALERT_SUCCESS = 'ALERT_SUCCESS',
  ALERT_ERROR = 'ALERT_ERROR',
  ALERT_WARING = 'ALERT_WARING',
  ALERT_INFO = 'ALERT_INFO',
  ALERT_QUESTION = 'ALERT_QUESTION',

  NOTIFY_SUCCESS = 'NOTIFY_SUCCESS',
  NOTIFY_ERROR = 'NOTIFY_ERROR',
  NOTIFY_WARING = 'NOTIFY_WARING',
  NOTIFY_INFO = 'NOTIFY_INFO',
  NOTIFY_QUESTION = 'NOTIFY_QUESTION',
}

// Getters
export const getters = <GetterTree<IState, RootState>>{
  getCurrentToast: (state) => state,
};

// Mutations
export const mutations = <MutationTree<IState>>{
  [MutationTypes.RESET_STATE](state: IState): void {
    Object.assign(state, initialState());
  },

  // aLERTS
  [MutationTypes.ALERT_SUCCESS](state: IState, message: string): void {
    state.alert.message = message;
    state.alert.icon = "success";
    state.alert.ticks = new Date().getTime();
  },

  [MutationTypes.ALERT_ERROR](state: IState, message: string): void {
    state.alert.message = message;
    state.alert.icon = "error";
    state.alert.ticks = new Date().getTime();
  },

  [MutationTypes.ALERT_WARING](state: IState, message: string): void {
    state.alert.message = message;
    state.alert.icon = "warning";
    state.alert.ticks = new Date().getTime();
  },

  [MutationTypes.ALERT_INFO](state: IState, message: string): void {
    state.alert.message = message;
    state.alert.icon = "info";
    state.alert.ticks = new Date().getTime();
  },

  [MutationTypes.ALERT_QUESTION](state: IState, message: string): void {
    state.alert.message = message;
    state.alert.icon = "question";
    state.alert.ticks = new Date().getTime();
  },

  //NOTOFICATIONS 
  [MutationTypes.NOTIFY_SUCCESS](state: IState, payload: any): void {
    state.notification.data = payload;
    state.notification.icon = "success";
    state.notification.ticks = new Date().getTime();
  },

  [MutationTypes.NOTIFY_ERROR](state: IState, payload: any): void {
    state.notification.data = payload;
    state.notification.icon = "error";
    state.notification.ticks = new Date().getTime();
  },

  [MutationTypes.NOTIFY_WARING](state: IState, payload: any): void {
    state.notification.data = payload;
    state.notification.icon = "warning";
    state.notification.ticks = new Date().getTime();
  },

  [MutationTypes.NOTIFY_INFO](state: IState, payload: any): void {
    state.notification.data = payload;
    state.notification.icon = "info";
    state.notification.ticks = new Date().getTime();
  },
}

// Actions
export const actions = <ActionTree<IState, RootState>>{
  //Alerts
  async [ActionTypes.RESET_STATE]({ commit }) {
    commit(MutationTypes.RESET_STATE);
  },

  async [ActionTypes.ALERT_SUCCESS]({ commit }, message ){
    commit(MutationTypes.ALERT_SUCCESS, message);
  },

  async [ActionTypes.ALERT_ERROR]({ commit }, message ){
    commit(MutationTypes.ALERT_ERROR, message);
  },

  async [ActionTypes.ALERT_WARING]({ commit }, message ){
    commit(MutationTypes.ALERT_WARING, message);
  },

  async [ActionTypes.ALERT_INFO]({ commit }, message ){
    commit(MutationTypes.ALERT_INFO, message);
  },

  async [ActionTypes.ALERT_QUESTION]({ commit }, message ){
    commit(MutationTypes.ALERT_QUESTION, message);
  },

  //Notification
  async [ActionTypes.NOTIFY_SUCCESS]({ commit }, payload ){
    commit(MutationTypes.NOTIFY_SUCCESS, payload);
  },

  async [ActionTypes.NOTIFY_ERROR]({ commit }, payload ){
    commit(MutationTypes.NOTIFY_ERROR, payload);
  },

  async [ActionTypes.NOTIFY_WARING]({ commit }, payload ){
    commit(MutationTypes.NOTIFY_WARING, payload);
  },

  async [ActionTypes.NOTIFY_INFO]({ commit }, payload ){
    commit(MutationTypes.NOTIFY_INFO, payload);
  },

};

// namespaced: true,
export const toast = {
  state,
  mutations,
  actions,
  getters,
};