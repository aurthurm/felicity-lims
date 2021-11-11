import { useQuery } from '@urql/vue';
import { urqlClient } from '../../urql';
import { RootState } from '../state';
import { ActionTree, GetterTree, MutationTree } from 'vuex';

import { GET_ALL_DOCUMENTS, GET_DOCUMENT_BY_UID } from '../../graphql/markdown.queries';
import { IMDocument } from '../../models/document';



// state contract
export interface IState {
  documents: IMDocument[];
  document: IMDocument | null;
}

export const initialState = () => {
  return <IState>{
    documents: [],
    document: null,
  };
};

export const state: IState = initialState();

export enum MutationTypes {
  RESET_STATE = 'RESET_STATE',

  SET_DOCUMENTS = 'SET_DOCUMENTS',
  ADD_DOCUMENT = 'ADD_DOCUMENT',
  UPDATE_DOCUMENT = 'UPDATE_DOCUMENT',

  SET_DOCUMENT = 'SET_DOCUMENT',
  UPDATE_DOCUMENT_CONTENT = 'UPDATE_DOCUMENT_CONTENT',
}

export enum ActionTypes {
  RESET_STATE = 'RESET_STATE',

  FETCH_DOCUMENTS = 'FETCH_DOCUMENTS',
  ADD_DOCUMENT = 'ADD_DOCUMENT',
  UPDATE_DOCUMENT = 'UPDATE_DOCUMENT',

  FETCH_DOCUMENT_BY_UID = 'FETCH_DOCUMENT_BY_UID',
  UPDATE_DOCUMENT_CONTENT = 'UPDATE_DOCUMENT_CONTENT',
}

// Getters
export const getters = <GetterTree<IState, RootState>>{
  getDocuments: (state) => state.documents,
  getDocument: (state) => state.document,
};

// Mutations
export const mutations = <MutationTree<IState>>{
  [MutationTypes.RESET_STATE](state: IState): void {
    Object.assign(state, initialState());
  },

  [MutationTypes.SET_DOCUMENTS](state: IState, payload: any): void {
    state.documents = payload;
  },  

  [MutationTypes.ADD_DOCUMENT](state: IState, payload: any): void {
    state.documents?.push(payload);
  },

  [MutationTypes.SET_DOCUMENT](state: IState, payload: any): void {
    state.document = payload;
  },

  [MutationTypes.UPDATE_DOCUMENT_CONTENT](state: IState, data: string): void {
    if(state.document) state.document.content = data;
  },

  [MutationTypes.UPDATE_DOCUMENT](state: IState, document: any): void {
    const index = state.documents?.findIndex(x => x.uid === document.uid);
    state!.documents[index] = document;
  },

};

// Actions
export const actions = <ActionTree<IState, RootState>>{
  async [ActionTypes.RESET_STATE]({ commit }) {
    commit(MutationTypes.RESET_STATE);
  },

  async [ActionTypes.FETCH_DOCUMENTS]({ commit }){
    await useQuery({ query: GET_ALL_DOCUMENTS })
          .then(payload => commit(MutationTypes.SET_DOCUMENTS, payload.data.value.documentAll));
  },

  async [ActionTypes.ADD_DOCUMENT]({ commit }, payload) {
    commit(MutationTypes.ADD_DOCUMENT, payload.data.createDocument);
  },

  async [ActionTypes.UPDATE_DOCUMENT]({ commit }, payload) {
    commit(MutationTypes.UPDATE_DOCUMENT, payload.data.updateDocument);
  },

  async [ActionTypes.UPDATE_DOCUMENT_CONTENT]({ commit }, data) {
    commit(MutationTypes.UPDATE_DOCUMENT_CONTENT, data);
  },

  async [ActionTypes.FETCH_DOCUMENT_BY_UID]({ commit }, uid){
    await urqlClient
    .query( GET_DOCUMENT_BY_UID, { uid })
    .toPromise()
    .then(result => commit(MutationTypes.SET_DOCUMENT, result.data.documentByUid))
  },


  // async [ActionTypes.SEARCH_CLIENTS]({ commit }, query: string){
  //   await urqlClient
  //     .query(SEARCH_CLIENTS, { queryString: query })
  //     .toPromise()
  //     .then(result => commit(MutationTypes.SET_CLIENTS_DIRECT, result.data.clientSearch))
  // },

};

// namespaced: true,
export const markdown = {
  state,
  mutations,
  actions,
  getters,
};
