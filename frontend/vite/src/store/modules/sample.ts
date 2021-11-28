import { useQuery } from '@urql/vue';
import { urqlClient } from '../../urql';
import { RootState } from '../state';
import { parseEdgeNodeToList, addListsUnique } from '../../utils'
import { ActionTree, GetterTree, MutationTree } from 'vuex';

import {
  GET_ALL_SAMPLE_TYPES, 
  GET_ALL_SAMPLES,
  GET_ANALYSIS_REQUESTS_BY_PATIENT_UID,
  GET_ANALYSIS_REQUESTS_BY_CLIENT_UID,
  GET_ANALYSIS_RESULTS_BY_SAMPLE_UID,
  GET_ALL_QC_SETS, GET_QC_SET_BY_UID,
  GET_SAMPLE_STATUS_BY_UID
} from '../../graphql/analyses.queries';
import { IAnalysisRequest, ISampleType, ISample, IAnalysisResult, IQCSet } from '../../models/analysis';

// state contract
export interface IState {
  sampleTypes: ISampleType[];
  samples: ISample[];
  sampleCount: number;
  samplePageInfo: any;
  sample: ISample | null;
  analysisRequests: IAnalysisRequest[];
  analysisResults: IAnalysisResult[];
  qcSets: IQCSet[];
  qcSet: IQCSet | null;
  qcSetCount: number;
  qcSetPageInfo: any;
}

export const initialState = () => {
  return <IState>{
    sampleTypes: [],
    samples: [],
    sampleCount: 0,
    samplePageInfo: null,
    sample: null,
    analysisRequests: [], // for patient detail
    analysisResults: [],
    qcSets: [],
    qcSet: null,
    qcSetCount: 0,
    qcSetPageInfo: null,
  };
};

export const state: IState = initialState();

export enum MutationTypes {
  RESET_STATE = 'RESET_STATE',

  SET_SAMPLE_TYPES = 'SET_SAMPLE_TYPES',
  ADD_SAMPLE_TYPE = 'ADD_SAMPLE_TYPE',
  UPDATE_SAMPLE_TYPE = 'UPDATE_SAMPLE_TYPE',

  RESET_SAMPLES = "RESET_SAMPLES",
  SET_SAMPLES = 'SET_SAMPLES',
  SET_SAMPLE = 'SET_SAMPLE',
  UPDATE_SAMPLE_STATUS = 'UPDATE_SAMPLE_STATUS',

  SET_ANALYSES_REQUESTS = 'SET_ANALYSES_REQUESTS',

  SET_ANALYSES_RESULTS = 'SET_ANALYSES_RESULTS',
  UPDATE_ANALYSIS_RESULTS = 'UPDATE_ANALYSIS_RESULTS',
  UPDATE_ANALYSIS_RESULTS_STATUS = 'UPDATE_ANALYSIS_RESULTS_STATUS',

  SET_QC_SETS = 'FETCH_QC_SETS',
  SET_QC_SET = 'FETCH_QC_SET',
  RESET_QC_SET = 'RESET_QC_SET',
}

export enum ActionTypes {
  RESET_STATE = 'RESET_STATE',

  FETCH_SAMPLE_TYPES = 'FETCH_SAMPLE_TYPES',
  ADD_SAMPLE_TYPE = 'ADD_SAMPLE_TYPE',
  UPDATE_SAMPLE_TYPE = 'UPDATE_SAMPLE_TYPE',

  RESET_SAMPLES = "RESET_SAMPLES",
  FETCH_SAMPLES = 'FETCH_SAMPLES',
  ADD_SAMPLES = 'ADD_SAMPLES',

  FETCH_SAMPLE_STATUS = 'FETCH_SAMPLE_STATUS',

  FETCH_ANALYSIS_REQUESTS_FOR_PATIENT = 'FETCH_ANALYSIS_REQUESTS_FOR_PATIENT',
  FETCH_ANALYSIS_REQUESTS_FOR_CLIENT = 'FETCH_ANALYSIS_REQUESTS_FOR_CLIENT',

  FETCH_ANALYSIS_RESULTS_FOR_SAMPLE = 'FETCH_ANALYSIS_RESULTS_FOR_SAMPLE',
  UPDATE_ANALYSIS_RESULTS = 'UPDATE_ANALYSIS_RESULTS',
  UPDATE_ANALYSIS_RESULTS_STATUS = 'UPDATE_ANALYSIS_RESULTS_STATUS',

  FETCH_QC_SETS = 'FETCH_QC_SETS',
  FETCH_QC_SET_BY_UID = 'FETCH_QC_SET_BY_UID',
  ADD_QC_SETS = 'ADD_QC_SETS',
  RESET_QC_SET = 'RESET_QC_SET',
  
}

function sortAnalysisRequests(ars: IAnalysisRequest[]): IAnalysisRequest[] {
  ars = ars?.sort((a: IAnalysisRequest, b: IAnalysisRequest) => (a?.createdAt || 0) < (b?.createdAt || 1) ? 1 : -1);
  return ars;
}

function sortResults(results: IAnalysisResult[]): IAnalysisResult[] {
  results = results?.sort((a: IAnalysisResult, b: IAnalysisResult) => {
    if(a?.analysisUid === b?.analysisUid) {
      return (a?.uid || 0) > (b?.uid || 0) ? 1 : -1;
    }
    return (a?.analysis?.sortKey || 0) > (b?.analysis?.sortKey || 1) ? 1 : -1;
  });
  return results;
}


// Getters
export const getters = <GetterTree<IState, RootState>>{
  getSampleTypes: (state) => state.sampleTypes,
  getSampleTypeByName: (state) => (name: string) => state.sampleTypes?.find(st => st.name?.toString().toLowerCase().trim() === name.toString().toLowerCase().trim()),
  getSamples: (state) => state.samples,
  getSampleCount: (state) => state.sampleCount,
  getSamplePageInfo: (state) => state.samplePageInfo,
  getSample: (state) => state.sample,
  getAnalysisRequests: (state) => state.analysisRequests,
  getAnalysisResults: (state) => state.analysisResults,
  getQCSets: (state) => state.qcSets,
  getQCSet: (state) => state.qcSet,
  getQCSetCount: (state) => state.qcSetCount,
  getQCSetPageInfo: (state) => state.qcSetPageInfo,
};


// Mutations
export const mutations = <MutationTree<IState>>{
  [MutationTypes.RESET_STATE](state: IState): void {
    Object.assign(state, initialState());
  },

  // SAMPLE TYPES
  [MutationTypes.SET_SAMPLE_TYPES](state: IState, sampleTypes: any[]): void {
    state.sampleTypes = sampleTypes;
  },

  [MutationTypes.UPDATE_SAMPLE_TYPE](state: IState, payload: ISampleType): void {
    const index = state.sampleTypes.findIndex(x => x.uid === payload.uid);
    state!.sampleTypes[index] = payload;
  },

  [MutationTypes.ADD_SAMPLE_TYPE](state: IState, payload: ISampleType): void {
    state.sampleTypes.push(payload);
  },

  // SAMPLES
  [MutationTypes.RESET_SAMPLES](state: IState): void {
    state.samples = [];
  },
  
  [MutationTypes.SET_SAMPLES](state: IState, payload: any): void {
    const samples = payload.samples.items;

    if(payload.fromFilter){
      state.samples = samples;
    } else {
      state.samples = addListsUnique(state.samples, samples, "uid");
    }

    state.sampleCount = payload.samples?.totalCount;
    state.samplePageInfo = payload.samples?.pageInfo;
  },

  [MutationTypes.UPDATE_SAMPLE_STATUS](state: IState, sample: ISample): void {

    console.log("updating sample status: ", sample)

    if(state.sample && sample.status){
      state.sample.status = sample.status;
    }
    // also update sample listing
    const index = state.samples.findIndex(x => x.uid === sample.uid);
    if(index > -1) {
      state!.samples[index].status = sample.status;
    }
  },

  [MutationTypes.SET_SAMPLE](state: IState, payload: any): void {
    let sample = payload;
    sample.analyses = parseEdgeNodeToList(sample?.analyses) || [];
    sample.profiles = parseEdgeNodeToList(sample?.profiles) || [];
    state.sample = sample;
  },


  [MutationTypes.SET_ANALYSES_REQUESTS](state: IState, requests: IAnalysisRequest[]): void {
    state.analysisRequests = sortAnalysisRequests(requests);
  },

  [MutationTypes.SET_ANALYSES_RESULTS](state: IState, results: IAnalysisResult[]): void {
    state.analysisResults = sortResults(results);
  },

  [MutationTypes.UPDATE_ANALYSIS_RESULTS](state: IState, payload: IAnalysisResult[]): void {
    payload?.forEach(result => {
      const index = state.analysisResults.findIndex(x => x.uid === result.uid);
      if(index > -1) {
        state!.analysisResults[index] = result;
      } else {
        state!.analysisResults.push(result);
      }
    })
  },

  [MutationTypes.UPDATE_ANALYSIS_RESULTS_STATUS](state: IState, payload: any[]): void {
    payload?.forEach(result => {
      const index = state.analysisResults.findIndex(x => x.uid === result.uid);
      if(index > -1) {
        state!.analysisResults[index].status = result.status;
      }
    })
  },

  // QC SETS
  [MutationTypes.RESET_QC_SET](state: IState): void {
    state.qcSet = null;
  },

  [MutationTypes.SET_QC_SETS](state: IState, payload: any): void {
    const qcSets = payload.qcSets.items;

    if(payload.fromFilter){
      state.qcSets = [];
      state.qcSets = qcSets;
    } else {
      state.qcSets = addListsUnique(state.qcSets, qcSets, "uid");
    }

    state.qcSetCount = payload.qcSets?.totalCount;
    state.qcSetPageInfo = payload.qcSets?.pageInfo;
  },

  [MutationTypes.SET_QC_SET](state: IState, qcSet: any): void {
    state.qcSet = qcSet;
  },

};

// Actions
export const actions = <ActionTree<IState, RootState>>{
  async [ActionTypes.RESET_STATE]({ commit }) {
    commit(MutationTypes.RESET_STATE);
  },

  // SAMPLE TYPES
  async [ActionTypes.FETCH_SAMPLE_TYPES]({ commit }){
    await useQuery({ query: GET_ALL_SAMPLE_TYPES })
          .then(payload => commit(MutationTypes.SET_SAMPLE_TYPES, payload.data.value.sampleTypeAll));
  },

  async [ActionTypes.UPDATE_SAMPLE_TYPE]({ commit }, payload ){
    commit(MutationTypes.UPDATE_SAMPLE_TYPE, payload.data.updateSampleType);
  },

  async [ActionTypes.ADD_SAMPLE_TYPE]({ commit }, payload ){
    commit(MutationTypes.ADD_SAMPLE_TYPE, payload.data.createSampleType);
  },

  // SAMPLES
  async [ActionTypes.RESET_SAMPLES]({ commit }) {
    commit(MutationTypes.RESET_SAMPLES);
  },

  async [ActionTypes.FETCH_SAMPLES]({ commit }, params){
    await urqlClient
    .query( GET_ALL_SAMPLES, { 
      first: params.first, after: params.after, 
      status: params.status, text: params.text, clientUid: params.clientUid, sortBy: params.sortBy })
    .toPromise()
    .then(result => {
      commit(MutationTypes.SET_SAMPLES, {
        samples: result.data.sampleAll,
        fromFilter: params.filterAction,
      });
    })
  },


  async [ActionTypes.ADD_SAMPLES]({ commit }, payload){
    commit(MutationTypes.SET_SAMPLES, payload.data.createAnalysisRequest.samples);
  },

  async [ActionTypes.FETCH_SAMPLE_STATUS]({ commit }, uid){
    if(!uid) return;
    await urqlClient
    .query( GET_SAMPLE_STATUS_BY_UID, { uid }, { requestPolicy:'network-only' })
    .toPromise()
    .then(result => {
      commit(MutationTypes.UPDATE_SAMPLE_STATUS, result.data.sampleByUid);
    })
  },

  async [ActionTypes.FETCH_ANALYSIS_REQUESTS_FOR_PATIENT]({ commit }, uid){
    if(!uid) return;
    await urqlClient
    .query( GET_ANALYSIS_REQUESTS_BY_PATIENT_UID, { uid })
    .toPromise()
    .then(result => commit(MutationTypes.SET_ANALYSES_REQUESTS, result.data.analysisRequestsByPatientUid))
  },

  async [ActionTypes.FETCH_ANALYSIS_REQUESTS_FOR_CLIENT]({ commit }, uid){
    if(!uid) return;
    await urqlClient
    .query( GET_ANALYSIS_REQUESTS_BY_CLIENT_UID, { uid })
    .toPromise()
    .then(result => commit(MutationTypes.SET_ANALYSES_REQUESTS, result.data.analysisRequestsByClientUid))
  },

  async [ActionTypes.FETCH_ANALYSIS_RESULTS_FOR_SAMPLE]({ commit }, uid){
    if(!uid) return;
    await urqlClient
    .query( GET_ANALYSIS_RESULTS_BY_SAMPLE_UID, { uid })
    .toPromise()
    .then(result => {
      commit(MutationTypes.SET_ANALYSES_RESULTS, result.data.analysisResultBySampleUid);
      commit(MutationTypes.SET_SAMPLE, result.data.sampleByUid);
    })
  },

  async [ActionTypes.UPDATE_ANALYSIS_RESULTS]({ commit }, results: IAnalysisResult[]){
    commit(MutationTypes.UPDATE_ANALYSIS_RESULTS, results);
  },

  async [ActionTypes.UPDATE_ANALYSIS_RESULTS_STATUS]({ commit }, results: any[]){
    commit(MutationTypes.UPDATE_ANALYSIS_RESULTS_STATUS, results);
  },

  // QC SETS
  async [ActionTypes.RESET_QC_SET]({ commit }){
    commit(MutationTypes.RESET_QC_SET);
  },

  async [ActionTypes.FETCH_QC_SETS]({ commit }, params){
    await urqlClient
    .query( GET_ALL_QC_SETS, { first: params.first, after: params.after, text: params.text, sortBy: params.sortBy})
    .toPromise()
    .then(result => {
      commit(MutationTypes.SET_QC_SETS, {
        qcSets: result.data.qcSetAll,
        fromFilter: params.filterAction,
      });
    })
  },  
  
  async [ActionTypes.FETCH_QC_SET_BY_UID]({ commit }, uid){
    if(!uid) return;
    await urqlClient
    .query( GET_QC_SET_BY_UID, { uid })
    .toPromise()
    .then(result => {
      commit(MutationTypes.SET_QC_SET, result.data.qcSetByUid);
    })
  },

  async [ActionTypes.ADD_QC_SETS]({ commit }, payload){
    commit(MutationTypes.SET_QC_SETS, payload.data.createQcSet);
  },

};

// namespaced: true,
export const samples = {
  state,
  mutations,
  actions,
  getters,
};