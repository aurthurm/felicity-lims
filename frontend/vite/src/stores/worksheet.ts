import { defineStore } from 'pinia'
import {
  GET_ALL_WORKSHEET_TEMPLATES, GET_ALL_WORKSHEETS, GET_WORKSHEET_BY_UID
} from '../graphql/worksheet.queries';
import {
  WORKSHEET_UPDATE
} from '../graphql/worksheet.mutations';

import { GET_ANALYSIS_RESULTS_FOR_WS_ASSIGN } from '../graphql/analyses.queries';
import { parseData, keysToCamel, addListsUnique } from '../utils';
import { IAnalysisResult } from '../models/analysis';
import { IWorkSheetTemplate, IWorkSheet, IReserved } from '../models/worksheet';


import { useApiUtil } from '../composables'

const { withClientQuery, withClientMutation } = useApiUtil()

export const useWorksheetStore = defineStore('worksheet', {
  state: () => {
      return {
        workSheetTemplates: [],
        fetchingWorkSheetTemplates: false,
        workSheets: [],
        fetchingWorkSheets: false,
        workSheet: undefined,
        workSheetCount: 0,
        workSheetPageInfo: undefined,
        fetchingAnalysisResults: false,
        analysisResults: [], // for WS Assign
        analysisResultCount: 0,
        analysisResultPageInfo: undefined,
      } as {
        workSheetTemplates: IWorkSheetTemplate[];
        fetchingWorkSheetTemplates: boolean;
        workSheets: IWorkSheet[];
        fetchingWorkSheets: boolean;
        workSheet?: IWorkSheet;
        workSheetCount: number;
        workSheetPageInfo?: any;
        fetchingAnalysisResults?: boolean;
        analysisResults: IAnalysisResult[];
        analysisResultCount: number;
        analysisResultPageInfo?: any;
      }
  },
  getters: {
    getWorkSheetTemplates: (state) => state.workSheetTemplates,
    getWorkSheets: (state) => sortWorksheets(state.workSheets),
    getWorkSheet: (state) => state.workSheet,
    getWorkSheetByUid: (state) => (uid: number) => state.workSheets?.find(ws => ws.uid === uid),
    getWorkSheetCount: (state) => state.workSheetCount,
    getWorkSheetPageInfo: (state) => state.workSheetPageInfo,
    getAnalysisResults: (state) => state.analysisResults,
    getAnalysisResultCount: (state) => state.analysisResultCount,
    getAnalysisResultPageInfo: (state) => state.analysisResultPageInfo,
  },
  actions: {

  // WorkSheet Templates
  async fetchWorkSheetTemplates(){
    this.fetchingWorkSheetTemplates = true;
    await withClientQuery(GET_ALL_WORKSHEET_TEMPLATES, {}, "worksheetTemplateAll")
          .then(payload => {
            this.fetchingWorkSheetTemplates = false;
              payload?.forEach((template: IWorkSheetTemplate) => {
                const data: any = template.reserved;
                const reserved = Object.entries(parseData(data)) as any[];
                let new_res: IReserved[] = [];
                reserved?.forEach(item => new_res.push(keysToCamel(item[1]) as IReserved || {}));
                template.reserved = new_res;
              });
              this.workSheetTemplates = payload;
          }).catch(err => this.fetchingWorkSheetTemplates = false);
  },
  updateWorksheetTemplate(payload){
    const index = this.workSheetTemplates.findIndex(x => x.uid === payload.uid);
    const data: any = payload.reserved;
    const reserved = Object.entries(parseData(data)) as any[];
    let new_res: IReserved[] = [];
    reserved?.forEach(item => new_res.push(item[1] as IReserved || {}));
    payload.reserved = new_res;
    this.workSheetTemplates[index] = payload;
  },
  addWorksheetTemplate(payload ){
    const data: any = payload.reserved;
    const reserved = Object.entries(parseData(data)) as any[];
    let new_res: IReserved[] = [];
    reserved?.forEach(item => new_res.push(item[1] as IReserved || {}));
    payload.reserved = new_res;
    this.workSheetTemplates?.push(payload);
  },

  // WorkSheets
  async fetchWorkSheets(params){
    this.fetchingWorkSheets = true;
    await withClientQuery(GET_ALL_WORKSHEETS, params, undefined)
          .then(payload => {
            this.fetchingWorkSheets = false;
            const page = payload.worksheetAll
            const worksheets = page.items;
            if(params.filterAction){
              this.workSheets = [];
              this.workSheets = worksheets;
            } else {
              this.workSheets = addListsUnique(this.workSheets, worksheets, "uid");
            }
            this.workSheetCount = page?.totalCount;
            this.workSheetPageInfo = page?.pageInfo;
          }).catch(err => this.fetchingWorkSheets = false);
  },
  async fetchWorksheetByUid(worksheetUid: number){
    await withClientQuery(GET_WORKSHEET_BY_UID, { worksheetUid }, "worksheetByUid")
          .then(payload => this.workSheet = sortAnalysisResults(payload));
  },
  addWorksheet(payload){
    payload.worksheets?.forEach(worksheet => this.workSheets?.unshift(worksheet))
  },
  removeWorksheet(){
    this.workSheet = undefined
  },
  async updateWorksheet(payload){
    await withClientMutation(WORKSHEET_UPDATE, payload, "updateWorksheet")
          .then(payload => {});
  },
  updateWorksheetStatus(worksheet: any){
    const index = this.workSheets.findIndex(x => x.uid === worksheet.uid);
    if(index > -1) {
      this.workSheets[index].state = worksheet.state;
    }
    if(this.workSheet?.uid === worksheet.uid) {
      this.workSheet!.state = worksheet.state;
    }
  },
  backgroundProcessing(payload, worksheetUid: any, process){
    payload?.forEach(result => {
      this.workSheet?.analysisResults.forEach((wsResult, index) => {
        if(wsResult?.uid == result.uid) {
          wsResult.status = process;
        }
      })
    })
    if(worksheetUid){
      if(this.workSheet?.uid === worksheetUid){
        this.workSheet!.state = process;
      }
      const index = this.workSheets.findIndex(x => x.uid === worksheetUid);
      if(index > -1) {
        this.workSheets[index].state = process;
      }
    }
  },

  // Analyses for WS Assign
  async fetchForWorkSheetsAssign(params){
    this.fetchingAnalysisResults = true;
    await withClientQuery(GET_ANALYSIS_RESULTS_FOR_WS_ASSIGN, params, undefined)
          .then(payload => {
            this.fetchingAnalysisResults = false;
            const page = payload.analysisResultsForWsAssign
            const results = page.items;
            if(params.filterAction){
              this.analysisResults = [];
              this.analysisResults = results;
            } else {
              this.analysisResults = results; // addListsUnique(this.analysisResults, results, "uid");
            }
            this.analysisResultCount = page?.totalCount;
            this.analysisResultPageInfo = page?.pageInfo;
          }).catch(err => this.fetchingAnalysisResults = false);
    },

    // analysis results
    updateWorksheetResultsStatus(payload){
      payload?.forEach(result => {
        this.workSheet?.analysisResults.forEach((wsResult, index) => {
          if(wsResult?.uid == result.uid) {
            wsResult.status = result.status;
          }
        })
      })
    },
    updateAnalysesResults(payload: IAnalysisResult[]){
      payload?.forEach(result => {
        const index = this.analysisResults.findIndex(x => x.uid === result.uid);
        if(index > -1) {
          this.analysisResults[index] = { ...this.analysisResults[index], ...result};
        }
      })
    },
  
  }
})

function sortAnalysisResults(ws: any): IWorkSheet {
  ws.analysisResults = ws?.analysisResults?.sort((a: IAnalysisResult, b: IAnalysisResult) => {
    if(a.worksheetPosition === b.worksheetPosition) {
      return (a?.uid || 0) > (b?.uid || 0) ? 1 : -1;
    }
    return (a?.worksheetPosition || 0) > (b?.worksheetPosition || 1) ? 1 : -1
  });
  return ws;
}

function sortWorksheets(ws: IWorkSheet[]): IWorkSheet[] {
  return ws?.sort((a: IWorkSheet, b: IWorkSheet) => (a?.uid || 0) < (b?.uid || 0) ? 1 : -1);
}
