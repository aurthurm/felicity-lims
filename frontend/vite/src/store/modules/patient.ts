import { urqlClient } from '../../urql';
import { RootState } from '../state';
import { ActionTree, GetterTree, MutationTree } from 'vuex';

import { GET_ALL_PATIENTS, SEARCH_PATIENTS, GET_PATIENT_BY_UID } from '../../graphql/patient.queries';
import { addListsUnique } from '../../utils';
import { IPatient } from '../../models/patient'

// state contract
export interface IState {
  patients?: IPatient[];
  patient?: IPatient | null;
  patientCount?: number;
  patientPageInfo?: any
}

export const initialState = () => {
  return <IState>{
    patients: [],
    patient: null,
    patientCount: 0,
    patientPageInfo: null,
  };
};

export const state: IState = initialState();

export enum MutationTypes {
  RESET_STATE = 'RESET_STATE',
  CLEAR_PATIENT = 'CLEAR_PATIENT',
  SET_PATIENTS = 'SET_PATIENTS',
  SET_PATIENT = 'SET_PATIENT',
  DIRECT_SET_PATIENTS = 'DIRECT_SET_PATIENTS',

  ADD_PATIENT = 'ADD_PATIENT',
  UPDATE_PATIENT = "UPDATE_PATIENT"
}

export enum ActionTypes {
  RESET_STATE = 'RESET_STATE',
  CLEAR_PATIENT = 'CLEAR_PATIENT',
  FETCH_PATIENT_BY_UID = 'FETCH_PATIENT_BY_UID',
  FETCH_PATIENTS= 'FETCH_PATIENTS',
  SEARCH_PATIENTS= 'SEARCH_PATIENTS',
  ADD_PATIENT = 'ADD_PATIENT',
  UPDATE_PATIENT = "UPDATE_PATIENT"
}

// Getters
export const getters = <GetterTree<IState, RootState>>{
  getPatients: (state) => state.patients,
  getPatientByUid: (state) => (uid: number) => state.patients?.find(p => p.uid === uid),
  getPatient: (state) => state.patient,
  getPatientCount: (state) => state.patientCount,
  getPatientPageInfo: (state) => state.patientPageInfo,
};

// Mutations
export const mutations = <MutationTree<IState>>{
  [MutationTypes.RESET_STATE](state: IState): void {
    Object.assign(state, initialState());
  },

  [MutationTypes.SET_PATIENTS](state: IState, payload: any): void {
    const patients = payload.patients.items;
    if(payload.fromFilter){
      state.patients = [];
      state.patients = patients;
    } else {
      state.patients = addListsUnique(state.patients!, patients, "uid");
    }

    state.patientCount = payload.patients?.totalCount;
    state.patientPageInfo = payload.patients?.pageInfo;
  },

  [MutationTypes.DIRECT_SET_PATIENTS](state: IState, patients: IPatient[]): void {
    state.patients = [];
    state.patients = patients;
  },

  [MutationTypes.SET_PATIENT](state: IState, payload: IPatient): void {
    state.patient = payload;
  },

  [MutationTypes.ADD_PATIENT](state: IState, payload: IPatient): void {
    state.patients?.unshift(payload);
  },

  [MutationTypes.UPDATE_PATIENT](state: IState, payload: IPatient): void {
    const index = state.patients!.findIndex(x => x.uid === payload.uid);
    state.patients![index] = { ...state.patients![index], ...payload };
    state.patient = payload;
  },
};

// Actions
export const actions = <ActionTree<IState, RootState>>{

  async [ActionTypes.RESET_STATE]({ commit }) {
    commit(MutationTypes.RESET_STATE);
  },

  async [ActionTypes.ADD_PATIENT]({ commit }, payload: any){
    commit(MutationTypes.ADD_PATIENT, payload);
  },

  async [ActionTypes.UPDATE_PATIENT]({ commit }, payload: any){
    commit(MutationTypes.UPDATE_PATIENT, payload);
  },

  async [ActionTypes.FETCH_PATIENTS]({ commit }, params){
    await urqlClient
    .query( GET_ALL_PATIENTS, { first: params.first, after: params.after, text: params.text, sortBy: ["-uid"] })
    .toPromise()
    .then(result => commit(MutationTypes.SET_PATIENTS, {
      patients: result.data.patientAll,
      fromFilter: params.filterAction,
    }));
  },

  async [ActionTypes.FETCH_PATIENT_BY_UID]({ commit }, uid){
    await urqlClient
    .query( GET_PATIENT_BY_UID, { uid })
    .toPromise()
    .then(result => commit(MutationTypes.SET_PATIENT, result.data.patientByUid))
  },

  async [ActionTypes.SEARCH_PATIENTS]({ commit }, query: string){
    await urqlClient
      .query(SEARCH_PATIENTS, { queryString: query })
      .toPromise()
      .then(result => commit(MutationTypes.DIRECT_SET_PATIENTS, result.data.patientSearch))
  }

};

// namespaced: true,
export const patients = {
  state,
  mutations,
  actions,
  getters,
};
