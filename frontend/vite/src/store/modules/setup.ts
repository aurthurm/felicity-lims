import { useQuery } from '@urql/vue';
import { RootState } from '../state';
import { ActionTree, GetterTree, MutationTree } from 'vuex';

import {
  GET_ALL_SUPPLIERS,
  GET_ALL_MANUFACTURERS,
  GET_ALL_METHODS,
  GET_ALL_INSTRUMENT_TYPES,
  GET_ALL_INSTRUMENTS,
} from '../../graphql/instrument.queries';
import {IInstrument, IInstrumentType, IManufacturer, IMethod, ISupplier} from '../../models/setup'

// state contract
export interface IState {
  suppliers: ISupplier[];
  manufacturers: IManufacturer[];
  instrumentTypes: IInstrumentType[];
  instruments: IInstrument[];
  methods: IMethod[];
}

export const initialState = () => {
  return <IState>{
    suppliers: [],
    manufacturers: [],
    instrumentTypes: [],
    instruments: [],
    methods: [],
  };
};

export const state: IState = initialState();

export enum MutationTypes {
  RESET_STATE = 'RESET_STATE',

  SET_SUPPLIERS = 'SET_SUPPLIERS',
  ADD_SUPPLIER = 'ADD_SUPPLIER',
  UPDATE_SUPPLIER = 'UPDATE_SUPPLIER',

  SET_MANUFACTURERS = 'SET_MANUFACTURERS',
  ADD_MANUFACTURER = 'ADD_MANUFACTURER',
  UPDATE_MANUFACTURER = 'UPDATE_MANUFACTURER',

  SET_INSTRUMENTS = 'SET_INSTRUMENTS',
  ADD_INSTRUMENT = 'ADD_INSTRUMENT',
  UPDATE_INSTRUMENT = 'UPDATE_INSTRUMENT',

  SET_INSTRUMENT_TYPES = 'SET_INSTRUMENT_TYPES',
  ADD_INSTRUMENT_TYPE = 'ADD_INSTRUMENT_TYPE',
  UPDATE_INSTRUMENT_TYPE = 'UPDATE_INSTRUMENT_TYPE',

  SET_METHODS = 'SET_METHODS',
  ADD_METHOD = 'ADD_METHOD',
  UPDATE_METHOD = 'UPDATE_METHOD',
}

export enum ActionTypes {
  RESET_STATE = 'RESET_STATE',

  FETCH_SUPPLIERS = 'FETCH_SUPPLIERS',
  ADD_SUPPLIER = 'ADD_SUPPLIER',
  UPDATE_SUPPLIER = 'UPDATE_SUPPLIER',

  FETCH_MANUFACTURERS = 'FETCH_MANUFACTURERS',
  ADD_MANUFACTURER = 'ADD_MANUFACTURER',
  UPDATE_MANUFACTURER = 'UPDATE_MANUFACTURER',

  FETCH_INSTRUMENTS = 'FETCH_INSTRUMENTS',
  ADD_INSTRUMENT = 'ADD_INSTRUMENT',
  UPDATE_INSTRUMENT = 'UPDATE_INSTRUMENT',

  FETCH_INSTRUMENT_TYPES = 'FETCH_INSTRUMENT_TYPES',
  ADD_INSTRUMENT_TYPE = 'ADD_INSTRUMENT_TYPE',
  UPDATE_INSTRUMENT_TYPE = 'UPDATE_INSTRUMENT_TYPE',

  FETCH_METHODS = 'FETCH_METHODS',
  ADD_METHOD = 'ADD_METHOD',
  UPDATE_METHOD = 'UPDATE_METHOD',
}

// Getters
export const getters = <GetterTree<IState, RootState>>{
  getSuppliers: (state) => state.suppliers,
  getManufacturers: (state) => state.manufacturers,
  getInstrumentTypes: (state) => state.instrumentTypes,
  getInstruments: (state) => state.instruments,
  getMethods: (state) => state.methods,
};

// Mutations
export const mutations = <MutationTree<IState>>{
  [MutationTypes.RESET_STATE](state: IState): void {
    Object.assign(state, initialState());
  },

  // SUPPLIERS
  [MutationTypes.SET_SUPPLIERS](state: IState, payload: any): void {
    state.suppliers = payload;
  },

  [MutationTypes.UPDATE_SUPPLIER](state: IState, payload: IInstrumentType): void {
    const index = state.suppliers.findIndex(x => x.uid === payload.uid);
    state!.suppliers[index] = payload;
  },

  [MutationTypes.ADD_SUPPLIER](state: IState, payload: IInstrumentType): void {
    state.suppliers.push(payload);
  },

  // MANUFACTURERS
  [MutationTypes.SET_MANUFACTURERS](state: IState, payload: any): void {
    state.manufacturers = payload;
  },

  [MutationTypes.UPDATE_MANUFACTURER](state: IState, payload: IInstrumentType): void {
    const index = state.manufacturers.findIndex(x => x.uid === payload.uid);
    state!.manufacturers[index] = payload;
  },

  [MutationTypes.ADD_MANUFACTURER](state: IState, payload: IInstrumentType): void {
    state.manufacturers.push(payload);
  },

  // INSTRUMENT TYPES
  [MutationTypes.SET_INSTRUMENT_TYPES](state: IState, payload: any): void {
    state.instrumentTypes = payload?.items;
  },

  [MutationTypes.UPDATE_INSTRUMENT_TYPE](state: IState, payload: IInstrumentType): void {
    const index = state.instrumentTypes.findIndex(x => x.uid === payload.uid);
    state!.instrumentTypes[index] = payload;
  },

  [MutationTypes.ADD_INSTRUMENT_TYPE](state: IState, payload: IInstrumentType): void {
    state.instrumentTypes.push(payload);
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
  
  // SUPPLIERS
  async [ActionTypes.FETCH_SUPPLIERS]({ commit }){
    await useQuery({ query: GET_ALL_SUPPLIERS })
          .then(payload => commit(MutationTypes.SET_SUPPLIERS, payload.data.value.supplierAll));
  },

  async [ActionTypes.ADD_SUPPLIER]({ commit }, payload){
    commit(MutationTypes.ADD_SUPPLIER, payload.data.createSupplier);
  },

  async [ActionTypes.UPDATE_SUPPLIER]({ commit }, payload){
    commit(MutationTypes.UPDATE_SUPPLIER, payload.data.updateSupplier);
  },
  
  // MAUFACTURERS
  async [ActionTypes.FETCH_MANUFACTURERS]({ commit }){
    await useQuery({ query: GET_ALL_MANUFACTURERS })
          .then(payload => commit(MutationTypes.SET_MANUFACTURERS, payload.data.value.manufacturerAll));
  },

  async [ActionTypes.ADD_MANUFACTURER]({ commit }, payload){
    commit(MutationTypes.ADD_MANUFACTURER, payload.data.createManufacturer);
  },

  async [ActionTypes.UPDATE_MANUFACTURER]({ commit }, payload){
    commit(MutationTypes.UPDATE_MANUFACTURER, payload.data.updateManufacturer);
  },
  
  // INSTRUMENT TYpes
  async [ActionTypes.FETCH_INSTRUMENT_TYPES]({ commit }){
    await useQuery({ query: GET_ALL_INSTRUMENT_TYPES })
          .then(payload => commit(MutationTypes.SET_INSTRUMENT_TYPES, payload.data.value.instrumentTypeAll));
  },

  async [ActionTypes.ADD_INSTRUMENT_TYPE]({ commit }, payload){
    commit(MutationTypes.ADD_INSTRUMENT_TYPE, payload.data.createInstrumentType);
  },

  async [ActionTypes.UPDATE_INSTRUMENT_TYPE]({ commit }, payload){
    commit(MutationTypes.UPDATE_INSTRUMENT_TYPE, payload.data.updateInstrumentType);
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