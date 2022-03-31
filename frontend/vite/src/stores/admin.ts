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
  ADD_COUNTRY = 'ADD_COUNTRY',
  UPDATE_COUNTRY = 'UPDATE_COUNTRY',
  SET_PROVINCES = 'SET_PROVINCES',
  ADD_PROVINCE = 'ADD_PROVINCE',
  UPDATE_PROVINCE = 'UPDATE_PROVINCE',
  SET_DISTRICTS = 'SET_PROVINCES',  
  UPDATE_DISTRICT = 'UPDATE_DISTRICT',
  ADD_DISTRICT = 'ADD_DISTRICT',
  SET_DISTRICTS_DIRECT = 'SET_DISTRICTS_DIRECT',
  SET_PROVINCES_DIRECT = 'SET_PROVINCES_DIRECT', 
}

export enum ActionTypes {
  RESET_STATE = 'RESET_STATE',
  SET_CONF_ROUTE = 'SET_CONF_ROUTE',
  FETCH_COUNTRIES = 'FETCH_COUNTRIES',
  ADD_COUNTRY = 'ADD_COUNTRY',
  UPDATE_COUNTRY = 'UPDATE_COUNTRY',
  FETCH_PROVINCES = 'FETCH_PROVINCES',
  ADD_PROVINCE = 'ADD_PROVINCE',
  UPDATE_PROVINCE = 'UPDATE_PROVINCE',
  FETCH_DISTRICTS = 'FETCH_DISTRICTS',
  UPDATE_DISTRICT = 'UPDATE_DISTRICT',
  ADD_DISTRICT = 'ADD_DISTRICT',
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

  // COUNTRIES
  [MutationTypes.SET_COUNTRIES](state: IState, countries: ICountry[]): void {
    state.countries = countries;
  },

  [MutationTypes.ADD_COUNTRY](state: IState, country: ICountry): void {
    state.countries?.push(country);
  },

  [MutationTypes.UPDATE_COUNTRY](state: IState, country: ICountry): void {
    const index = state.countries?.findIndex(c => c?.uid === country?.uid);
    if(index > -1) {
      state.countries[index] = country
    }
  },

  // PROVINCES
  [MutationTypes.SET_PROVINCES_DIRECT](state: IState, payload: any[]): void {
    state.provinces = [];
    state.provinces = payload;
    state.districts = [];
  },

  [MutationTypes.ADD_PROVINCE](state: IState, province: IProvince): void {
    state.provinces?.push(province);
  },

  [MutationTypes.UPDATE_PROVINCE](state: IState, province: IProvince): void {
    const index = state.provinces?.findIndex(c => c?.uid === province?.uid);
    if(index > -1) {
      state.provinces[index] = province
    }
  },

  // DISTRICTS
  [MutationTypes.SET_DISTRICTS_DIRECT](state: IState, payload: any[]): void {
    state.districts = [];
    state.districts = payload;
  },

  [MutationTypes.ADD_DISTRICT](state: IState, district: IDistrict): void {
    state.districts?.push(district);
  },

  [MutationTypes.UPDATE_DISTRICT](state: IState, district: IDistrict): void {
    const index = state.districts?.findIndex(c => c?.uid === district?.uid);
    if(index > -1) {
      state.districts[index] = district
    }
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

  // COUNTRIES
  async [ActionTypes.FETCH_COUNTRIES]({ commit }){
    await useQuery({ query: GET_ALL_COUNTRIES })
          .then(payload => commit(MutationTypes.SET_COUNTRIES, payload.data.value.countryAll));
  },

  async [ActionTypes.ADD_COUNTRY]({ commit }, country: ICountry) {
    commit(MutationTypes.ADD_COUNTRY, country);
  },

  async [ActionTypes.UPDATE_COUNTRY]({ commit }, country: ICountry) {
    commit(MutationTypes.UPDATE_COUNTRY, country);
  },

  // PROVINCES
  async [ActionTypes.FILTER_PROVINCES_BY_COUNTRY]({ commit }, countryUid: string){
    await urqlClient
      .query(FILTER_PROVINCES_BY_COUNTRY, { uid: countryUid })
      .toPromise()
      .then(result => commit(MutationTypes.SET_PROVINCES_DIRECT, result.data.provincesByCountryUid))
  },

  async [ActionTypes.ADD_PROVINCE]({ commit }, province: IProvince) {
    commit(MutationTypes.ADD_PROVINCE, province);
  },

  async [ActionTypes.UPDATE_PROVINCE]({ commit }, province: IProvince) {
    commit(MutationTypes.UPDATE_PROVINCE, province);
  },

  // DISTRICT
  async [ActionTypes.FILTER_DISTRICTS_BY_PROVINCE]({ commit }, provinceUid: string){
    await urqlClient
      .query(FILTER_DISTRICTS_BY_PROVINCE, { uid: provinceUid })
      .toPromise()
      .then(result => commit(MutationTypes.SET_DISTRICTS_DIRECT, result.data.districtsByProvinceUid))
  },

  async [ActionTypes.ADD_DISTRICT]({ commit }, district: IDistrict) {
    commit(MutationTypes.ADD_DISTRICT, district);
  },

  async [ActionTypes.UPDATE_DISTRICT]({ commit }, district: IDistrict) {
    commit(MutationTypes.UPDATE_DISTRICT, district);
  },
};

// namespaced: true,
export const admin = {
  state,
  mutations,
  actions,
  getters,
};