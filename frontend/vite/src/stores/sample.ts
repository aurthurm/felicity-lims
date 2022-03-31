import { defineStore } from 'pinia'
import { parseEdgeNodeToList, addListsUnique } from '../utils'

import {
  GET_ALL_SAMPLE_TYPES, 
  GET_ALL_SAMPLES,
  GET_ANALYSIS_REQUESTS_BY_PATIENT_UID,
  GET_ANALYSIS_REQUESTS_BY_CLIENT_UID,
  GET_ANALYSIS_RESULTS_BY_SAMPLE_UID,
  GET_ALL_QC_SETS, GET_QC_SET_BY_UID,
  GET_SAMPLE_STATUS_BY_UID
} from '../graphql/analyses.queries';
import { IAnalysisRequest, ISampleType, ISample, IAnalysisResult, IQCSet } from '../models/analysis';

import useApiUtil from '../modules/api_util'

const { withUseQuery } = useApiUtil()


export const useSampleStore = defineStore('sample', {
  state: () => {
      return {
        sampleTypes: [],
        samples: [],
        sampleCount: 0,
        samplePageInfo: undefined,
        sample: undefined,
        analysisRequests: [], // for patient detail
        analysisResults: [],
        qcSets: [],
        qcSet: undefined,
        qcSetCount: 0,
        qcSetPageInfo: undefined,
      } as {
        sampleTypes: ISampleType[];
        samples: ISample[];
        sampleCount: number;
        samplePageInfo?: any;
        sample?: ISample;
        analysisRequests: IAnalysisRequest[];
        analysisResults: IAnalysisResult[];
        qcSets: IQCSet[];
        qcSet?: IQCSet | null;
        qcSetCount: number;
        qcSetPageInfo: any;
      }
  },
  getters: {
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
  },
  actions: {
    
  // SAMPLE TYPES
  async fetchSampleTypes(){
    await withUseQuery(GET_ALL_SAMPLE_TYPES, {}, "sampleTypeAll")
          .then(payload => this.sampleTypes = payload);
  },
  updateSampleType(payload){
    const index = this.sampleTypes.findIndex(item => item.uid === payload?.uid)
    if(index > -1) this.sampleTypes[index] = payload
  },
  addSampleType(payload ){
    this.sampleTypes.unshift(payload);
  },

  // SAMPLES
  resetSamples() {
    this.samples = [];
  },
  resetSample({ commit }) {
    this.sample = undefined;
  },
  async fetchSamples(params){
    await withUseQuery(GET_ALL_SAMPLES, params, undefined)
    .then(payload => {
      const page = payload.sampleAll
      const samples = page.items;

      if(params.filterAction){
        this.samples = samples;
      } else {
        this.samples = addListsUnique(this.samples, samples, "uid");
      }
  
      this.sampleCount = payload.samples?.totalCount;
      this.samplePageInfo = payload.samples?.pageInfo;
    })
  },
  addSamples(samples){
    this.samples = addListsUnique(this.samples, samples, "uid");
  }, 
  updateSampleStatus(sample){
    const index = this.samples.findIndex(x => x.uid === sample.uid);
    if(index > -1) {
      this.samples[index].status = sample.status;
    }
  },
  async fetchSampleStatus(uid){
    await withUseQuery(GET_SAMPLE_STATUS_BY_UID, { uid }, "sampleByUid", 'network-only')
    .then(payload => {
      if(this.sample && payload.status){
        this.sample.status = payload.status;
      }
      // also update sample listing
      this.updateSampleStatus(payload)
    })
  }, 
  updateSamplesStatus(samples){
    samples?.forEach(sample => this.updateSampleStatus(sample))
  },

    // analysis request
  async fetchAnalysisRequestsForPatient(uid){
    await withUseQuery(GET_ANALYSIS_REQUESTS_BY_PATIENT_UID, { uid }, "analysisRequestsByPatientUid")
    .then(payload => this.analysisRequests = sortAnalysisRequests(payload))
  },
  async fetchAnalysisRequestsForClient(uid){
    await withUseQuery(GET_ANALYSIS_REQUESTS_BY_CLIENT_UID, { uid }, "analysisRequestsByClientUid")
    .then(payload => this.analysisRequests = sortAnalysisRequests(payload))
  },
  addAnalysisRequest(payload){
    this.analysisRequests.unshift(payload)
  },

  // analysis results
  async fetchAnalysisResultsForSample(uid){
    if(!uid) return;
    await withUseQuery( GET_ANALYSIS_RESULTS_BY_SAMPLE_UID, { uid }, undefined, 'network-only')
    .then(payload => {
      this.analysisResults = sortResults(payload.analysisResultBySampleUid)

      const sample = payload.sampleByUid;
      sample.analyses = parseEdgeNodeToList(sample?.analyses) || [];
      sample.profiles = parseEdgeNodeToList(sample?.profiles) || [];
      this.sample = sample;
    })
  },
  updateAnalysesResults(payload: IAnalysisResult[]){
    payload?.forEach(result => {
      const index = this.analysisResults.findIndex(x => x.uid === result.uid);
      if(index > -1) {
        this.analysisResults[index] = result;
      } else {
        this.analysisResults.push(result);
      }
    })
  },
  updateAnalysesResultsStatus(payload: any[]){
    payload?.forEach(result => {
      const index = this.analysisResults.findIndex(x => x.uid === result.uid);
      if(index > -1) {
        this.analysisResults[index].status = result.status;
      }
    })
  },

  // QC SETS
  resetQCSets(){
    this.qcSet = undefined;
  },
  async fetchQCSets(params){
    await withUseQuery(GET_ALL_QC_SETS, params, undefined)
          .then(payload => {
            const qcSets = payload.qcSetAll.items;

            if(params.filterAction){
              this.qcSets = [];
              this.qcSets = qcSets;
            } else {
              this.qcSets = addListsUnique(this.qcSets, qcSets, "uid");
            }
        
            this.qcSetCount = payload.qcSets?.totalCount;
            this.qcSetPageInfo = payload.qcSets?.pageInfo;
          })
  },
  async fetchQCSetByUid(uid){
    await withUseQuery(GET_QC_SET_BY_UID, { uid }, "qcSetByUid")
    .then(payload => this.qcSet = payload)
  },
  addQCSet(payload){
    this.qcSets = addListsUnique(this.qcSets, payload, "uid");
  },
  
  }
})

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
