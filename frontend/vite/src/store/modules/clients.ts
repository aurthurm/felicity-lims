import { useQuery } from '@urql/vue';
import { urqlClient } from '../../urql';
import { RootState } from '../state';
import { ActionTree, GetterTree, MutationTree } from 'vuex';
import { IClient, IDistrict } from '../common'

import { GET_ALL_CLIENTS, 
  SEARCH_CLIENTS, 
  GET_CLIENT_CONTACTS_BY_CLIENT_UID, 
  GET_CLIENT_BY_UID } from '../../graphql/clients.queries';
import { addListsUnique } from '../../utils';

export class Client implements IClient {
  constructor(
    public uid?: number,
    public name?: string,
    public code?: string,
    public email?: string,
    public emailCc?: string[],
    public consentEmail?: boolean,
    public businessPhone?: string,
    public mobilePhone?: string,
    public consentSms?: boolean,
    public district?: IDistrict,
    public districtUid?: string,
  ) {}
}

export interface IClientContact {
  uid?: number,
  firstName?: string,  
  lastname?: string,
  email?: string,
  emailCc?: string[],
  consentEmail?: boolean,
  businessPhone?: string,
  mobilePhone?: string,
  consentSms?: boolean,
  client?: IClient,
}

export class ClientContact implements IClientContact {
  constructor(
    public uid?: number,
    public firstName?: string,
    public lastName?: string,
    public email?: string,
    public emailCc?: string[],
    public consentEmail?: boolean,
    public businessPhone?: string,
    public mobilePhone?: string,
    public consentSms?: boolean,
    public client?: IClient,
  ) {}
}

// state contract
export interface IState {
  clients?: IClient[];
  client?: IClient | null;
  clientContacts?: IClientContact[];
  clientCount?: number;
  clientPageInfo?: any;
}

export const initialState = () => {
  return <IState>{
    clients: [],
    client: null,
    clientContacts: [],
    clientCount: 0,
    clientPageInfo: null,
  };
};

export const state: IState = initialState();

export enum MutationTypes {
  RESET_STATE = 'RESET_STATE',
  SET_CLIENT_CONTACTS = 'SET_CLIENT_CONTACTS',
  ADD_CREATED_CLIENT_CONTACT = 'ADD_CREATED_CLIENT_CONTACT',
  UPDATE_CREATED_CLIENT_CONTACT = 'UPDATE_CREATED_CLIENT_CONTACT',
  SET_CLIENTS = 'SET_CLIENTS',
  SET_CLIENTS_DIRECT = 'SET_CLIENTS_DIRECT',
  SET_CLIENT = 'SET_CLIENT',
}

export enum ActionTypes {
  RESET_STATE = 'RESET_STATE',
  SET_CLIENT_CONTACTS = 'SET_CLIENT_CONTACTS',
  FETCH_CLIENT_CONTACTS = 'FETCH_CLIENT_CONTACTS',
  ADD_CREATED_CLIENT_CONTACT = 'ADD_CREATED_CLIENT_CONTACT',
  UPDATE_CREATED_CLIENT_CONTACT = 'UPDATE_CREATED_CLIENT_CONTACT',
  SET_CLIENTS = 'SET_CLIENTS',
  FETCH_CLIENTS = 'FETCH_CLIENTS',
  FETCH_CLIENT_BY_UID = 'FETCH_CLIENT_BY_UID',
  SEARCH_CLIENTS = 'SEARCH_CLIENTS'
}

// Getters
export const getters = <GetterTree<IState, RootState>>{
  getClientContacts: (state) => state.clientContacts,
  getClients: (state) => state.clients,
  getClient: (state) => state.client,
  getClientByName: (state) => (name: string) => state.clients?.find(cl => cl.name === name),
  getClientCount: (state) => state.clientCount,
  getClientPageInfo: (state) => state.clientPageInfo,
};

// Mutations
export const mutations = <MutationTree<IState>>{
  [MutationTypes.RESET_STATE](state: IState): void {
    Object.assign(state, initialState());
  },

  [MutationTypes.SET_CLIENTS](state: IState, payload: any): void {
    const clients = payload.clients.items;

    if(payload.fromFilter){
      state.clients = [];
      state.clients = clients;
    } else {
      state.clients =  addListsUnique(state.clients!, clients, "uid");
    }

    state.clientCount = payload.clients?.totalCount;
    state.clientPageInfo = payload.clients?.pageInfo;
  },  
  
  [MutationTypes.SET_CLIENT](state: IState, payload: IClient): void {
    state.client = payload;
  },

  [MutationTypes.SET_CLIENTS_DIRECT](state: IState, clients: IClient[]): void {
    state.clients = [];
    state.clients = clients;
  },

  [MutationTypes.SET_CLIENT_CONTACTS](state: IState, payload: IClientContact[]): void {
    state.clientContacts = [];
    state.clientContacts = payload;
  },

  [MutationTypes.ADD_CREATED_CLIENT_CONTACT](state: IState, payload: IClientContact): void {
    state.clientContacts?.push(payload);
  },

  [MutationTypes.UPDATE_CREATED_CLIENT_CONTACT](state: IState, payload: IClientContact): void {
    state.clientContacts = state.clientContacts?.map(item => item.uid === payload.uid ? payload: item);
  },

};

// Actions
export const actions = <ActionTree<IState, RootState>>{
  async [ActionTypes.RESET_STATE]({ commit }) {
    commit(MutationTypes.RESET_STATE);
  },

  async [ActionTypes.FETCH_CLIENTS]({ commit }, params){
    await urqlClient
    .query( GET_ALL_CLIENTS, { first: params.first, after: params.after, text: params.text, sortBy: params.sortBy })
    .toPromise()
    .then(result => commit(MutationTypes.SET_CLIENTS, {
      clients: result.data.clientAll,
      fromFilter: params.filterAction,
    }))
  },

  async [ActionTypes.SEARCH_CLIENTS]({ commit }, query: string){
    await urqlClient
      .query(SEARCH_CLIENTS, { queryString: query })
      .toPromise()
      .then(result => commit(MutationTypes.SET_CLIENTS_DIRECT, result.data.clientSearch))
  },

  async [ActionTypes.FETCH_CLIENT_CONTACTS]({ commit }, clientUid){
    await urqlClient
    .query( GET_CLIENT_CONTACTS_BY_CLIENT_UID, { clientUid })
    .toPromise()
    .then(result => commit(MutationTypes.SET_CLIENT_CONTACTS, result.data.clientContactByClientUid))
  },

  async [ActionTypes.ADD_CREATED_CLIENT_CONTACT]({ commit }, payload: IClientContact) {
    commit(MutationTypes.ADD_CREATED_CLIENT_CONTACT, payload);
  },

  async [ActionTypes.UPDATE_CREATED_CLIENT_CONTACT]({ commit }, payload: IClientContact) {
    commit(MutationTypes.UPDATE_CREATED_CLIENT_CONTACT, payload);
  },

  async [ActionTypes.FETCH_CLIENT_BY_UID]({ commit }, uid){
    await urqlClient
    .query( GET_CLIENT_BY_UID, { uid })
    .toPromise()
    .then(result => commit(MutationTypes.SET_CLIENT, result.data.clientByUid))
  },


};

// namespaced: true,
export const clients = {
  state,
  mutations,
  actions,
  getters,
};
