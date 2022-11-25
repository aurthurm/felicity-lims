import { defineStore } from 'pinia'
import { parseEdgeNodeToList, addListsUnique } from '../utils'

import {
  GET_ALL_SAMPLE_TYPES, 
  GET_ALL_SAMPLES,
  GET_ANALYSIS_REQUESTS_BY_PATIENT_UID,
  GET_ANALYSIS_REQUESTS_BY_CLIENT_UID,
  GET_ANALYSIS_RESULTS_BY_SAMPLE_UID,
  GET_ALL_QC_SETS, GET_QC_SET_BY_UID,
  GET_SAMPLE_BY_UID,
  GET_SAMPLE_STATUS_BY_UID,
  GET_SAMPLE_BY_PARENT_ID
} from '../graphql/analyses.queries';
import { IAnalysisRequest, ISampleType, ISample, IAnalysisResult, IQCSet } from '../models/analysis';

import useApiUtil from '../composables/api_util'

const { withClientQuery } = useApiUtil()


export const useSampleStore = defineStore('sample', {
  state: () => {
      return {
        sampleTypes: [],
        fetchingSampleTypes: false,
        samples: [],
        fetchingSamples: false,
        sampleCount: 0,
        samplePageInfo: undefined,
        sample: undefined,
        fetchingSample: false,
        childSample: undefined,
        fetchingChildSample: false,
        fetchingSamplesStatuses: false,
        analysisRequests: [], // for patient detail
        fetchingAnalysisRequests: false,
        analysisResults: [],
        fetchingResults: false,
        qcSets: [],
        fetchingQCSets: false,
        qcSet: undefined,
        fetchingQCSet: false,
        qcSetCount: 0,
        qcSetPageInfo: undefined,
      } as {
        sampleTypes: ISampleType[];
        fetchingSampleTypes: boolean;
        samples: ISample[];
        fetchingSamples: boolean;
        fetchingSamplesStatuses: boolean;
        sampleCount: number;
        samplePageInfo?: any;
        sample?: ISample;
        fetchingSample: boolean;
        childSample?: ISample;
        fetchingChildSample: boolean;
        analysisRequests: IAnalysisRequest[];
        fetchingAnalysisRequests: boolean;
        analysisResults: IAnalysisResult[];
        fetchingResults: boolean;
        qcSets: IQCSet[];
        fetchingQCSets: boolean;
        qcSet?: IQCSet | null;
        fetchingQCSet: boolean;
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
      getSChildSample: (state) => state.childSample,
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
    this.fetchingSampleTypes = true;
    await withClientQuery(GET_ALL_SAMPLE_TYPES, {}, "sampleTypeAll")
          .then(payload => {
            this.fetchingSampleTypes = false;
            this.sampleTypes = payload
          }).catch(err => this.fetchingSampleTypes = false)
  },
  updateSampleType(payload){
    const index = this.sampleTypes.findIndex(item => item.uid === payload?.uid)
    if(index > -1) this.sampleTypes[index] = payload
  },
  addSampleType(payload ){
    this.sampleTypes?.unshift(payload);
  },

  // SAMPLES
  resetSamples() {
    this.samples = [];
  },
  resetSample() {
    this.sample = undefined;
  },
  resetChildSample() {
    this.childSample = undefined;
  },
  setChildSample(sample) {
    this.childSample = sample;
  },
  async fetchSamples(params){
    this.fetchingSamples = true;
    await withClientQuery(GET_ALL_SAMPLES, params, undefined)
    .then(payload => {
      this.fetchingSamples = false;
      const page = payload.sampleAll
      const samples = page.items;

      if(params.filterAction){
        this.samples = samples;
      } else {
        this.samples = addListsUnique(this.samples, samples, "uid");
      }
  
      this.sampleCount = page?.totalCount;
      this.samplePageInfo = page?.pageInfo;
    }).catch(err => this.fetchingSamples = false)
  },
  async fetchSampleByUid(uid){
    if(!uid) return;
    this.fetchingSample = true;
    await withClientQuery( GET_SAMPLE_BY_UID, { uid }, "sampleByUid", 'network-only')
    .then(payload => {
      this.fetchingSample = false;
      payload.analyses = parseEdgeNodeToList(payload?.analyses) || [];
      payload.profiles = parseEdgeNodeToList(payload?.profiles) || [];
      this.sample = payload;

    }).catch(err => this.fetchingSample = false)
  },
  addSamples(samples){
    this.samples = addListsUnique(this.samples, samples, "uid");
  }, 
  updateSampleStatus(sample){
    const index = this.samples.findIndex(x => x.uid === sample.uid);
    if(index > -1) {
      this.samples[index].status = sample.status;
    }
    if (this.sample?.uid === sample.uid) {
      this.sample!.status = sample.status
    }
  },
  async fetchSampleStatus(uid){
    if(!uid){ return }
    this.fetchingSamplesStatuses = true;
    await withClientQuery(GET_SAMPLE_STATUS_BY_UID, { uid }, "sampleByUid", 'network-only')
    .then(payload => {
      this.fetchingSamplesStatuses =false
      if(this.sample && payload.status){
        this.sample.status = payload.status;
      }
      // also update sample listing
      this.updateSampleStatus(payload)
    }).catch(err => this.fetchingSamplesStatuses = false)
  }, 
  updateSamplesStatus(samples){
    samples?.forEach(sample => this.updateSampleStatus(sample))
  },
  async fetchSampleByParentId(parentId){
    if(!parentId) { return }
    this.fetchingChildSample = true
    await withClientQuery(GET_SAMPLE_BY_PARENT_ID, { parentId }, "sampleByParentId")
    .then(payload => {
      this.fetchingChildSample = false
      if(payload?.length > 0) {
        this.childSample = payload[0]
      };
    }).catch(err => this.fetchingChildSample = false)
  },

  // analysis request
  resetAnalysisRequests() {
    this.analysisRequests = [];
  },
  async fetchAnalysisRequestsForPatient(uid){
    if(!uid){ return }
    this.fetchingAnalysisRequests = true;
    await withClientQuery(GET_ANALYSIS_REQUESTS_BY_PATIENT_UID, { uid }, "analysisRequestsByPatientUid")
    .then(payload => {
      this.fetchingAnalysisRequests = false;
      this.analysisRequests = sortAnalysisRequests(payload)
    }).catch(err => this.fetchingAnalysisRequests = false)
  },
  async fetchAnalysisRequestsForClient(uid){
    if(!uid){ return }
    this.fetchingAnalysisRequests = true;
    await withClientQuery(GET_ANALYSIS_REQUESTS_BY_CLIENT_UID, { uid }, "analysisRequestsByClientUid")
    .then(payload => {
      this.fetchingAnalysisRequests = false;
      this.analysisRequests = sortAnalysisRequests(payload)
    }).catch(err => this.fetchingAnalysisRequests = false)
  },
  addAnalysisRequest(payload){
    this.analysisRequests?.unshift(payload)
  },

  // analysis results
  async fetchAnalysisResultsForSample(uid){
    if(!uid) return;
    this.fetchingResults = true;
    await withClientQuery( GET_ANALYSIS_RESULTS_BY_SAMPLE_UID, { uid }, "analysisResultBySampleUid", 'network-only')
    .then(payload => {
      this.fetchingResults = false;
      this.analysisResults = sortResults(payload)
    }).catch(err => this.fetchingResults = false)
  },
  updateAnalysesResults(payload: IAnalysisResult[]){
    payload?.forEach(result => {
      const index = this.analysisResults.findIndex(x => x.uid === result.uid);
      if(index > -1) {
        this.analysisResults[index] = result;
      } else {
        this.analysisResults?.push(result);
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
  backgroundProcessing(payload: any[], sampleUid: any, process){
    payload?.forEach(result => {
      const index = this.analysisResults.findIndex(x => x.uid === result.uid);
      if(index > -1) {
        this.analysisResults[index].status = process;
      }
    })
    if(sampleUid){
      if(this.sample?.uid === sampleUid){
        this.sample!.status = process;
      }
      const index = this.samples.findIndex(x => x.uid === sampleUid);
      if(index > -1) {
        this.samples[index].status = process;
      }
    }
  },

  // QC SETS
  resetQCSets(){
    this.qcSet = undefined;
  },
  async fetchQCSets(params){
    this.fetchingQCSets = true;
    await withClientQuery(GET_ALL_QC_SETS, params, undefined)
          .then(payload => {
            this.fetchingQCSets = false;
            const page = payload.qcSetAll
            const qcSets = page.items;

            if(params.filterAction){
              this.qcSets = [];
              this.qcSets = qcSets;
            } else {
              this.qcSets = addListsUnique(this.qcSets, qcSets, "uid");
            }
        
            this.qcSetCount = page?.totalCount;
            this.qcSetPageInfo = page?.pageInfo;
          }).catch(err => this.fetchingQCSets = false)
  },
  async fetchQCSetByUid(uid){
    if(!uid){ return }
    this.fetchingQCSet = true;
    await withClientQuery(GET_QC_SET_BY_UID, { uid }, "qcSetByUid")
    .then(payload => {
      this.fetchingQCSet = false
      this.qcSet = payload
    }).catch(err => this.fetchingQCSet = false)
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
