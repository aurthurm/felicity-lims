import { useQuery } from '@urql/vue';
import { RootState } from '../state';
import { ActionTree, GetterTree, MutationTree } from 'vuex';

import {
  GET_ALL_METHODS,
  GET_ALL_INSTRUMENTS,
} from '../../graphql/instrument.queries';
import {IInstrument, IMethod} from '../../models/setup'

// state contract
export interface IState {
  instruments: IInstrument[];
  methods: IMethod[];
}

export const initialState = () => {
  return <IState>{
    instruments: [],
    methods: [],
  };
};

export const state: IState = initialState();

export enum MutationTypes {
  RESET_STATE = 'RESET_STATE',

  SET_INSTRUMENTS = 'SET_INSTRUMENTS',
  ADD_INSTRUMENT = 'ADD_INSTRUMENT',
  UPDATE_INSTRUMENT = 'UPDATE_INSTRUMENT',

  SET_METHODS = 'SET_METHODS',
  ADD_METHOD = 'ADD_METHOD',
  UPDATE_METHOD = 'UPDATE_METHOD',
}

export enum ActionTypes {
  RESET_STATE = 'RESET_STATE',

  FETCH_INSTRUMENTS = 'FETCH_INSTRUMENTS',
  ADD_INSTRUMENT = 'ADD_INSTRUMENT',
  UPDATE_INSTRUMENT = 'UPDATE_INSTRUMENT',

  FETCH_METHODS = 'FETCH_METHODS',
  ADD_METHOD = 'ADD_METHOD',
  UPDATE_METHOD = 'UPDATE_METHOD',
}

// Getters
export const getters = <GetterTree<IState, RootState>>{
  getInstruments: (state) => state.instruments,
  getMethods: (state) => state.methods,
};

// Mutations
export const mutations = <MutationTree<IState>>{
  [MutationTypes.RESET_STATE](state: IState): void {
    Object.assign(state, initialState());
  },


  // INSTRUMENTS
  [MutationTypes.SET_INSTRUMENTS](state: IState, payload: any): void {
    state.instruments = payload?.items;
  },

  [MutationTypes.UPDATE_INSTRUMENT](state: IState, payload: IInstrument): void {
    const index = state.instruments.findIndex(x => x.uid === payload.uid);
    state!.instruments[index] = payload;
  },

  [MutationTypes.ADD_INSTRUMENT](state: IState, payload: IInstrument): void {
    state.instruments.push(payload);
  },

  // METHODS
  [MutationTypes.SET_METHODS](state: IState, payload: any): void {
    state.methods = payload?.items;
  },

  [MutationTypes.UPDATE_METHOD](state: IState, payload: IMethod): void {
    const index = state.methods.findIndex(x => x.uid === payload.uid);
    state!.methods[index] = payload;
  },

  [MutationTypes.ADD_METHOD](state: IState, payload: IMethod): void {
    state.methods.push(payload);
  },


};

// Actions
export const actions = <ActionTree<IState, RootState>>{
  async [ActionTypes.RESET_STATE]({ commit }) {
    commit(MutationTypes.RESET_STATE);
  },


  // INSTRUMENTS
  async [ActionTypes.FETCH_INSTRUMENTS]({ commit }){
    await useQuery({ query: GET_ALL_INSTRUMENTS })
          .then(payload => commit(MutationTypes.SET_INSTRUMENTS, payload.data.value.instrumentAll));
  },

  async [ActionTypes.ADD_INSTRUMENT]({ commit }, payload){
    commit(MutationTypes.ADD_INSTRUMENT, payload.data.createInstrument);
  },

  async [ActionTypes.UPDATE_INSTRUMENT]({ commit }, payload){
    commit(MutationTypes.UPDATE_INSTRUMENT, payload.data.updateInstrument);
  },

  // METHODS
  async [ActionTypes.FETCH_METHODS]({ commit }){
    await useQuery({ query: GET_ALL_METHODS })
          .then(payload => commit(MutationTypes.SET_METHODS, payload.data.value.methodAll));
  },

  async [ActionTypes.ADD_METHOD]({ commit }, payload){
    commit(MutationTypes.ADD_METHOD, payload.data.createMethod);
  },

  async [ActionTypes.UPDATE_METHOD]({ commit }, payload){
    commit(MutationTypes.UPDATE_METHOD, payload.data.updateMethod);
  },

};

// namespaced: true,
export const setup = {
  state,
  mutations,
  actions,
  getters,
};