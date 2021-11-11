import { useQuery } from '@urql/vue';
import { urqlClient } from '../../urql';
import { RootState } from '../state';
import { ActionTree, GetterTree, MutationTree } from 'vuex';
import { IDistrict, IProvince, ICountry } from '../../models/location'

import {
  GET_ALL_COUNTRIES,
  FILTER_PROVINCES_BY_COUNTRY,
  FILTER_DISTRICTS_BY_PROVINCE,
} from '../../graphql/admin.queries';


// state contract
export interface IState {
  confRoute: string;
  countries: ICountry[];
  provinces: IProvince[];
  districts: IDistrict[];
}

export const initialState = () => {
  return <IState>{
    confRoute: "",
    countries: [],
    provinces: [],
    districts: [],
  };
};

export const state: IState = initialState();

export enum MutationTypes {
  RESET_STATE = 'RESET_STATE',
  SET_CONF_ROUTE = 'SET_CONF_ROUTE',
  SET_COUNTRIES = 'SET_COUNTRIES',
  SET_PROVINCES = 'SET_PROVINCES',
  SET_DISTRICTS = 'SET_PROVINCES',  
  SET_DISTRICTS_DIRECT = 'SET_DISTRICTS_DIRECT',
  SET_PROVINCES_DIRECT = 'SET_PROVINCES_DIRECT', 
}

export enum ActionTypes {
  RESET_STATE = 'RESET_STATE',
  SET_CONF_ROUTE = 'SET_CONF_ROUTE',
  FETCH_COUNTRIES = 'FETCH_COUNTRIES',
  FETCH_PROVINCES = 'FETCH_PROVINCES',
  FETCH_DISTRICTS = 'FETCH_DISTRICTS',
  FILTER_DISTRICTS_BY_PROVINCE = 'FILTER_DISTRICTS_BY_PROVINCE',
  FILTER_PROVINCES_BY_COUNTRY = 'FILTER_PROVINCES_BY_COUNTRY'
}

// Getters
export const getters = <GetterTree<IState, RootState>>{
  getConfRoute: (state) => state.confRoute,
  getCountries: (state) => state.countries,
  getProvinces: (state) => state.provinces,
  getDistricts: (state) => state.districts,
};

// Mutations
export const mutations = <MutationTree<IState>>{
  [MutationTypes.RESET_STATE](state: IState): void {
    Object.assign(state, initialState());
  },

  [MutationTypes.SET_CONF_ROUTE](state: IState, val: string): void {
    state.confRoute = val;
  },

  [MutationTypes.SET_COUNTRIES](state: IState, countries: ICountry[]): void {
    state.countries = countries;
  },

  [MutationTypes.SET_PROVINCES_DIRECT](state: IState, payload: any[]): void {
    state.provinces = [];
    state.provinces = payload;
    state.districts = [];
  },

  [MutationTypes.SET_DISTRICTS_DIRECT](state: IState, payload: any[]): void {
    state.districts = [];
    state.districts = payload;
  },
};

// Actions
export const actions = <ActionTree<IState, RootState>>{
  async [ActionTypes.RESET_STATE]({ commit }) {
    commit(MutationTypes.RESET_STATE);
  },

  async [ActionTypes.SET_CONF_ROUTE]({ commit }, val: string) {
    commit(MutationTypes.SET_CONF_ROUTE, val);
  },

  async [ActionTypes.FETCH_COUNTRIES]({ commit }){
    await useQuery({ query: GET_ALL_COUNTRIES })
          .then(payload => commit(MutationTypes.SET_COUNTRIES, payload.data.value.countryAll));
  },

  async [ActionTypes.FILTER_PROVINCES_BY_COUNTRY]({ commit }, countryUid: string){
    await urqlClient
      .query(FILTER_PROVINCES_BY_COUNTRY, { uid: countryUid })
      .toPromise()
      .then(result => commit(MutationTypes.SET_PROVINCES_DIRECT, result.data.provincesByCountryUid))
  },

  async [ActionTypes.FILTER_DISTRICTS_BY_PROVINCE]({ commit }, provinceUid: string){
    await urqlClient
      .query(FILTER_DISTRICTS_BY_PROVINCE, { uid: provinceUid })
      .toPromise()
      .then(result => commit(MutationTypes.SET_DISTRICTS_DIRECT, result.data.districtsByProvinceUid))
  }
};

// namespaced: true,
export const admin = {
  state,
  mutations,
  actions,
  getters,
};