import { useQuery } from '@urql/vue';
import { urqlClient } from '../../urql';
import { RootState } from '../state';
import { ActionTree, GetterTree, MutationTree } from 'vuex';

import {
  GET_ALL_WORKSHEET_TEMPLATES, GET_ALL_WORKSHEETS, GET_WORKSHEET_BY_UID
} from '../../graphql/worksheet.queries';
import { IInstrument } from './setup';
import { IAnalysisService } from './analyses';
import { parseEdgeNodeToList, parseData, snakeToCamel, keysToCamel } from '../../utils';
import { IAnalysisResult } from './samples';


export interface IReserved {
  position: number;
  levelUid?: string;
}

export class Reserved implements IReserved {
  constructor(
    public position: number,
    public levelUid?: string,
  ){
  }
}

export interface IWorkSheetTemplate {
  uid?: string;
  name?: string;
  qcTemplateUid?: string;
  reserved?: IReserved[];
  preview?: IReserved[];
  numberOfSamples?: number;
  rows?: number;
  cols?: number;
  rowWise?: Boolean;
  worksheetType?: string;
  instrument?: IInstrument;
  description?: string;
  analyses?: IAnalysisService[];
  state?: string;
}

export class WorkSheetTemplate implements IWorkSheetTemplate {
  constructor(
    public uid?: string,
    public name?: string,
    public reserved?: IReserved[],
    public preview?: IReserved[],
    public numberOfSamples?: number,
    public rows?: number,
    public cols?: number,
    public rowWise?: Boolean,
    public qcTemplateUid?: string,
    public worksheetType?: string,
    public instrument?: IInstrument,
    public description?: string,
    public analyses?: IAnalysisService[],
    public state?: string,
    ){
      this.analyses = [];
      this.worksheetType = 'flat';
      this.rowWise = true;
      this.reserved = [new Reserved(1,"Blank"), new Reserved(2,"Control"), new Reserved(3,"Control")];
  }
}


export interface IWorkSheet {
  uid?: string;
  name?: string;
  reserved?: string[];
  plate?: Map<string, string>;
  numberOfSamples?: number;
  analysisResults?: IAnalysisResult[],
  rows?: number;
  cols?: number;
  rowWise?: Boolean;
  worksheetType?: string;
  instrument?: IInstrument;
  description?: string;
  analyses?: IAnalysisService[];
  state?: string;
}

export class WorkSheet implements IWorkSheet {
  constructor(
    public uid?: string,
    public name?: string,
    public reserved?: string[],
    public plate?: Map<string, string>,
    public numberOfSamples?: number,
    public analysisResults?: IAnalysisResult[],
    public rows?: number,
    public cols?: number,
    public rowWise?: Boolean,
    public worksheetType?: string,
    public instrument?: IInstrument,
    public description?: string,
    public analyses?: IAnalysisService[],
    public state?: string,
    ){}
}

// state contract
export interface IState {
  workSheetTemplates: IWorkSheetTemplate[];
  workSheets: IWorkSheet[];
  workSheet: IWorkSheet | null;
}

export const initialState = () => {
  return <IState>{
    workSheetTemplates: [],
    workSheets: [],
    workSheet: null,
  };
};

export const state: IState = initialState();

export enum MutationTypes {
  RESET_STATE = 'RESET_STATE',

  SET_WORKSHEETS = 'SET_WORKSHEETS',
  SET_WORKSHEET = 'SET_WORKSHEET',
  REMOVE_WORKSHEET = 'REMOVE_WORKSHEET',

  SET_WORKSHEET_TEMPLATES = 'SET_WORKSHEET_TEMPLATES',
  ADD_WORKSHEET_TEMPLATE = 'ADD_WORKSHEET_TEMPLATE',
  UPDATE_WORKSHEET_TEMPLATE = 'UPDATE_WORKSHEET_TEMPLATE',
}

export enum ActionTypes {
  RESET_STATE = 'RESET_STATE',

  FETCH_WORKSHEETS = 'FETCH_WORKSHEETS',
  FETCH_WORKSHEET_BY_UID = 'FETCH_WORKSHEET_BY_UID',
  REMOVE_WORKSHEET = 'REMOVE_WORKSHEET',

  FETCH_WORKSHEET_TEMPLATES = 'FETCH_WORKSHEET_TEMPLATES',
  ADD_WORKSHEET_TEMPLATE = 'ADD_WORKSHEET_TEMPLATE',
  UPDATE_WORKSHEET_TEMPLATE = 'UPDATE_WORKSHEET_TEMPLATE',
}

function sortAnalysisResults(ws: any): IWorkSheet {
  ws.analysisResults = ws?.analysisResults?.sort((a: IAnalysisResult, b: IAnalysisResult) => {
    if(a.worksheetPosition === b.worksheetPosition) {
      return (a?.uid || 0) > (b?.uid || 0) ? 1 : -1;;
    }
    return (a?.worksheetPosition || 0) > (b?.worksheetPosition || 1) ? 1 : -1
  });
  return ws;
}

// Getters
export const getters = <GetterTree<IState, RootState>>{
  getWorkSheetTemplates: (state) => state.workSheetTemplates,
  getWorkSheets: (state) => state.workSheets,
  getWorkSheet: (state) => state.workSheet,
  getWorkSheetByUid: (state) => (uid: string) => state.workSheets?.find(ws => ws.uid === uid),
};

// Mutations
export const mutations = <MutationTree<IState>>{
  [MutationTypes.RESET_STATE](state: IState): void {
    Object.assign(state, initialState());
  },

  // WorkSheet Templates
  [MutationTypes.SET_WORKSHEET_TEMPLATES](state: IState, payload: any): void {
    state.workSheetTemplates = [];
    let wst = parseEdgeNodeToList(payload);
    wst?.forEach((template: IWorkSheetTemplate) => {
      template.analyses = parseEdgeNodeToList(template?.analyses) || [];
      const data: any = template.reserved;
      const reserved = Object.entries(parseData(data)) as any[];
      let new_res: IReserved[] = [];
      console.log(reserved);
      reserved?.forEach(item => new_res.push(keysToCamel(item[1]) as IReserved || {}));
      template.reserved = new_res;
    });
    console.log(wst)
    state.workSheetTemplates = wst;
  },

  [MutationTypes.UPDATE_WORKSHEET_TEMPLATE](state: IState, payload: IWorkSheetTemplate): void {
    const index = state.workSheetTemplates.findIndex(x => x.uid === payload.uid);
    let wst = payload;
    wst.analyses = parseEdgeNodeToList(wst?.analyses) || [];
    const data: any = wst.reserved;
    const reserved = Object.entries(parseData(data)) as any[];
    let new_res: IReserved[] = [];
    reserved?.forEach(item => new_res.push(item[1] as IReserved || {}));
    wst.reserved = new_res;
    state!.workSheetTemplates[index] = wst;
  },

  [MutationTypes.ADD_WORKSHEET_TEMPLATE](state: IState, payload: IWorkSheetTemplate): void {
    let wst = payload;
    wst.analyses = parseEdgeNodeToList(wst?.analyses) || [];
    const data: any = wst.reserved;
    const reserved = Object.entries(parseData(data)) as any[];
    let new_res: IReserved[] = [];
    reserved?.forEach(item => new_res.push(item[1] as IReserved || {}));
    wst.reserved = new_res;
    state.workSheetTemplates.push(wst);
  },

  // WorkSheetS
  [MutationTypes.SET_WORKSHEETS](state: IState, payload: any): void {
    state.workSheets = [];
    let wst = parseEdgeNodeToList(payload);
    wst?.forEach((workSheet: any) => {
      workSheet.analyses = parseEdgeNodeToList(workSheet?.analyses) || [];
    });
    state.workSheets = wst;
  },

  [MutationTypes.SET_WORKSHEET](state: IState, payload: any): void {
    let wst = payload;
    wst.analyses = parseEdgeNodeToList(wst?.analyses) || [];
    wst.analysisResults = parseEdgeNodeToList(wst?.analysisResults) || [];
    wst.analysisResults?.forEach((ar: any) => {
      ar.analysis.resultoptions = parseEdgeNodeToList(ar?.analysis?.resultoptions) || [];
    });
    state.workSheet = sortAnalysisResults(wst);
  },

  [MutationTypes.REMOVE_WORKSHEET](state: IState): void {
    state.workSheet = null;
  },

};

// Actions
export const actions = <ActionTree<IState, RootState>>{
  async [ActionTypes.RESET_STATE]({ commit }) {
    commit(MutationTypes.RESET_STATE);
  },

  // WorkSheet Templates
  async [ActionTypes.FETCH_WORKSHEET_TEMPLATES]({ commit }){
    await useQuery({ query: GET_ALL_WORKSHEET_TEMPLATES })
          .then(payload => commit(MutationTypes.SET_WORKSHEET_TEMPLATES, payload.data.value.worksheetTemplateAll));
  },

  async [ActionTypes.UPDATE_WORKSHEET_TEMPLATE]({ commit }, payload ){
    commit(MutationTypes.UPDATE_WORKSHEET_TEMPLATE, payload.data.updateWorksheetTemplate.worksheetTemplate);
  },

  async [ActionTypes.ADD_WORKSHEET_TEMPLATE]({ commit }, payload ){
    commit(MutationTypes.ADD_WORKSHEET_TEMPLATE, payload.data.createWorksheetTemplate.worksheetTemplate);
  },

  // WorkSheetS
  async [ActionTypes.FETCH_WORKSHEETS]({ commit }){
    await useQuery({ query: GET_ALL_WORKSHEETS })
          .then(payload => commit(MutationTypes.SET_WORKSHEETS, payload.data.value.worksheetAll));
  },

  async [ActionTypes.FETCH_WORKSHEET_BY_UID]({ commit }, uid){
    await urqlClient
    .query( GET_WORKSHEET_BY_UID, { worksheetUid: uid })
    .toPromise()
    .then(result => commit(MutationTypes.SET_WORKSHEET, result.data.worksheetByUid))
  },

  async [ActionTypes.REMOVE_WORKSHEET]({ commit } ){
    commit(MutationTypes.REMOVE_WORKSHEET);
  },

};

// namespaced: true,
export const worksheets = {
  state,
  mutations,
  actions,
  getters,
};