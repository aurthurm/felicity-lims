import { defineStore } from 'pinia'
import {
  GET_ALL_WORKSHEET_TEMPLATES, GET_ALL_WORKSHEETS, GET_WORKSHEET_BY_UID
} from '../graphql/worksheet.queries';
import { parseData, keysToCamel, addListsUnique } from '../utils';
import { IAnalysisResult } from '../models/analysis';
import { IWorkSheetTemplate, IWorkSheet, IReserved } from '../models/worksheet';


import { useApiUtil } from '../composables'

const { withClientQuery } = useApiUtil()

export const useWorksheetStore = defineStore('worksheet', {
  state: () => {
      return {
        workSheetTemplates: [],
        workSheets: [],
        workSheet: undefined,
        workSheetCount: 0,
        workSheetPageInfo: undefined,
      } as {
        workSheetTemplates: IWorkSheetTemplate[];
        workSheets: IWorkSheet[];
        workSheet?: IWorkSheet;
        workSheetCount: number;
        workSheetPageInfo?: any;
      }
  },
  getters: {
    getWorkSheetTemplates: (state) => state.workSheetTemplates,
    getWorkSheets: (state) => sortWorksheets(state.workSheets),
    getWorkSheet: (state) => state.workSheet,
    getWorkSheetByUid: (state) => (uid: number) => state.workSheets?.find(ws => ws.uid === uid),
    getWorkSheetCount: (state) => state.workSheetCount,
    getWorkSheetPageInfo: (state) => state.workSheetPageInfo,
  },
  actions: {

  // WorkSheet Templates
  async fetchWorkSheetTemplates(){
    await withClientQuery(GET_ALL_WORKSHEET_TEMPLATES, {}, "worksheetTemplateAll")
          .then(payload => {
              payload?.forEach((template: IWorkSheetTemplate) => {
                const data: any = template.reserved;
                const reserved = Object.entries(parseData(data)) as any[];
                let new_res: IReserved[] = [];
                reserved?.forEach(item => new_res.push(keysToCamel(item[1]) as IReserved || {}));
                template.reserved = new_res;
              });
              this.workSheetTemplates = payload;
          });
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
    this.workSheetTemplates.push(payload);
  },

  // WorkSheets
  async fetchWorkSheets(params){
    await withClientQuery(GET_ALL_WORKSHEETS, params, undefined)
          .then(payload => {
            const page = payload.worksheetAll
            const worksheets = page.items;
            if(params.filterAction){
              this.workSheets = [];
              this.workSheets = worksheets;
            } else {
              this.workSheets = addListsUnique(this.workSheets, worksheets, "uid");
            }
            this.workSheetCount = page.worksheets?.totalCount;
            this.workSheetPageInfo = page.worksheets?.pageInfo;
          });
  },
  async fetchWorksheetByUid(uid: number){
    await withClientQuery(GET_WORKSHEET_BY_UID, { uid }, "worksheetByUid")
          .then(payload => this.workSheet = sortAnalysisResults(payload));
  },
  addWorksheet(payload){
    this.workSheets.unshift(payload)
  },
  removeWorksheet(){
    this.workSheet = undefined
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
